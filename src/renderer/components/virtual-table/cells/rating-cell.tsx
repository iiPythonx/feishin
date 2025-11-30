import type { ICellRendererParams } from '@ag-grid-community/core';

import { CellContainer } from '/@/renderer/components/virtual-table/cells/generic-cell';
import { useSetRating } from '/@/renderer/features/shared/mutations/set-rating-mutation';
import { Rating } from '/@/shared/components/rating/rating';

export const RatingCell = ({ node, value }: ICellRendererParams) => {
    const updateRatingMutation = useSetRating({});

    const handleUpdateRating = (rating: number) => {
        updateRatingMutation.mutate(
            {
                apiClientProps: { serverId: value?.serverId || '' },
                query: {
                    item: [value],
                    rating,
                },
            },
            {
                onSuccess: () => {
                    node.setData({ ...node.data, userRating: rating });
                },
            },
        );
    };

    return (
        <CellContainer position="center">
            <Rating onChange={handleUpdateRating} size="xs" value={value?.userRating} />
        </CellContainer>
    );
};
