import { lazy, memo, Suspense } from 'react';
import { shallow } from 'zustand/shallow';

import { AudioSettings } from '/@/renderer/features/settings/components/playback/audio-settings';
import { AutoDJSettings } from '/@/renderer/features/settings/components/playback/auto-dj-settings';
import { PlayerFilterSettings } from '/@/renderer/features/settings/components/playback/player-filter-settings';
import { TranscodeSettings } from '/@/renderer/features/settings/components/playback/transcode-settings';
import { useSettingsStore } from '/@/renderer/store';
import { Divider } from '/@/shared/components/divider/divider';
import { Stack } from '/@/shared/components/stack/stack';

const MpvSettings = lazy(() =>
    import('/@/renderer/features/settings/components/playback/mpv-settings').then((module) => {
        return { default: module.MpvSettings };
    }),
);

export const PlaybackTab = memo(() => {
    const { useWebAudio } = useSettingsStore(
        (state) => ({
            audioType: state.playback.type,
            useWebAudio: state.playback.webAudio,
        }),
        shallow,
    );

    return (
        <Stack gap="md">
            <AudioSettings />
            <Suspense fallback={<></>}>
                {useWebAudio && 'AudioContext' in window && <MpvSettings />}
            </Suspense>
            <Divider />
            <TranscodeSettings />
            <Divider />
            <PlayerFilterSettings />
            <Divider />
            <AutoDJSettings />
        </Stack>
    );
});
