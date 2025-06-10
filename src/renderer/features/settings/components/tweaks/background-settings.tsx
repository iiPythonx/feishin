import { useTranslation } from 'react-i18next';

import { Slider, Switch } from '/@/renderer/components';
import {
    SettingOption,
    SettingsSection,
} from '/@/renderer/features/settings/components/settings-section';
import { useSettingsStoreActions, useTweaksSettings } from '/@/renderer/store/settings.store';

export const BackgroundSettings = () => {
    const { t } = useTranslation();
    const settings = useTweaksSettings();
    const { setSettings } = useSettingsStoreActions();

    const backgroundOptions: SettingOption[] = [
        {
            control: (
                <Switch
                    aria-label={t('setting.artistBackground', { postProcess: 'sentenceCase' })}
                    defaultChecked={settings.artistBackground}
                    onChange={(e) =>
                        setSettings({
                            tweaks: {
                                ...settings,
                                artistBackground: e.currentTarget.checked,
                            },
                        })
                    }
                />
            ),
            description: t('setting.artistBackground', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            isHidden: false,
            title: t('setting.artistBackground', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Switch
                    aria-label={t('setting.albumBackground', { postProcess: 'sentenceCase' })}
                    defaultChecked={settings.albumBackground}
                    onChange={(e) =>
                        setSettings({
                            tweaks: {
                                ...settings,
                                albumBackground: e.currentTarget.checked,
                            },
                        })
                    }
                />
            ),
            description: t('setting.albumBackground', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            isHidden: false,
            title: t('setting.albumBackground', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Slider
                    defaultValue={settings.headerBackgroundBlur}
                    label={(e) => `${e} rem`}
                    max={6}
                    min={0}
                    onChangeEnd={(e) => {
                        setSettings({
                            tweaks: {
                                ...settings,
                                headerBackgroundBlur: e,
                            },
                        });
                    }}
                    step={0.5}
                    w={100}
                />
            ),
            description: t('setting.headerBackgroundBlur', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            isHidden: false,
            title: t('setting.headerBackgroundBlur', { postProcess: 'sentenceCase' }),
        },
    ];

    return <SettingsSection options={backgroundOptions} />;
};
