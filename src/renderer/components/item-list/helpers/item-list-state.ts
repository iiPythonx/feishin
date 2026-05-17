import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react';

import { itemListSelectors } from '/@/renderer/components/item-list/helpers/item-list-reducer-utils';
import { LibraryItem } from '/@/shared/types/domain-types';

const sortByDataOrder = <T>(
    items: T[],
    data: unknown[],
    extractRowId: (item: unknown) => string | undefined,
    isIdArray: boolean,
): T[] => {
    const rowIdToIndex = new Map<string, number>();

    // Create a map of rowId to index in the data array
    data.forEach((item, index) => {
        if (item && typeof item === 'object') {
            const itemRowId = extractRowId(item);
            if (itemRowId) {
                rowIdToIndex.set(itemRowId, index);
            }
        }
    });

    // Sort items by their index in the data array (create new array to avoid mutation)
    return [...items].sort((a, b) => {
        const rowIdA = isIdArray ? (a as string) : extractRowId(a as unknown);
        const rowIdB = isIdArray ? (b as string) : extractRowId(b as unknown);
        const indexA = rowIdA ? (rowIdToIndex.get(rowIdA) ?? Infinity) : Infinity;
        const indexB = rowIdB ? (rowIdToIndex.get(rowIdB) ?? Infinity) : Infinity;
        return indexA - indexB;
    });
};

export type ItemListAction =
    | {
          extractRowId: (item: unknown) => string | undefined;
          payload: ItemListStateItemWithRequiredProperties;
          type: 'TOGGLE_SELECTED';
      }
    | {
          extractRowId: (item: unknown) => string | undefined;
          payload: ItemListStateItemWithRequiredProperties[];
          type: 'SET_DRAGGING';
      }
    | {
          extractRowId: (item: unknown) => string | undefined;
          payload: ItemListStateItemWithRequiredProperties[];
          type: 'SET_SELECTED';
      }
    | { type: 'CLEAR_ALL' }
    | { type: 'CLEAR_DRAGGING' }
    | { type: 'CLEAR_SELECTED' };

export interface ItemListState {
    dragging: Set<string>;
    draggingItems: Map<string, unknown>;
    selected: Set<string>;
    selectedItems: Map<string, unknown>;
    version: number;
}

export interface ItemListStateActions {
    clearAll: () => void;
    clearDragging: () => void;
    clearSelected: () => void;
    deselectAll: () => void;
    extractRowId: (item: unknown) => string | undefined;
    findItemIndex: (rowId: string) => number;
    getData: () => unknown[];
    getDragging: () => unknown[];
    getDraggingIds: () => string[];
    getSelected: () => unknown[];
    getSelectedIds: () => string[];
    getVersion: () => number;
    hasDragging: () => boolean;
    hasSelected: () => boolean;
    isAllSelected: () => boolean;
    isDragging: (rowId: string) => boolean;
    isSelected: (rowId: string) => boolean;
    isSomeSelected: () => boolean;
    selectAll: () => void;
    setDragging: (items: ItemListStateItemWithRequiredProperties[]) => void;
    setSelected: (items: ItemListStateItemWithRequiredProperties[]) => void;
    toggleSelected: (item: ItemListStateItemWithRequiredProperties) => void;
}

export interface ItemListStateItem {
    _itemType: LibraryItem;
    _serverId: string;
    id: string;
    imageId: null | string;
}

export type ItemListStateItemWithRequiredProperties = Record<string, unknown> & {
    _itemType: LibraryItem;
    _serverId: string;
    id: string;
};

/**
 * Reusable reducer for item grid state management
 * Can be used in different components or contexts
 */
export const itemListReducer = (state: ItemListState, action: ItemListAction): ItemListState => {
    switch (action.type) {
        case 'CLEAR_ALL':
            return {
                ...state,
                dragging: new Set(),
                draggingItems: new Map(),
                selected: new Set(),
                selectedItems: new Map(),
                version: state.version + 1,
            };

        case 'CLEAR_DRAGGING':
            return {
                ...state,
                dragging: new Set(),
                draggingItems: new Map(),
                version: state.version + 1,
            };

        case 'CLEAR_SELECTED':
            return {
                ...state,
                selected: new Set(),
                selectedItems: new Map(),
                version: state.version + 1,
            };

        case 'SET_DRAGGING': {
            const newDragging = new Set<string>();
            const newDraggingItems = new Map<string, unknown>();

            action.payload.forEach((item) => {
                const rowId = action.extractRowId(item);
                if (rowId) {
                    newDragging.add(rowId);
                    newDraggingItems.set(rowId, item);
                }
            });

            return {
                ...state,
                dragging: newDragging,
                draggingItems: newDraggingItems,
                version: state.version + 1,
            };
        }

        case 'SET_SELECTED': {
            const newSelected = new Set<string>();
            const newSelectedItems = new Map<string, unknown>();

            action.payload.forEach((item) => {
                const rowId = action.extractRowId(item);
                if (rowId) {
                    newSelected.add(rowId);
                    newSelectedItems.set(rowId, item);
                }
            });

            return {
                ...state,
                selected: newSelected,
                selectedItems: newSelectedItems,
                version: state.version + 1,
            };
        }

        case 'TOGGLE_SELECTED': {
            const newSelected = new Set(state.selected);
            const newSelectedItems = new Map(state.selectedItems);

            const rowId = action.extractRowId(action.payload);
            if (!rowId) {
                return state;
            }

            if (newSelected.has(rowId)) {
                newSelected.delete(rowId);
                newSelectedItems.delete(rowId);
            } else {
                newSelected.add(rowId);
                newSelectedItems.set(rowId, action.payload);
            }

            return {
                ...state,
                selected: newSelected,
                selectedItems: newSelectedItems,
                version: state.version + 1,
            };
        }

        default:
            return state;
    }
};

