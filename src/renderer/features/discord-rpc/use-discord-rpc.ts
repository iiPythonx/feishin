/* eslint-disable consistent-return */
import { useCallback, useEffect } from 'react';
import { useDiscordSetttings, usePlayerStore } from '/@/renderer/store';
import { SetActivity } from '@xhayper/discord-rpc';
import { PlayerStatus } from '/@/renderer/types';
import { QueueSong } from '/@/renderer/api/types';
import isElectron from 'is-electron';

const discordRpc = isElectron() ? window.electron.discordRpc : null;

export const useDiscordRpc = () => {
    const discordSettings = useDiscordSetttings();

    useEffect(() => {
        if (!discordSettings.enabled) return discordRpc?.quit();
        discordRpc?.initialize(discordSettings.clientId);
        return () => discordRpc?.quit();
    }, [discordSettings.clientId, discordSettings.enabled]);

    // Experimental shit
    const updateActivity = useCallback(
        (
            current: (QueueSong | PlayerStatus | number | undefined)[],
            previous: (QueueSong | PlayerStatus | number | undefined)[],
        ) => {
            if (!current[0] || (current[0] && current[2] === 'paused' && current[1] === 0))
                return discordRpc?.clearActivity();

            // Handle change detection
            const song = current[0] as QueueSong;
            if (
                Math.abs((current[1] as number) - (previous[1] as number)) > 1.2 ||
                (previous[0] && (previous[0] as QueueSong).uniqueId !== song.uniqueId) ||
                current[2] !== previous[2]
            ) {
                const start = Math.round(Date.now() - (current[1] as number) * 1000);
                const end = Math.round(start + song.duration);

                const status = current[2] as string;
                const activity: SetActivity = {
                    details: song.name.padEnd(2, ' '),
                    instance: false,
                    largeImageKey: undefined,
                    largeImageText: song.album ? song.album : undefined,
                    name: song.artistName, // shut up ts idgaf
                    smallImageKey: status,
                    smallImageText: status.charAt(0).toUpperCase() + status.slice(1),
                    state: `on ${song.album}`,
                };

                if ((current[2] as PlayerStatus) === PlayerStatus.PLAYING) {
                    activity.endTimestamp = end;
                    activity.smallImageKey = 'playing';
                } else {
                    activity.smallImageKey = 'paused';
                }

                // Handle forwarding album art
                let coverUrl = 'icon';
                if (discordSettings.proxyType === 'ndip' && discordSettings.proxyUrl) {
                    coverUrl = `${discordSettings.proxyUrl}/image/${song.id}`;
                }
                activity.largeImageKey = coverUrl;
                discordRpc?.setActivity(activity);
            }
        },
        [discordSettings.proxyType, discordSettings.proxyUrl],
    );
    useEffect(() => {
        const unsubSongChange = usePlayerStore.subscribe(
            (state) => [state.current.song, state.current.time, state.current.status],
            updateActivity,
        );
        return () => {
            unsubSongChange();
        };
    }, [updateActivity]);
};
