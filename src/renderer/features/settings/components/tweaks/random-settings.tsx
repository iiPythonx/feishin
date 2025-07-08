import {
    SettingOption,
    SettingsSection,
} from '/@/renderer/features/settings/components/settings-section';
import { useSettingsStoreActions, useTweaksSettings } from '/@/renderer/store';
import { Select } from '/@/shared/components/select/select';
import { Switch } from '/@/shared/components/switch/switch';

const FORK_THEME_OPTIONS = [
    { label: 'Pyxfluff', value: 'pyxfluff' },
    { label: 'iiPython', value: 'iipython' },
];

export const RandomSettings = () => {
    const settings = useTweaksSettings();
    const { setSettings } = useSettingsStoreActions();

    const randomOptions: SettingOption[] = [
        {
            control: (
                <Switch
                    checked={settings.serverRescan}
                    onChange={(e) => {
                        setSettings({
                            tweaks: {
                                ...settings,
                                serverRescan: e.currentTarget.checked,
                            },
                        });
                    }}
                />
            ),
            description: 'Adds a button to the sidebar allowing you to trigger a rescan.',
            title: 'Enable server rescan',
        },
        {
            control: (
                <Select
                    data={FORK_THEME_OPTIONS}
                    defaultValue={settings.forkTheme ?? 'pyxfluff'}
                    onChange={(e) => {
                        if (!e) return;
                        setSettings({
                            tweaks: {
                                ...settings,
                                forkTheme: e,
                            },
                        });
                    }}
                    value={settings.forkTheme}
                />
            ),
            description:
                'The custom theme you want to use for the Fork, does not affect app theme (dark/light).',
            title: 'Fork Theme',
        },
    ];

    return <SettingsSection options={randomOptions} />;
};
