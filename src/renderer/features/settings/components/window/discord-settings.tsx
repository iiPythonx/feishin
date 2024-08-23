import { SelectItem } from '@mantine/core';
import isElectron from 'is-electron';
import { Select, Switch, TextInput } from '/@/renderer/components';
import {
    SettingOption,
    SettingsSection,
} from '/@/renderer/features/settings/components/settings-section';
import { useDiscordSetttings, useSettingsStoreActions } from '/@/renderer/store';
import { useTranslation } from 'react-i18next';

const PROXY_ITEMS: SelectItem[] = [
    { label: 'imgproxy', value: 'imgproxy' },
    { label: 'ndip', value: 'ndip' },
    { label: 'freeimagehost', value: 'freeimagehost' },
    { label: 'imgbb', value: 'imgbb' },
];

export const DiscordSettings = () => {
    const { t } = useTranslation();
    const settings = useDiscordSetttings();
    const { setSettings } = useSettingsStoreActions();

    const discordOptions: SettingOption[] = [
        {
            control: (
                <Switch
                    checked={settings.enabled}
                    onChange={(e) => {
                        setSettings({
                            discord: {
                                ...settings,
                                enabled: e.currentTarget.checked,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.discordRichPresence', {
                context: 'description',
                discord: 'Discord',
                icon: 'icon',
                paused: 'paused',
                playing: 'playing',
                postProcess: 'sentenceCase',
            }),
            isHidden: !isElectron(),
            title: t('setting.discordRichPresence', {
                discord: 'Discord',
                postProcess: 'sentenceCase',
            }),
        },
        {
            control: (
                <TextInput
                    defaultValue={settings.clientId}
                    onBlur={(e) => {
                        setSettings({
                            discord: {
                                ...settings,
                                clientId: e.currentTarget.value,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.discordApplicationId', {
                context: 'description',
                defaultId: '1117545345690374277',
                discord: 'Discord',
                postProcess: 'sentenceCase',
            }),
            isHidden: !isElectron(),
            title: t('setting.discordApplicationId', {
                discord: 'Discord',
                postProcess: 'sentenceCase',
            }),
        },
        {
            control: (
                <Select
                    aria-label={t('setting.discordProxyType')}
                    clearable={false}
                    data={PROXY_ITEMS}
                    defaultValue={settings.proxyType ?? 'freeimagehost'}
                    disabled={!isElectron()}
                    onChange={(e) => {
                        if (!e) return;
                        setSettings({
                            discord: {
                                ...settings,
                                proxyType: e,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.discordProxyType', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            isHidden: !isElectron(),
            title: t('setting.discordProxyType', {
                discord: 'Discord',
                postProcess: 'sentenceCase',
            }),
        },
        {
            control: (
                <TextInput
                    defaultValue={settings.proxyUrl}
                    onBlur={(e) => {
                        setSettings({
                            discord: {
                                ...settings,
                                proxyUrl: e.currentTarget.value,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.discordProxyUrl', {
                context: 'description',
                discord: 'Discord',
                postProcess: 'sentenceCase',
            }),
            isHidden: !isElectron(),
            title: t('setting.discordProxyUrl', {
                discord: 'Discord',
                postProcess: 'sentenceCase',
            }),
        },
    ];

    return <SettingsSection options={discordOptions} />;
};
