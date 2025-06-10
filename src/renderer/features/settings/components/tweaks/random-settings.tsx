import { Switch } from '/@/renderer/components';
import {
    SettingOption,
    SettingsSection,
} from '/@/renderer/features/settings/components/settings-section';
import {
    useSettingsStoreActions,
    useTweaksSettings,
} from '/@/renderer/store';

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
            title: 'Enable server rescan'
        }
    ];

    return <SettingsSection options={randomOptions} />;
};
