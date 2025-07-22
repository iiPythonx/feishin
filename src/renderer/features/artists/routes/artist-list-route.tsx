import type { AgGridReact as AgGridReactType } from '@ag-grid-community/react/lib/agGridReact';

import { useMemo, useRef } from 'react';

import { VirtualInfiniteGridRef } from '/@/renderer/components/virtual-grid';
import { ListContext } from '/@/renderer/context/list-context';
import { ArtistListContent } from '/@/renderer/features/artists/components/artist-list-content';
import { ArtistListHeader } from '/@/renderer/features/artists/components/artist-list-header';
import { useArtistListCount } from '/@/renderer/features/artists/queries/artist-list-count-query';
import { AnimatedPage } from '/@/renderer/features/shared';
import { useCurrentServer } from '/@/renderer/store/auth.store';
import { useListFilterByKey } from '/@/renderer/store/list.store';
import { ArtistListQuery, LibraryItem } from '/@/shared/types/domain-types';

const ArtistListRoute = () => {
    const gridRef = useRef<null | VirtualInfiniteGridRef>(null);
    const tableRef = useRef<AgGridReactType | null>(null);
    const pageKey = LibraryItem.ARTIST;
    const server = useCurrentServer();

    const artistListFilter = useListFilterByKey<ArtistListQuery>({ key: pageKey });

    const itemCountCheck = useArtistListCount({
        options: {
            cacheTime: 1000 * 60,
            staleTime: 1000 * 60,
        },
        query: artistListFilter,
        serverId: server?.id,
    });

    const itemCount = itemCountCheck.data === null ? undefined : itemCountCheck.data;

    const providerValue = useMemo(() => {
        return {
            id: undefined,
            pageKey,
        };
    }, [pageKey]);

    return (
        <AnimatedPage>
            <ListContext.Provider value={providerValue}>
                <ArtistListHeader gridRef={gridRef} itemCount={itemCount} tableRef={tableRef} />
                <ArtistListContent gridRef={gridRef} itemCount={itemCount} tableRef={tableRef} />
            </ListContext.Provider>
        </AnimatedPage>
    );
};

export default ArtistListRoute;
