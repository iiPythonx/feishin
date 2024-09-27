/* eslint-disable consistent-return */
import { useCallback, useEffect, useState } from 'react';
import { useDiscordSetttings, usePlayerStore } from '/@/renderer/store';
import { SetActivity } from '@xhayper/discord-rpc';
import { PlayerStatus } from '/@/renderer/types';
import { QueueSong } from '/@/renderer/api/types';
import axios from 'axios';
import isElectron from 'is-electron';

const discordRpc = isElectron() ? window.electron.discordRpc : null;

export const useDiscordRpc = () => {
    const discordSettings = useDiscordSetttings();
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
            current: (QueueSong | PlayerStatus | number | undefined)[],
            previous: (QueueSong | PlayerStatus | number | undefined)[],
        ) => {
            if (!current[0] || (current[0] && current[2] === 'paused' && current[1] === 0))
                return discordRpc?.clearActivity();

            // Handle change detection
            const song = current[0] as QueueSong;
            const trackChanged = lastUniqueId !== song.uniqueId;
            if (
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

                if ((current[2] as PlayerStatus) === PlayerStatus.PLAYING) {
                    activity.endTimestamp = end;
                    activity.startTimestamp = start;
                    activity.smallImageKey = 'playing';
                } else {
                    activity.smallImageKey = 'paused';
                }

                // @ts-ignore
                if (discordSettings.enableCustomName) activity.name = song.artistName;

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
                        const response = await axios({
                            data: form,
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            method: 'POST',
                            url: 'https://covers.iipython.dev/api/image',
                        });
                        imageUrl = response.data.url;
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
            discordSettings.enableCustomName,
            lastImageUrl,
            setLastImageUrl,
            lastUniqueId,
            setlastUniqueId,
            firstChangeHandled,
            setFirstChangeHandled,
        ],
    );
    useEffect(() => {
        if (!discordSettings.enabled) return;
        const unsubSongChange = usePlayerStore.subscribe(
            (state) => [state.current.song, state.current.time, state.current.status],
            updateActivity,
        );
        return () => {
            unsubSongChange();
        };
    }, [updateActivity, discordSettings.enabled]);
};
