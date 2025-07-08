import isElectron from 'is-electron';
import { useTranslation } from 'react-i18next';

import {
    SettingOption,
    SettingsSection,
} from '/@/renderer/features/settings/components/settings-section';
import { useDiscordSetttings, useSettingsStoreActions } from '/@/renderer/store';
import { Select } from '/@/shared/components/select/select';
import { Switch } from '/@/shared/components/switch/switch';
import { TextInput } from '/@/shared/components/text-input/text-input';

const PROXY_TYPE_OPTIONS = [
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
            description: 'Enable playback status in Rich Presence.',
            isHidden: !isElectron(),
            title: 'Discord RPC',
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
            isHidden: !(isElectron() && settings.enabled),
            note: "You shouldn't need to change this.",
            title: t('setting.discordApplicationId', {
                discord: 'Discord',
                postProcess: 'sentenceCase',
            }),
        },
        {
            control: (
                <Select
                    data={PROXY_TYPE_OPTIONS}
                    defaultValue={settings.proxyType ?? 'pizza'}
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
                    value={settings.proxyType}
                />
            ),
            description: 'The image proxy you want to forward images to.',
            isHidden: !(isElectron() && settings.enabled),
            title: 'Image proxy type',
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
            isHidden: !(isElectron() && settings.enabled),
            title: 'Image proxy URL',
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
            isHidden: !(isElectron() && settings.enabled),
            title: 'Enable listening status',
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
            description:
                'This will show the artist name you are listening to instead of just Feishin.',
            isHidden: !(isElectron() && settings.enabled),
            note: 'Requires Vesktop or another client utilizing ARRPC ',
            title: 'Enable artist name',
        },
    ];

    return <SettingsSection options={discordOptions} />;
};
