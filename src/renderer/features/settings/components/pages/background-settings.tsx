import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import {
    SettingOption,
    SettingsSection,
} from '/@/renderer/features/settings/components/settings-section';
import { useGeneralSettings, useSettingsStoreActions } from '/@/renderer/store';
import { Slider } from '/@/shared/components/slider/slider';
import { Switch } from '/@/shared/components/switch/switch';

export const BackgroundSettings = memo(() => {
    const { t } = useTranslation();
    const settings = useGeneralSettings();
    const { setSettings } = useSettingsStoreActions();

    const options: SettingOption[] = [
        {
            control: (
                <Switch
                    aria-label={t('setting.albumBackground')}
                    defaultChecked={settings.albumBackground}
                    onChange={(e) =>
                        setSettings({
                            general: {
                                ...settings,
                                albumBackground: e.currentTarget.checked,
                            },
                        })
                    }
                />
            ),
            isHidden: false,
            title: t('setting.albumBackground'),
        },
        {
            control: (
                <Slider
                    defaultValue={settings.albumBackgroundBlur}
                    label={(e) => `${e} rem`}
                    max={6}
                    min={0}
                    onChangeEnd={(e) => {
                        setSettings({
                            general: {
                                ...settings,
                                albumBackgroundBlur: e,
                            },
                        });
                    }}
                    step={0.5}
                    w={100}
                />
            ),
            indent: true,
            isHidden: !settings.albumBackground,
            title: t('setting.albumBackgroundBlur'),
        },
        {
            control: (
                <Switch
                    aria-label={t('setting.artistBackground')}
                    defaultChecked={settings.artistBackground}
                    onChange={(e) =>
                        setSettings({
                            general: {
                                ...settings,
                                artistBackground: e.currentTarget.checked,
                            },
                        })
                    }
                />
            ),
            isHidden: false,
            title: t('setting.artistBackground'),
        },
        {
            control: (
                <Slider
                    defaultValue={settings.artistBackgroundBlur}
                    label={(e) => `${e} rem`}
                    max={6}
                    min={0}
                    onChangeEnd={(e) => {
                        setSettings({
                            general: {
                                ...settings,
                                artistBackgroundBlur: e,
                            },
                        });
                    }}
                    step={0.5}
                    w={100}
                />
            ),
            indent: true,
            isHidden: !settings.artistBackground,
            title: t('setting.artistBackgroundBlur'),
        },
    ];

    return <SettingsSection options={options} title={'Backgrounds'} />;
});
