import { Select, SelectItem } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Switch, Slider } from '/@/renderer/components';
import { useSettingsStoreActions, useBackgroundSettings } from '../../../../store/settings.store';
import {
    SettingOption,
    SettingsSection,
} from '/@/renderer/features/settings/components/settings-section';

const COVER_TYPES: SelectItem[] = [
    { label: 'track', value: 'track' },
    { label: 'album', value: 'album' },
];

export const BackgroundSettings = () => {
    const { t } = useTranslation();
    const settings = useBackgroundSettings();
    const { setSettings } = useSettingsStoreActions();

    const options: SettingOption[] = [
        {
            control: (
                <Switch
                    defaultChecked={settings.enableBackgroundPlayer}
                    onChange={(e) => {
                        setSettings({
                            background: {
                                ...settings,
                                enableBackgroundPlayer: e.currentTarget.checked,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.enableBackgroundPlayer', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            title: t('setting.enableBackgroundPlayer', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Switch
                    defaultChecked={settings.enableBackgroundAlbum}
                    onChange={(e) => {
                        setSettings({
                            background: {
                                ...settings,
                                enableBackgroundAlbum: e.currentTarget.checked,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.enableBackgroundAlbum', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            title: t('setting.enableBackgroundAlbum', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Switch
                    defaultChecked={settings.enableBackgroundArtist}
                    onChange={(e) => {
                        setSettings({
                            background: {
                                ...settings,
                                enableBackgroundArtist: e.currentTarget.checked,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.enableBackgroundArtist', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            title: t('setting.enableBackgroundArtist', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Slider
                    defaultValue={settings.backgroundBlurSize}
                    label={(e) => `${e} rem`}
                    max={6}
                    min={0}
                    step={0.5}
                    w="100px"
                    onChangeEnd={(e) =>
                        setSettings({ background: { ...settings, backgroundBlurSize: Number(e) } })
                    }
                />
            ),
            description: t('setting.backgroundBlurSize', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            isHidden: false,
            title: t('setting.backgroundBlurSize', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Select
                    aria-label={t('setting.backgroundPlayerCoverType')}
                    clearable={false}
                    data={COVER_TYPES}
                    defaultValue={settings.backgroundPlayerCoverType ?? 'album'}
                    onChange={(e) => {
                        if (!e) return;
                        setSettings({
                            background: {
                                ...settings,
                                backgroundPlayerCoverType: e,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.backgroundPlayerCoverType', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            title: t('setting.backgroundPlayerCoverType', {
                postProcess: 'sentenceCase',
            }),
        },
    ];

    return <SettingsSection options={options} />;
};