export const initialItemListState: ItemListState = {
    dragging: new Set(),
    draggingItems: new Map(),
    selected: new Set(),
    selectedItems: new Map(),
    version: 0,
};

/**
 * External store for item list state that doesn't cause React rerenders
 * Components can subscribe to specific state slices using useSyncExternalStore
 */
class ItemListStateStore {
    // Cache for derived values to prevent unnecessary rerenders
    private listeners = new Set<() => void>();
    private state: ItemListState = { ...initialItemListState };

    dispatch(action: ItemListAction): void {
        this.state = itemListReducer(this.state, action);
        // Notify all subscribers
        this.listeners.forEach((listener) => listener());
    }

    getState(): ItemListState {
        return this.state;
    }

    subscribe(listener: () => void): () => void {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }
}

/**
 * Hook to subscribe to specific state changes in the item list state
 * Use this in components that need to rerender when state changes
 */
export const useItemListStateSubscription = <T>(
    internalState: ItemListStateActions | undefined,
    selector: (state: ItemListState | null) => T,
): T => {
    const store = internalState ? ((internalState as any).__store as ItemListStateStore) : null;

    return useSyncExternalStore(
        store?.subscribe.bind(store) || (() => () => {}), // Return no-op unsubscribe if no store
        () => selector(store?.getState() || null),
    );
};

/**
 * Hook to subscribe to selection state for a specific item
 * Use this in components that need to rerender when a specific item's selection changes
 */
export const useItemSelectionState = (
    internalState: ItemListStateActions | undefined,
    rowId: string | undefined,
): boolean => {
    return useItemListStateSubscription(internalState, (state) =>
        state && rowId ? state.selected.has(rowId) : false,
    );
};

/**
 * Hook to subscribe to dragging state for a specific item
 * Use this in components that need to rerender when a specific item's dragging state changes
 */
export const useItemDraggingState = (
    internalState: ItemListStateActions | undefined,
    rowId: string | undefined,
): boolean => {
    return useItemListStateSubscription(internalState, (state) =>
        state && rowId ? state.dragging.has(rowId) : false,
    );
};

