import { useRef } from 'react';
import { useParams } from 'react-router';
import { LibraryItem } from '/@/renderer/api/types';
import { NativeScrollArea, Spinner } from '/@/renderer/components';
import { AlbumArtistDetailContent } from '/@/renderer/features/artists/components/album-artist-detail-content';
import { AlbumArtistDetailHeader } from '/@/renderer/features/artists/components/album-artist-detail-header';
import { useAlbumArtistDetail } from '/@/renderer/features/artists/queries/album-artist-detail-query';
import { usePlayQueueAdd } from '/@/renderer/features/player';
import { AnimatedPage, LibraryHeaderBar } from '/@/renderer/features/shared';
import { useFastAverageColor } from '/@/renderer/hooks';
import { useBackgroundSettings, useCurrentServer } from '/@/renderer/store';
import { usePlayButtonBehavior } from '/@/renderer/store/settings.store';

const AlbumArtistDetailRoute = () => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const server = useCurrentServer();
    const { enableBackgroundArtist, backgroundBlurSize } = useBackgroundSettings();

    const { albumArtistId, artistId } = useParams() as {
        albumArtistId?: string;
        artistId?: string;
    };

    const routeId = (artistId || albumArtistId) as string;

    const handlePlayQueueAdd = usePlayQueueAdd();
    const playButtonBehavior = usePlayButtonBehavior();
    const detailQuery = useAlbumArtistDetail({
        query: { id: routeId },
        serverId: server?.id,
    });
    const { color: background, colorId } = useFastAverageColor({
        id: routeId,
        src: detailQuery.data?.imageUrl,
        srcLoaded: !detailQuery.isLoading,
    });

    const backgroundUrl = detailQuery.data?.imageUrl || '';

    const handlePlay = () => {
        handlePlayQueueAdd?.({
            byItemType: {
                id: [routeId],
                type: LibraryItem.ALBUM_ARTIST,
            },
            playType: playButtonBehavior,
        });
    };

    if (!background || colorId !== routeId) {
        return <Spinner container />;
    }

    return (
        <AnimatedPage key={`album-artist-detail-${routeId}`}>
            <NativeScrollArea
                ref={scrollAreaRef}
                pageHeaderProps={{
                    backgroundColor: background,
                    children: (
                        <LibraryHeaderBar>
                            <LibraryHeaderBar.PlayButton onClick={handlePlay} />
                            <LibraryHeaderBar.Title>
                                {detailQuery?.data?.name}
                            </LibraryHeaderBar.Title>
                        </LibraryHeaderBar>
                    ),
                    offset: 200,
                    target: headerRef,
                }}
            >
                <AlbumArtistDetailHeader
                    ref={headerRef}
                    background={{
                        background:
                            (enableBackgroundArtist && `url(${backgroundUrl})`) || background,
                        blur: (enableBackgroundArtist && backgroundBlurSize) || 0,
                    }}
                />
                <AlbumArtistDetailContent
                    background={(enableBackgroundArtist && `url(${backgroundUrl})`) || background}
                />
            </NativeScrollArea>
        </AnimatedPage>
    );
};

export default AlbumArtistDetailRoute;
