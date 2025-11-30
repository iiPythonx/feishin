import type { ICellRendererParams } from '@ag-grid-community/core';

import { CellContainer } from '/@/renderer/components/virtual-table/cells/generic-cell';
import { useCreateFavorite } from '/@/renderer/features/shared/mutations/create-favorite-mutation';
import { useDeleteFavorite } from '/@/renderer/features/shared/mutations/delete-favorite-mutation';
import { ActionIcon } from '/@/shared/components/action-icon/action-icon';

export const FavoriteCell = ({ data, node, value }: ICellRendererParams) => {
    const createMutation = useCreateFavorite({});
    const deleteMutation = useDeleteFavorite({});

    const handleToggleFavorite = () => {
        const newFavoriteValue = !value;

        if (newFavoriteValue) {
            createMutation.mutate(
                {
                    apiClientProps: { serverId: data.serverId },
                    query: {
                        id: [data.id],
                        type: data.itemType,
                    },
                },
                {
                    onSuccess: () => {
                        node.setData({ ...data, userFavorite: newFavoriteValue });
                    },
                },
            );
        } else {
            deleteMutation.mutate(
                {
                    apiClientProps: { serverId: data.serverId },
                    query: {
                        id: [data.id],
                        type: data.itemType,
                    },
                },
                {
                    onSuccess: () => {
                        node.setData({ ...data, userFavorite: newFavoriteValue });
                    },
                },
            );
        }
    };

    return (
        <CellContainer position="center">
            <ActionIcon
                icon="favorite"
                iconProps={{
                    fill: !value ? undefined : 'primary',
                }}
                onClick={handleToggleFavorite}
                size="sm"
                variant="subtle"
            />
        </CellContainer>
    );
};
