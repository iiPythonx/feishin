import { forwardRef, Fragment } from 'react';
import { usePlaylistDetail } from '/@/renderer/features/playlists/queries/playlist-detail-query';
import { AppRoute } from '/@/renderer/router/routes';
import { useCurrentServer, useTweaksSettings } from '/@/renderer/store';
import { Group } from '/@/shared/components/group/group';
import { Stack } from '/@/shared/components/stack/stack';
import { Text } from '/@/shared/components/text/text';
import { LibraryItem } from '/@/shared/types/domain-types';
import { useContainerQuery, useFastAverageColor } from '/@/renderer/hooks';
import { LibraryHeader } from '/@/renderer/features/shared';
import { formatDurationString } from '/@/renderer/utils';
import { useParams } from 'react-router';

export const PlaylistLibraryHeader = forwardRef((ref: any) => {
    const { playlistId } = useParams() as { playlistId: string };
    const server = useCurrentServer();

    const cq = useContainerQuery();

    const detailQuery = usePlaylistDetail({ query: { id: playlistId }, serverId: server?.id });
    const isSmartPlaylist = detailQuery.data?.rules;

    const { albumBackground, headerBackgroundBlur } = useTweaksSettings();
    const { background: backgroundColor } = useFastAverageColor({
        src: detailQuery.data?.imageUrl,
        srcLoaded: !detailQuery.isLoading,
    });

    const metadata = [
        {
            id: 'songCount',
            value: `${detailQuery?.data?.songCount} songs`,
        },
        {
            id: 'publicity',
            value: (detailQuery?.data?.public && 'Public') || 'Private',
        },
        {
            id: 'duration',
            value: detailQuery?.data?.duration && formatDurationString(detailQuery.data.duration),
        },
        {
            id: 'isSmart',
            value: (isSmartPlaylist && 'Dynamic') || 'Static',
        },
    ];

    return (
        <Stack ref={cq.ref}>
            <LibraryHeader
                imageUrl={detailQuery?.data?.imageUrl}
                item={{ route: AppRoute.PLAYLISTS, type: LibraryItem.PLAYLIST }}
                title={detailQuery?.data?.name || ''}
                subtitle={detailQuery?.data?.description || ''}
                ref={ref}
                {...{
                    background:
                        (albumBackground && `url(${detailQuery?.data?.imageUrl})`) ||
                        backgroundColor ||
                        '',
                    blur: headerBackgroundBlur,
                    loading: detailQuery.isLoading,
                }}
            >
                <Stack gap="sm">
                    <Group gap="sm">
                        {metadata.map((item, index) => (
                            <Fragment key={`item-${item.id}-${index}`}>
                                {index > 0 && <Text isNoSelect>•</Text>}
                                <Text>{item.value}</Text>
                            </Fragment>
                        ))}
                    </Group>
                    <Group
                        gap="md"
                        mah="4rem"
                        style={{
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                        }}
                    ></Group>
                </Stack>
            </LibraryHeader>
        </Stack>
    );
});
