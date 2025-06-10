import isElectron from 'is-electron';
import { useTranslation } from 'react-i18next';

import { Select, Switch, TextInput } from '/@/renderer/components';
import {
    SettingOption,
    SettingsSection,
} from '/@/renderer/features/settings/components/settings-section';
import {
    useDiscordSetttings,
    useSettingsStoreActions,
} from '/@/renderer/store';

const PROXY_TYPE_OPTIONS = [
    { label: 'ndip', value: 'ndip' },
    { label: 'pizza', value: 'pizza' }
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
            description: 'Enable playback status in Rich Presence.',
            isHidden: !isElectron(),
            title: 'Discord RPC (modified)'
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
            description: 'The application ID for Rich Presence.',
            title: t('setting.discordApplicationId', {
                discord: 'Discord',
                postProcess: 'sentenceCase',
            }),
            isHidden: !(isElectron() && settings.enabled),
        },
        {
            control: (
                <Select
                    data={PROXY_TYPE_OPTIONS}
                    disabled={!isElectron()}
                    defaultValue={settings.proxyType ?? 'pizza'}
                    onChange={(e) => {
                        if (!e) return;
                        setSettings({
                            discord: {
                                ...settings,
                                proxyType: e,
                            },
                        });
                    }}
                    value={settings.proxyType}
                />
            ),
            description: 'The image proxy you want to forward images to.',
            title: 'Image proxy type',
            isHidden: !(isElectron() && settings.enabled),
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
            description: 'The URL of your selfhosted ndip instance, leave blank for Pizza.',
            title: 'Image proxy URL',
            isHidden: !(isElectron() && settings.enabled),
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
            description: 'Show status as listening instead of playing.',
            title: 'Enable listening status',
            isHidden: !(isElectron() && settings.enabled),
        },
        {
            control: (
                <Switch
                    checked={settings.showArtistName}
                    onChange={(e) => {
                        setSettings({
                            discord: {
                                ...settings,
                                showArtistName: e.currentTarget.checked,
                            },
                        });
                    }}
                />
            ),
            description: 'This will show the artist name you are listening to instead of just Feishin.',
            note: 'Requires Vesktop',
            title: 'Enable artist name',
            isHidden: !(isElectron() && settings.enabled),
        },
    ];

    return <SettingsSection options={discordOptions} />;
};
