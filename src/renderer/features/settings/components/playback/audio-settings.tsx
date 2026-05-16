import { t } from 'i18next';
import isElectron from 'is-electron';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    SettingOption,
    SettingsSection,
} from '/@/renderer/features/settings/components/settings-section';
import { usePlaybackType } from '/@/renderer/store';
import { usePlaybackSettings, useSettingsStoreActions } from '/@/renderer/store/settings.store';
import { Select } from '/@/shared/components/select/select';
import { Switch } from '/@/shared/components/switch/switch';
import { toast } from '/@/shared/components/toast/toast';

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
    const playbackType = usePlaybackType();

    const audioDevices = useAudioDevices(playbackType);
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
    ];

    return <SettingsSection options={audioOptions} title={t('page.setting.audio')} />;
});
