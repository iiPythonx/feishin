import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { usePlayerActions, usePlayerSongProperties, usePlayerSpeed } from '/@/renderer/store';
import { ActionIcon } from '/@/shared/components/action-icon/action-icon';
import { Popover } from '/@/shared/components/popover/popover';
import { Slider } from '/@/shared/components/slider/slider';

export const PlaybackSpeedConfig = () => {
    const { t } = useTranslation();
    const speed = usePlayerSpeed();
    const { setSpeed } = usePlayerActions();
    const { bpm } = usePlayerSongProperties(['bpm']) ?? {};

    const formatPlaybackSpeedSliderLabel = useMemo(
        () => (value: number) => {
            const bpmValue = Number(bpm);
            if (bpmValue > 0) {
                return `${value} x / ${(bpmValue * value).toFixed(1)} BPM`;
            }
            return `${value} x`;
        },
        [bpm],
    );

    return (
        <Popover position="top" width={300}>
            <Popover.Target>
                <ActionIcon
                    icon="speed"
                    iconProps={{
                        fill: 'default',
                        size: 'lg',
                    }}
                    size="sm"
                    stopsPropagation
                    tooltip={{
                        label: t('player.playbackSpeed'),
                        openDelay: 0,
                    }}
                    variant="subtle"
                />
            </Popover.Target>
            <Popover.Dropdown pb={'20px'}>
                <Slider
                    defaultValue={speed}
                    label={formatPlaybackSpeedSliderLabel}
                    marks={[
                        { label: '0.5', value: 0.5 },
                        { label: '0.75', value: 0.75 },
                        { label: '1', value: 1 },
                        { label: '1.25', value: 1.25 },
                        { label: '1.5', value: 1.5 },
                        { label: '1.75', value: 1.75 },
                        { label: '2', value: 2 },
                    ]}
                    max={2}
                    min={0.5}
                    onChangeEnd={setSpeed}
                    onDoubleClick={() => setSpeed(1)}
                    step={0.01}
                    styles={{
                        markLabel: {},
                        root: {},
                    }}
                    w="100%"
                />
            </Popover.Dropdown>
        </Popover>
    );
};
