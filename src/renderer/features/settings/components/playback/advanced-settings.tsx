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
            note: 'Restart required',
            title: t('setting.sampleRate'),
        },
    ];

    return <SettingsSection options={generalOptions} title={t('page.setting.advanced')} />;
});
