import {
    SettingOption,
    SettingsSection,
} from '/@/renderer/features/settings/components/settings-section';
import { useSettingsStoreActions, useTweaksSettings } from '/@/renderer/store';
import { Switch } from '/@/shared/components/switch/switch';

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
                <Switch
                    checked={settings.floatingPlayer}
                    onChange={(e) => {
                        setSettings({
                            tweaks: {
                                ...settings,
                                floatingPlayer: e.currentTarget.checked,
                            },
                        });
                    }}
                />
            ),
            description: 'Makes the playerbar float and the body a bit longer. Your window style should be Windows or macOS. ',
            title: 'Floating Playerbar',
        },
    ];

    return <SettingsSection options={randomOptions} />;
};