export const useItemListState = (
    getDataFn?: () => unknown[],
    extractRowId?: (item: unknown) => string | undefined,
): ItemListStateActions => {
    // Create store instance (stable across rerenders)
    const storeRef = useRef<ItemListStateStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new ItemListStateStore();
    }
    const store = storeRef.current;

    // DON'T subscribe here - this prevents rerenders when state changes
    // Components that need to react should use useItemListStateSubscription

    // Get current state (this doesn't cause rerenders, it's just reading from the store)
    const getCurrentState = useCallback(() => store.getState(), [store]);

    const extractRowIdFn = useCallback(
        (item: unknown) => {
            if (extractRowId) {
                return extractRowId(item);
            }
            // Fallback to id if extractRowId is not provided
            if (item && typeof item === 'object' && 'id' in item) {
                return (item as any).id;
            }
            return undefined;
        },
        [extractRowId],
    );

    const setDragging = useCallback(
        (items: ItemListStateItemWithRequiredProperties[]) => {
            store.dispatch({
                extractRowId: extractRowIdFn,
                payload: items,
                type: 'SET_DRAGGING',
            });
        },
        [store, extractRowIdFn],
    );

    const setSelected = useCallback(
        (items: ItemListStateItemWithRequiredProperties[]) => {
            store.dispatch({
                extractRowId: extractRowIdFn,
                payload: items,
                type: 'SET_SELECTED',
            });
        },
        [store, extractRowIdFn],
    );

    const toggleSelected = useCallback(
        (item: ItemListStateItemWithRequiredProperties) => {
            store.dispatch({
                extractRowId: extractRowIdFn,
                payload: item,
                type: 'TOGGLE_SELECTED',
            });
        },
        [store, extractRowIdFn],
    );

    // These methods read from the store without subscribing, so they don't cause rerenders
    const isSelected = useCallback(
        (rowId: string) => {
            const state = getCurrentState();
            return itemListSelectors.isSelected(state, rowId);
        },
        [getCurrentState],
    );

    const getDragging = useCallback(() => {
        const state = getCurrentState();
        return itemListSelectors.getDragging(state);
    }, [getCurrentState]);

    const getSelected = useCallback(() => {
        const state = getCurrentState();
        const selectedItems = itemListSelectors.getSelected(state);
        const data = getDataFn ? getDataFn() : [];
        return sortByDataOrder(selectedItems, data, extractRowIdFn, false);
    }, [getCurrentState, getDataFn, extractRowIdFn]);

    const getDraggingIds = useCallback(() => {
        const state = getCurrentState();
        return Array.from(state.dragging);
    }, [getCurrentState]);

    const getSelectedIds = useCallback(() => {
        const state = getCurrentState();
        const selectedIds = Array.from(state.selected);
        const data = getDataFn ? getDataFn() : [];
        return sortByDataOrder(selectedIds, data, extractRowIdFn, true);
    }, [getCurrentState, getDataFn, extractRowIdFn]);

    const clearDragging = useCallback(() => {
        store.dispatch({ type: 'CLEAR_DRAGGING' });
    }, [store]);

    const clearSelected = useCallback(() => {
        store.dispatch({ type: 'CLEAR_SELECTED' });
    }, [store]);

    const clearAll = useCallback(() => {
        store.dispatch({ type: 'CLEAR_ALL' });
    }, [store]);

    const getVersion = useCallback(() => {
        const state = getCurrentState();
        return itemListSelectors.getVersion(state);
    }, [getCurrentState]);

    const hasDragging = useCallback(() => {
        const state = getCurrentState();
        return itemListSelectors.hasAnyDragging(state);
    }, [getCurrentState]);

    const hasSelected = useCallback(() => {
        const state = getCurrentState();
        return itemListSelectors.hasAnySelected(state);
    }, [getCurrentState]);

    const isDragging = useCallback(
        (rowId: string) => {
            const state = getCurrentState();
            return itemListSelectors.isDragging(state, rowId);
        },
        [getCurrentState],
    );

    const getData = useCallback(() => {
        const data = getDataFn ? getDataFn() : [];
        // Filter out null/undefined values (e.g., group header rows)
        return data.filter((d) => d != null);
    }, [getDataFn]);

    const findItemIndex = useCallback(
        (rowId: string) => {
            const data = getDataFn ? getDataFn() : [];
            // Filter out null/undefined values (e.g., header row)
            const validData = data.filter((d) => d && typeof d === 'object');
            if (!extractRowId) {
                // Fallback to id if extractRowId is not provided
                return validData.findIndex((d) => (d as any).id === rowId);
            }
            return validData.findIndex((d) => extractRowId(d) === rowId);
        },
        [getDataFn, extractRowId],
    );

    const selectAll = useCallback(() => {
        const data = getDataFn ? getDataFn() : [];
        const items = data
            .filter((d) => d && typeof d === 'object')
            .map((d) => d as ItemListStateItemWithRequiredProperties);
        store.dispatch({ extractRowId: extractRowIdFn, payload: items, type: 'SET_SELECTED' });
    }, [extractRowIdFn, getDataFn, store]);

    const deselectAll = useCallback(() => {
        store.dispatch({ type: 'CLEAR_SELECTED' });
    }, [store]);

    const isAllSelected = useCallback(() => {
        const state = getCurrentState();
        const data = getDataFn ? getDataFn() : [];
        return state.selected.size === data.filter((d) => d && typeof d === 'object').length;
    }, [getCurrentState, getDataFn]);

    const isSomeSelected = useCallback(() => {
        const state = getCurrentState();
        return state.selected.size > 0;
    }, [getCurrentState]);

    // Expose the store so components can subscribe if needed
    // Store it in the actions object for access
    const actions = useMemo(() => {
        const actionsObj = {
            __getState: getCurrentState,
            __store: store,
            clearAll,
            clearDragging,
            clearSelected,
            deselectAll,
            extractRowId: extractRowIdFn,
            findItemIndex,
            getData,
            getDragging,
            getDraggingIds,
            getSelected,
            getSelectedIds,
            getVersion,
            hasDragging,
            hasSelected,
            isAllSelected,
            isDragging,
            isSelected,
            isSomeSelected,
            selectAll,
            setDragging,
            setSelected,
            toggleSelected,
        } as ItemListStateActions & {
            __getState: () => ItemListState;
            __store: ItemListStateStore;
        };
        return actionsObj;
    }, [
        getCurrentState,
        store,
        clearAll,
        clearDragging,
        clearSelected,
        isAllSelected,
        isSomeSelected,
        deselectAll,
        extractRowIdFn,
        findItemIndex,
        getData,
        getDragging,
        getDraggingIds,
        getSelected,
        getSelectedIds,
        getVersion,
        hasDragging,
        hasSelected,
        isDragging,
        isSelected,
        selectAll,
        setDragging,
        setSelected,
        toggleSelected,
    ]);

    return actions;
};
