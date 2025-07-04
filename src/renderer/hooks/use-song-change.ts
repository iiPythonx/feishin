import { RowNode } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import { MutableRefObject, useCallback, useEffect } from 'react';

import { useEventStore, UserEvent } from '/@/renderer/store/event.store';
import { Song } from '/@/shared/types/domain-types';

export const useSongChange = (
    handler: (ids: string[], event: UserEvent) => void,
    enabled: boolean,
) => {
    useEffect(() => {
        if (!enabled) return () => {};

        const unSub = useEventStore.subscribe((state) => {
            if (state.event) {
                handler(state.ids, state.event);
            }
        });

        return () => {
            unSub();
        };
    }, [handler, enabled]);
};

export const useTableChange = (
    tableRef: MutableRefObject<AgGridReact | null>,
    enabled: boolean,
) => {
    const handler = useCallback(
        (ids: string[], event: UserEvent) => {
            const api = tableRef.current?.api;
            if (!api) return;

            const idSet = new Set(ids);

            api.forEachNode((node: RowNode<Song>) => {
                if (!node.data || !idSet.has(node.data.id)) return;

                // Make sure to use setData instead of setDataValue. setDataValue
                // will error if the column does not exist, whereas setData won't care
                switch (event.event) {
                    case 'favorite': {
                        if (node.data.userFavorite !== event.favorite) {
                            node.setData({ ...node.data, userFavorite: event.favorite });
                        }
                        break;
                    }
                    case 'play':
                        if (node.data.lastPlayedAt !== event.timestamp) {
                            node.setData({
                                ...node.data,
                                lastPlayedAt: event.timestamp,
                                playCount: node.data.playCount + 1,
                            });
                        }
                        node.data.lastPlayedAt = event.timestamp;
                        break;
                    case 'rating': {
                        if (node.data.userRating !== event.rating) {
                            node.setData({ ...node.data, userRating: event.rating });
                        }
                        break;
                    }
                }
            });
        },
        [tableRef],
    );

    useSongChange(handler, enabled);
};
