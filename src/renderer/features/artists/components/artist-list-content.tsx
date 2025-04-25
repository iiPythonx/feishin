import type { AgGridReact as AgGridReactType } from '@ag-grid-community/react/lib/agGridReact';
import { lazy, MutableRefObject, Suspense } from 'react';
import { Spinner } from '/@/renderer/components';
import { VirtualInfiniteGridRef } from '/@/renderer/components/virtual-grid';
import { ListDisplayType } from '/@/renderer/types';
import { useListStoreByKey } from '../../../store/list.store';
import { useListContext } from '/@/renderer/context/list-context';

const ArtistListGridView = lazy(() =>
    import('/@/renderer/features/artists/components/artist-list-grid-view').then((module) => ({
        default: module.ArtistListGridView,
    })),
);

const ArtistListTableView = lazy(() =>
    import('/@/renderer/features/artists/components/artist-list-table-view').then((module) => ({
        default: module.ArtistListTableView,
    })),
);

interface ArtistListContentProps {
    gridRef: MutableRefObject<VirtualInfiniteGridRef | null>;
    itemCount?: number;
    tableRef: MutableRefObject<AgGridReactType | null>;
}

export const ArtistListContent = ({ itemCount, gridRef, tableRef }: ArtistListContentProps) => {
    const { pageKey } = useListContext();
    const { display } = useListStoreByKey({ key: pageKey });
    const isGrid = display === ListDisplayType.CARD || display === ListDisplayType.POSTER;

    return (
        <Suspense fallback={<Spinner container />}>
            {isGrid ? (
                <ArtistListGridView
                    gridRef={gridRef}
                    itemCount={itemCount}
                />
            ) : (
                <ArtistListTableView
                    itemCount={itemCount}
                    tableRef={tableRef}
                />
            )}
        </Suspense>
    );
};
