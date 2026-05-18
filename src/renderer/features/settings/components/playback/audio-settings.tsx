import { t } from 'i18next';
import isElectron from 'is-electron';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    SettingOption,
    SettingsSection,
} from '/@/renderer/features/settings/components/settings-section';
import { usePlayerActions, usePlayerProperties, usePlayerStatus } from '/@/renderer/store';
import { usePlaybackSettings, useSettingsStoreActions } from '/@/renderer/store/settings.store';
import { SegmentedControl } from '/@/shared/components/segmented-control/segmented-control';
import { Select } from '/@/shared/components/select/select';
import { Slider } from '/@/shared/components/slider/slider';
import { Switch } from '/@/shared/components/switch/switch';
import { toast } from '/@/shared/components/toast/toast';
import { CrossfadeStyle, PlayerStatus, PlayerStyle } from '/@/shared/types/types';

const getAudioDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return (devices || []).filter((dev: MediaDeviceInfo) => dev.kind === 'audiooutput');
};

export type AudioDeviceOption = { label: string; value: string };

export const useAudioDevices = () => {
    const [audioDevices, setAudioDevices] = useState<AudioDeviceOption[]>([]);

    useEffect(() => {
        const fetchAudioDevices = async () => {
            if (!isElectron()) {
                return;
            }

            getAudioDevices()
                .then((dev) => {
                    const uniqueDevices = dev.filter(
                        (d, index, self) =>
                            index === self.findIndex((t) => t.deviceId === d.deviceId),
                    );
                    setAudioDevices(
                        uniqueDevices.map((d) => ({ label: d.label, value: d.deviceId })),
                    );
                })
                .catch(() =>
                    toast.error({
                        message: t('error.audioDeviceFetchError'),
                    }),
                );
        };

        fetchAudioDevices();
    }, []);

    return audioDevices;
};

export const AudioSettings = memo(() => {
    const { t } = useTranslation();
    const settings = usePlaybackSettings();
    const { setSettings } = useSettingsStoreActions();
    const { transitionType } = usePlayerProperties();

    const audioDevices = useAudioDevices();
    const audioDeviceId = settings.audioDeviceId;

    const audioOptions: SettingOption[] = [
        {
            control: (
                <Select
                    clearable
                    data={audioDevices}
                    defaultValue={audioDeviceId}
                    disabled={!isElectron()}
                    onChange={(e) =>
                        setSettings({
                            playback: { audioDeviceId: e },
                        })
                    }
                />
            ),
            description: t('setting.audioDevice', {
                context: 'description',
            }),
            isHidden: !isElectron(),
            title: t('setting.audioDevice'),
        },
        {
            control: (
                <Switch
                    defaultChecked={settings.webAudio}
                    onChange={(e) => {
                        setSettings({
                            playback: { webAudio: e.currentTarget.checked },
                        });
                    }}
                />
            ),
            description: t('setting.webAudio', {
                context: 'description',
            }),
            note: t('common.restartRequired'),
            title: t('setting.webAudio'),
        },
        {
            control: (
                <Switch
                    defaultChecked={settings.preservePitch}
                    onChange={(e) => {
                        setSettings({
                            playback: { preservePitch: e.currentTarget.checked },
                        });
                    }}
                />
            ),
            description: t('setting.preservePitch', {
                context: 'description',
            }),
            title: t('setting.preservePitch'),
        },
        {
            control: (
                <Switch
                    defaultChecked={settings.audioFadeOnStatusChange}
                    onChange={(e) => {
                        setSettings({
                            playback: {
                                audioFadeOnStatusChange: e.currentTarget.checked,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.audioFadeOnStatusChange', {
                context: 'description',
            }),
            title: t('setting.audioFadeOnStatusChange'),
        },
        {
            control: <TransitionTypeConfig />,
            description: t('setting.playbackStyle', {
                context: 'description',
            }),
            title: t('setting.playbackStyle'),
        },
        ...(transitionType === PlayerStyle.CROSSFADE
            ? [
                  {
                      control: <CrossfadeStyleConfig />,
                      description: t('setting.crossfadeStyle', {
                          context: 'description',
                      }),
                      indent: true,
                      title: t('setting.crossfadeStyle'),
                  },
                  {
                      control: <CrossfadeDurationConfig />,
                      description: t('setting.crossfadeDuration', {
                          context: 'description',
                      }),
                      indent: true,
                      title: t('setting.crossfadeDuration'),
                  },
              ]
            : []),
    ];

    return <SettingsSection options={audioOptions} title={t('page.setting.audio')} />;
});

const TransitionTypeConfig = () => {
    const { t } = useTranslation();
    const status = usePlayerStatus();
    const { transitionType } = usePlayerProperties();
    const { setTransitionType } = usePlayerActions();

    return (
        <SegmentedControl
            data={[
                {
                    label: t('setting.playbackStyle', {
                        context: 'optionNormal',
                    }),
                    value: PlayerStyle.GAPLESS,
                },
                {
                    label: t('setting.playbackStyle', {
                        context: 'optionCrossFade',
                    }),
                    value: PlayerStyle.CROSSFADE,
                },
            ]}
            disabled={status === PlayerStatus.PLAYING}
            onChange={(value) => setTransitionType(value as PlayerStyle)}
            size="sm"
            value={transitionType}
            w="100%"
        />
    );
};

const CrossfadeStyleConfig = () => {
    const status = usePlayerStatus();
    const { crossfadeStyle, transitionType } = usePlayerProperties();
    const { setCrossfadeStyle } = usePlayerActions();

    return (
        <Select
            comboboxProps={{ withinPortal: false }}
            data={[
                { label: 'Linear', value: CrossfadeStyle.LINEAR },
                { label: 'Equal Power', value: CrossfadeStyle.EQUAL_POWER },
                { label: 'S-Curve', value: CrossfadeStyle.S_CURVE },
                { label: 'Exponential', value: CrossfadeStyle.EXPONENTIAL },
            ]}
            defaultValue={crossfadeStyle}
            disabled={transitionType !== PlayerStyle.CROSSFADE || status === PlayerStatus.PLAYING}
            onChange={(e) => {
                if (e) {
                    setCrossfadeStyle(e as CrossfadeStyle);
                }
            }}
            width="100%"
        />
    );
};

const CrossfadeDurationConfig = () => {
    const status = usePlayerStatus();
    const { crossfadeDuration, transitionType } = usePlayerProperties();
    const { setCrossfadeDuration } = usePlayerActions();

    return (
        <Slider
            defaultValue={crossfadeDuration}
            disabled={transitionType !== PlayerStyle.CROSSFADE || status === PlayerStatus.PLAYING}
            marks={[
                { label: '3', value: 3 },
                { label: '6', value: 6 },
                { label: '9', value: 9 },
                { label: '12', value: 12 },
                { label: '15', value: 15 },
            ]}
            max={15}
            min={3}
            onChangeEnd={setCrossfadeDuration}
            styles={{
                root: {},
            }}
            w={200}
        />
    );
};
