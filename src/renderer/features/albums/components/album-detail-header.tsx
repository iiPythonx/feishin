import { useQuery, useQueryClient } from '@tanstack/react-query';
import { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';

import { queryKeys } from '/@/renderer/api/query-keys';
import { albumQueries } from '/@/renderer/features/albums/api/album-api';
import { ContextMenuController } from '/@/renderer/features/context-menu/context-menu-controller';
import { usePlayer } from '/@/renderer/features/player/context/player-context';
import {
    LibraryHeader,
    LibraryHeaderMenu,
} from '/@/renderer/features/shared/components/library-header';
import { useSetFavorite } from '/@/renderer/features/shared/hooks/use-set-favorite';
import { useSetRating } from '/@/renderer/features/shared/hooks/use-set-rating';
import { songsQueries } from '/@/renderer/features/songs/api/songs-api';
import { AppRoute } from '/@/renderer/router/routes';
import { useCurrentServer, useShowRatings } from '/@/renderer/store';
import { useArtistRadioCount, usePlayButtonBehavior } from '/@/renderer/store/settings.store';
import { normalizeReleaseTypes } from '/@/renderer/utils/normalize-release-types';
import { ExplicitIndicator } from '/@/shared/components/explicit-indicator/explicit-indicator';
import { Group } from '/@/shared/components/group/group';
import { Separator } from '/@/shared/components/separator/separator';
import { Stack } from '/@/shared/components/stack/stack';
import { Text } from '/@/shared/components/text/text';
import { LibraryItem } from '/@/shared/types/domain-types';
import { Play } from '/@/shared/types/types';

export const AlbumDetailHeader = forwardRef<HTMLDivElement>((_props, ref) => {
    const { albumId } = useParams() as { albumId: string };
    const { t } = useTranslation();
    const server = useCurrentServer();
    const showRatings = useShowRatings();
    const queryClient = useQueryClient();
    const albumRadioCount = useArtistRadioCount();
    const detailQuery = useQuery(
        albumQueries.detail({ query: { id: albumId }, serverId: server?.id }),
    );

    const { addToQueueByData, addToQueueByFetch } = usePlayer();
    const playButtonBehavior = usePlayButtonBehavior();

    const setRating = useSetRating();
    const setFavorite = useSetFavorite();

    const handleFavorite = () => {
        if (!detailQuery?.data) return;
        setFavorite(
            detailQuery.data._serverId,
            [detailQuery.data.id],
            LibraryItem.ALBUM,
            !detailQuery.data.userFavorite,
        );
    };

    const handleUpdateRating = showRatings
        ? (rating: number) => {
              if (!detailQuery?.data) return;

              if (detailQuery.data.userRating === rating) {
                  return setRating(
                      detailQuery.data._serverId,
                      [detailQuery.data.id],
                      LibraryItem.ALBUM,
                      0,
                  );
              }

              return setRating(
                  detailQuery.data._serverId,
                  [detailQuery.data.id],
                  LibraryItem.ALBUM,
                  rating,
              );
          }
        : undefined;

    const handlePlay = (type?: Play) => {
        if (!server?.id || !albumId) return;
        addToQueueByFetch(server.id, [albumId], LibraryItem.ALBUM, type || playButtonBehavior);
    };

    const handleMoreOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!detailQuery?.data) return;
        ContextMenuController.call({
            cmd: { items: [detailQuery.data], type: LibraryItem.ALBUM },
            event: e,
        });
    };

    const handleAlbumRadio = async () => {
        if (!server?.id || !albumId) return;

        try {
            const albumRadioSongs = await queryClient.fetchQuery({
                ...songsQueries.albumRadio({
                    query: {
                        albumId: albumId,
                        count: albumRadioCount,
                    },
                    serverId: server.id,
                }),
                queryKey: queryKeys.player.fetch({ albumId: albumId }),
            });
            if (albumRadioSongs && albumRadioSongs.length > 0) {
                addToQueueByData(albumRadioSongs, Play.NOW);
            }
        } catch (error) {
            console.error('Failed to load album radio:', error);
        }
    };

    const headerItem = useMemo(() => {
        const album = detailQuery?.data;

        if (!album) return null;

        const releaseTypes = album.releaseType
            ? normalizeReleaseTypes([album.releaseType], t)
            : null;

        const releaseTypeText = releaseTypes?.length ? releaseTypes[0] : null;

        if (releaseTypeText) {
            return (
                <Group gap="sm">
                    <ExplicitIndicator
                        explicitStatus={album.explicitStatus}
                        style={{ position: 'relative', top: '-1px' }}
                        withSpace={false}
                    />
                    <Text
                        component={Link}
                        fw={600}
                        isLink
                        size="md"
                        to={AppRoute.LIBRARY_ALBUMS}
                        tt="uppercase"
                    >
                        {releaseTypeText}
                    </Text>
                    {album.version && (
                        <>
                            <Text fw={600} isMuted>
                                <Separator />
                            </Text>
                            <Text>{album.version}</Text>
                        </>
                    )}
                </Group>
            );
        }

        return null;
    }, [detailQuery?.data, t]);

    return (
        <Stack ref={ref}>
            <LibraryHeader
                item={{
                    children: headerItem,
                    explicitStatus: detailQuery?.data?.explicitStatus ?? null,
                    imageId: detailQuery?.data?.imageId,
                    imageUrl: detailQuery?.data?.imageUrl,
                    route: AppRoute.LIBRARY_ALBUMS,
                    type: LibraryItem.ALBUM,
                }}
                title={detailQuery?.data?.name || ''}
            >
                <LibraryHeaderMenu
                    favorite={detailQuery?.data?.userFavorite}
                    onAlbumRadio={handleAlbumRadio}
                    onFavorite={handleFavorite}
                    onMore={handleMoreOptions}
                    onPlay={(type) => handlePlay(type)}
                    onRating={handleUpdateRating}
                    onShuffle={() => handlePlay(Play.SHUFFLE)}
                    rating={detailQuery?.data?.userRating || 0}
                />
            </LibraryHeader>
        </Stack>
    );
});
