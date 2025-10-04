import { SetActivity } from '@xhayper/discord-rpc';
import axios from 'axios';
import isElectron from 'is-electron';
import { useCallback, useEffect, useState } from 'react';

import { DiscordLinkType, useAppStore, useDiscordSettings, usePlayerStore } from '/@/renderer/store';
import { QueueSong } from '/@/shared/types/domain-types';
import { PlayerStatus } from '/@/shared/types/types';
import { toast } from '/@/shared/components/toast/toast';

const discordRpc = isElectron() ? window.api.discordRpc : null;

export const useDiscordRpc = () => {
    const discordSettings = useDiscordSettings();
    const { privateMode } = useAppStore();
    const [lastImageUrl, setLastImageUrl] = useState('icon');
    const [lastUniqueId, setlastUniqueId] = useState('');
    const [firstChangeHandled, setFirstChangeHandled] = useState(false);

    useEffect(() => {
        if (!discordSettings.enabled) return discordRpc?.quit();
        discordRpc?.initialize(discordSettings.clientId);
        return () => discordRpc?.quit();
    }, [discordSettings.clientId, discordSettings.enabled]);

    const updateActivity = useCallback(
        async (
            current: (number | PlayerStatus | QueueSong | undefined)[],
            previous: (number | PlayerStatus | QueueSong | undefined)[],
        ) => {
            if (!current[0] || (current[0] && current[2] === 'paused' && current[1] === 0))
                return discordRpc?.clearActivity();

            // Handle change detection
            const song = current[0] as QueueSong;
            const trackChanged = lastUniqueId !== song.uniqueId;
            if (
                previous[1] === 0 ||
                Math.abs((current[1] as number) - (previous[1] as number)) > 1.2 ||
                trackChanged ||
                current[2] !== previous[2]
            ) {
                setFirstChangeHandled(true);
                if (trackChanged) setlastUniqueId(song.uniqueId);

                const start = Math.round(Date.now() - (current[1] as number) * 1000);
                const end = Math.round(start + song.duration);

                const status = current[2] as string;
                const activity: SetActivity = {
                    details: song.name.padEnd(2, ' '),
                    instance: false,
                    largeImageKey: undefined,
                    largeImageText: song.album ? song.album : undefined,
                    smallImageKey: status,
                    smallImageText: status.charAt(0).toUpperCase() + status.slice(1),
                    state: `by ${song.artistName}`,
                    type: discordSettings.showAsListening ? 2 : 0,
                };

                if (
                    (discordSettings.linkType == DiscordLinkType.LAST_FM ||
                        discordSettings.linkType == DiscordLinkType.MBZ_LAST_FM) &&
                    song?.artistName
                ) {
                    activity.stateUrl =
                        'https://www.last.fm/music/' + encodeURIComponent(song.artists[0].name);
                    activity.detailsUrl =
                        'https://www.last.fm/music/' +
                        encodeURIComponent(song.albumArtists[0].name) +
                        '/' +
                        encodeURIComponent(song.album || '_') +
                        '/' +
                        encodeURIComponent(song.name);
                }

                if (
                    discordSettings.linkType == DiscordLinkType.MBZ ||
                    discordSettings.linkType == DiscordLinkType.MBZ_LAST_FM
                ) {
                    if (song?.mbzTrackId) {
                        activity.detailsUrl = 'https://musicbrainz.org/track/' + song.mbzTrackId;
                    } else if (song?.mbzRecordingId) {
                        activity.detailsUrl =
                            'https://musicbrainz.org/recording/' + song.mbzRecordingId;
                    }
                }

                if ((current[2] as PlayerStatus) === PlayerStatus.PLAYING) {
                    activity.endTimestamp = end;
                    activity.startTimestamp = start;
                    activity.smallImageKey = 'playing';
                } else {
                    activity.smallImageKey = 'paused';
                }

                // @ts-ignore: Name is a totally valid field, but it's not typed, so ymmv
                if (discordSettings.showArtistName) activity.name = song.artistName;

                // Handle forwarding album art
                let imageUrl = lastImageUrl;
                if (trackChanged || !firstChangeHandled) {
                    if (discordSettings.proxyType === 'ndip' && discordSettings.proxyUrl) {
                        imageUrl = `${discordSettings.proxyUrl}/image/${song.id}`;
                    } else if (discordSettings.proxyType === 'pizza' && song.imageUrl) {
                        const image = await axios({
                            method: 'GET',
                            responseType: 'blob',
                            url: song.imageUrl.replace(/&size=\d+/, '&size=100'),
                        });

                        // Upload file to Pizza
                        const form = new FormData();
                        form.append('file', new File([image.data], 'file.jpg')); // Yes, uploading a PNG as a JPG is ok
                        try {
                            const response = await axios({
                                data: form,
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                                method: 'POST',
                                url: 'https://covers.iipython.dev/api/image',
                            });
                            imageUrl = response.data.url;
                        } catch (e) {
                            toast.error({
                                title: 'Pizza error',
                                message:
                                    `Could not reach the pizza proxy. Discord RPC falling back to the default icon. ${e}`,
                            });
                        }
                    } else {
                        imageUrl = 'icon';
                    }
                }
                setLastImageUrl(imageUrl);
                activity.largeImageKey = imageUrl;
                discordRpc?.setActivity(activity);
            }
        },
        [
            discordSettings.proxyType,
            discordSettings.proxyUrl,
            discordSettings.showAsListening,
            discordSettings.showArtistName,
            lastImageUrl,
            setLastImageUrl,
            lastUniqueId,
            setlastUniqueId,
            firstChangeHandled,
            setFirstChangeHandled,
        ],
    );
    useEffect(() => {
        if (!discordSettings.enabled || privateMode) return;
        const unsubSongChange = usePlayerStore.subscribe(
            (state) => [state.current.song, state.current.time, state.current.status],
            updateActivity,
        );
        return () => {
            unsubSongChange();
        };
    }, [updateActivity, privateMode, discordSettings.enabled]);
};
