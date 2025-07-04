import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import isElectron from 'is-electron';

import { api } from '/@/renderer/api';
import { queryKeys } from '/@/renderer/api/query-keys';
import { QueryHookArgs } from '/@/renderer/lib/react-query';
import { getServerById, useLyricsSettings } from '/@/renderer/store';
import { hasFeature } from '/@/shared/api/utils';
import {
    FullLyricsMetadata,
    InternetProviderLyricResponse,
    LyricGetQuery,
    LyricsQuery,
    QueueSong,
    ServerType,
    StructuredLyric,
    SynchronizedLyricsArray,
} from '/@/shared/types/domain-types';
import { ServerFeature } from '/@/shared/types/features-types';

const lyricsIpc = isElectron() ? window.api.lyrics : null;

// Match LRC lyrics format by https://github.com/ustbhuangyi/lyric-parser
// [mm:ss.SSS] text
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]([^\n]+)(\n|$)/g;

// Match karaoke lyrics format returned by NetEase
// [SSS,???] text
const alternateTimeExp = /\[(\d*),(\d*)]([^\n]+)(\n|$)/g;

const formatLyrics = (lyrics: string) => {
    const synchronizedLines = lyrics.matchAll(timeExp);
    const formattedLyrics: SynchronizedLyricsArray = [];

    for (const line of synchronizedLines) {
        const [, minute, sec, ms, text] = line;
        const minutes = parseInt(minute, 10);
        const seconds = parseInt(sec, 10);
        const milis = ms?.length === 3 ? parseInt(ms, 10) : parseInt(ms, 10) * 10;

        const timeInMilis = (minutes * 60 + seconds) * 1000 + milis;

        formattedLyrics.push([timeInMilis, text]);
    }

    if (formattedLyrics.length > 0) return formattedLyrics;

    const alternateSynchronizedLines = lyrics.matchAll(alternateTimeExp);
    for (const line of alternateSynchronizedLines) {
        const [, timeInMilis, , text] = line;
        const cleanText = text
            .replaceAll(/\(\d+,\d+\)/g, '')
            .replaceAll(/\s,/g, ',')
            .replaceAll(/\s\./g, '.');
        formattedLyrics.push([Number(timeInMilis), cleanText]);
    }

    if (formattedLyrics.length > 0) return formattedLyrics;

    // If no synchronized lyrics were found, return the original lyrics
    return lyrics;
};

export const useServerLyrics = (
    args: QueryHookArgs<LyricsQuery>,
): UseQueryResult<null | string> => {
    const { query, serverId } = args;
    const server = getServerById(serverId);

    return useQuery({
        // Note: This currently fetches for every song, even if it shouldn't have
        // lyrics, because for some reason HasLyrics is not exposed. Thus, ignore the error
        onError: () => {},
        queryFn: ({ signal }) => {
            if (!server) throw new Error('Server not found');
            // This should only be called for Jellyfin. Return null to ignore errors
            if (server.type !== ServerType.JELLYFIN) return null;
            return api.controller.getLyrics({ apiClientProps: { server, signal }, query });
        },
        queryKey: queryKeys.songs.lyrics(server?.id || '', query),
    });
};

export const useSongLyricsBySong = (
    args: QueryHookArgs<LyricsQuery>,
    song: QueueSong | undefined,
): UseQueryResult<FullLyricsMetadata | StructuredLyric[]> => {
    const { query } = args;
    const { fetch, preferLocalLyrics } = useLyricsSettings();
    const server = getServerById(song?.serverId);

    return useQuery({
        cacheTime: Infinity,
        enabled: !!song && !!server,
        onError: () => {},
        queryFn: async ({ signal }): Promise<FullLyricsMetadata | null | StructuredLyric[]> => {
            if (!server) throw new Error('Server not found');
            if (!song) return null;

            let localLyrics: FullLyricsMetadata | null | StructuredLyric[] = null;
            let remoteLyrics: FullLyricsMetadata | null | StructuredLyric[] = null;

            if (hasFeature(server, ServerFeature.LYRICS_MULTIPLE_STRUCTURED)) {
                const subsonicLyrics = await api.controller
                    .getStructuredLyrics({
                        apiClientProps: { server, signal },
                        query: { songId: song.id },
                    })
                    .catch(console.error);

                if (subsonicLyrics?.length) {
                    localLyrics = subsonicLyrics;
                }
            } else if (hasFeature(server, ServerFeature.LYRICS_SINGLE_STRUCTURED)) {
                const jfLyrics = await api.controller
                    .getLyrics({
                        apiClientProps: { server, signal },
                        query: { songId: song.id },
                    })
                    .catch((err) => console.error(err));

                if (jfLyrics) {
                    localLyrics = {
                        artist: song.artists?.[0]?.name,
                        lyrics: jfLyrics,
                        name: song.name,
                        remote: false,
                        source: server?.name ?? 'music server',
                    };
                }
            } else if (song.lyrics) {
                localLyrics = {
                    artist: song.artists?.[0]?.name,
                    lyrics: formatLyrics(song.lyrics),
                    name: song.name,
                    remote: false,
                    source: server?.name ?? 'music server',
                };
            }

            if (preferLocalLyrics && localLyrics) {
                return localLyrics;
            }

            if (fetch) {
                const remoteLyricsResult: InternetProviderLyricResponse | null =
                    await lyricsIpc?.getRemoteLyricsBySong(song);

                if (remoteLyricsResult) {
                    remoteLyrics = {
                        ...remoteLyricsResult,
                        lyrics: formatLyrics(remoteLyricsResult.lyrics),
                        remote: true,
                    };
                }
            }

            if (remoteLyrics) {
                return remoteLyrics;
            }

            if (localLyrics) {
                return localLyrics;
            }

            return null;
        },
        queryKey: queryKeys.songs.lyrics(server?.id || '', query),
        staleTime: Infinity,
    });
};

export const useSongLyricsByRemoteId = (
    args: QueryHookArgs<Partial<LyricGetQuery>>,
): UseQueryResult<null | string> => {
    const queryClient = useQueryClient();
    const { query, serverId } = args;

    return useQuery({
        enabled: !!query.remoteSongId && !!query.remoteSource,
        onError: () => {},
        onSuccess: (data) => {
            if (!data || !query.song) {
                return;
            }

            const lyricsResult = {
                artist: query.song.artists?.[0]?.name,
                lyrics: data,
                name: query.song.name,
                remote: false,
                source: query.remoteSource,
            };

            queryClient.setQueryData(
                queryKeys.songs.lyrics(serverId, { songId: query.song.id }),
                lyricsResult,
            );
        },
        queryFn: async () => {
            const remoteLyricsResult = await lyricsIpc?.getRemoteLyricsByRemoteId(query as any);

            if (remoteLyricsResult) {
                return formatLyrics(remoteLyricsResult);
            }

            return null;
        },
        queryKey: queryKeys.songs.lyricsByRemoteId(query),
    });
};
