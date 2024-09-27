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
    { label: 'ndip', value: 'ndip' },
    { label: 'pizza', value: 'pizza' },
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
                postProcess: 'sentenceCase',
            }),
            isHidden: !isElectron(),
            title: t('setting.discordRichPresence', {
                discord: 'Discord',
                rpc: 'RPC',
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
                postProcess: 'sentenceCase',
            }),
            isHidden: !(isElectron() && settings.enabled),
            title: t('setting.discordApplicationId'),
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
            isHidden: !(isElectron() && settings.enabled),
            title: t('setting.discordProxyType', {
                postProcess: 'sentenceCase',
            }),
        },
        {
            control: (
                <TextInput
                    defaultValue={settings.proxyUrl}
                    disabled={settings.proxyType !== 'ndip'}
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
                postProcess: 'sentenceCase',
            }),
            isHidden: !(isElectron() && settings.enabled),
            title: t('setting.discordProxyUrl'),
        },
        {
            control: (
                <Switch
                    checked={settings.showAsListening}
                    onChange={(e) => {
                        setSettings({
                            discord: {
                                ...settings,
                                showAsListening: e.currentTarget.checked,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.discordListening', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            isHidden: !(isElectron() && settings.enabled),
            title: t('setting.discordListening', {
                postProcess: 'sentenceCase',
            }),
        },
        {
            control: (
                <Switch
                    checked={settings.enableCustomName}
                    onChange={(e) => {
                        setSettings({
                            discord: {
                                ...settings,
                                enableCustomName: e.currentTarget.checked,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.discordCustomname', { context: 'description' }),
            isHidden: !(isElectron() && settings.enabled),
            note: 'Requires Vesktop',
            title: t('setting.discordCustomname', {
                postProcess: 'sentenceCase',
            }),
        },
    ];

    return <SettingsSection options={discordOptions} />;
};
