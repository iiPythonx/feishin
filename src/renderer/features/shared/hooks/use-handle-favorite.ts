import { MutableRefObject, useCallback } from 'react';

import { VirtualInfiniteGridRef } from '/@/renderer/components/virtual-grid/virtual-infinite-grid';
import { useCreateFavorite } from '/@/renderer/features/shared/mutations/create-favorite-mutation';
import { useDeleteFavorite } from '/@/renderer/features/shared/mutations/delete-favorite-mutation';
import { useCurrentServerId } from '/@/renderer/store';
import { LibraryItem } from '/@/shared/types/domain-types';

interface HandleFavoriteProps {
    gridRef: MutableRefObject<null | VirtualInfiniteGridRef>;
}

export const useHandleFavorite = ({ gridRef }: HandleFavoriteProps) => {
    const createFavoriteMutation = useCreateFavorite({});
    const deleteFavoriteMutation = useDeleteFavorite({});
    const serverId = useCurrentServerId();

    const handleFavorite = useCallback(
        async (options: { id: string[]; isFavorite: boolean; itemType: LibraryItem }) => {
            const { id, isFavorite, itemType } = options;
            try {
                if (isFavorite) {
                    await deleteFavoriteMutation.mutateAsync({
                        apiClientProps: { serverId },
                        query: {
                            id,
                            type: itemType,
                        },
                    });
                } else {
                    await createFavoriteMutation.mutateAsync({
                        apiClientProps: { serverId },
                        query: {
                            id,
                            type: itemType,
                        },
                    });
                }

                const idSet = new Set(id);
                gridRef.current?.updateItemData((data) =>
                    idSet.has(data.id)
                        ? {
                              ...data,
                              userFavorite: !isFavorite,
                          }
                        : data,
                );
            } catch (error) {
                console.error(error);
            }
        },
        [createFavoriteMutation, deleteFavoriteMutation, gridRef, serverId],
    );

    return handleFavorite;
};
