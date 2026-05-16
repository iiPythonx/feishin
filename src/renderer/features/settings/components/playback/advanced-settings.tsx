import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import {
    SettingOption,
    SettingsSection,
} from '/@/renderer/features/settings/components/settings-section';
import {
    SettingsState,
    usePlaybackSettings,
    useSettingsStoreActions,
} from '/@/renderer/store/settings.store';
import { NumberInput } from '/@/shared/components/number-input/number-input';
import { Select } from '/@/shared/components/select/select';
import { Switch } from '/@/shared/components/switch/switch';
import { Text } from '/@/shared/components/text/text';

export const AdvancedSettings = memo(() => {
    const { t } = useTranslation();
    const settings = usePlaybackSettings();
    const { setSettings } = useSettingsStoreActions();

    const handleSetAdvancedProperty = (
        setting: keyof SettingsState['playback']['advancedProperties'],
        value: any,
    ) => {
        setSettings({
            playback: {
                advancedProperties: {
                    [setting]: value,
                },
            },
        });
    };

    const generalOptions: SettingOption[] = [
        {
            control: (
                <NumberInput
                    defaultValue={settings.advancedProperties.audioSampleRateHz || undefined}
                    max={192000}
                    min={0}
                    onBlur={(e) => {
                        const value = Number(e.currentTarget.value);
                        handleSetAdvancedProperty(
                            'audioSampleRateHz',
                            value >= 8000 ? value : value,
                        );
                    }}
                    placeholder="48000"
                    rightSection={<Text size="xs">Hz</Text>}
                    width={100}
                />
            ),
            description: t('setting.sampleRate', {
                context: 'description',
            }),
            note: 'Page refresh required for web player',
            title: t('setting.sampleRate'),
        },
    ];

    const replayGainOptions: SettingOption[] = [
        {
            control: (
                <Select
                    data={[
                        {
                            label: t('setting.replayGainMode', {
                                context: 'optionNone',
                            }),
                            value: 'no',
                        },
                        {
                            label: t('setting.replayGainMode', {
                                context: 'optionTrack',
                            }),
                            value: 'track',
                        },
                        {
                            label: t('setting.replayGainMode', {
                                context: 'optionAlbum',
                            }),
                            value: 'album',
                        },
                    ]}
                    defaultValue={settings.advancedProperties.replayGainMode}
                    onChange={(e) => handleSetAdvancedProperty('replayGainMode', e)}
                />
            ),
            description: t('setting.replayGainMode', {
                context: 'description',

                ReplayGain: 'ReplayGain',
            }),
            note: t('common.restartRequired'),
            title: t('setting.replayGainMode', { ReplayGain: 'ReplayGain' }),
        },
        {
            control: (
                <NumberInput
                    defaultValue={settings.advancedProperties.replayGainPreampDB}
                    onChange={(e) =>
                        handleSetAdvancedProperty('replayGainPreampDB', Number(e) || 0)
                    }
                    width={75}
                />
            ),
            description: t('setting.replayGainMode', {
                context: 'description',

                ReplayGain: 'ReplayGain',
            }),
            title: t('setting.replayGainPreamp', { ReplayGain: 'ReplayGain' }),
        },
        {
            control: (
                <Switch
                    defaultChecked={settings.advancedProperties.replayGainClip}
                    onChange={(e) =>
                        handleSetAdvancedProperty('replayGainClip', e.currentTarget.checked)
                    }
                />
            ),
            description: t('setting.replayGainClipping', {
                context: 'description',

                ReplayGain: 'ReplayGain',
            }),
            title: t('setting.replayGainClipping', { ReplayGain: 'ReplayGain' }),
        },
        {
            control: (
                <NumberInput
                    defaultValue={settings.advancedProperties.replayGainFallbackDB}
                    onBlur={(e) =>
                        handleSetAdvancedProperty(
                            'replayGainFallbackDB',
                            Number(e.currentTarget.value),
                        )
                    }
                    width={75}
                />
            ),
            description: t('setting.replayGainFallback', { ReplayGain: 'ReplayGain' }),
            title: t('setting.replayGainFallback', { ReplayGain: 'ReplayGain' }),
        },
    ];

    return (
        <>
            <SettingsSection options={generalOptions} />
            <SettingsSection options={replayGainOptions} />
        </>
    );
});
