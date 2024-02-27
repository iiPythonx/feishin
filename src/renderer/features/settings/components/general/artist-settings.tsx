import { Switch } from '/@/renderer/components';
import { SettingsSection } from '/@/renderer/features/settings/components/settings-section';
import { useGeneralSettings, useSettingsStoreActions } from '/@/renderer/store/settings.store';
import { useTranslation } from 'react-i18next';

export const ArtistSettings = () => {
    const { t } = useTranslation();
    const settings = useGeneralSettings();
    const { setSettings } = useSettingsStoreActions();

    const artistOptions = [
        {
            control: (
                <Switch
                    defaultChecked={settings.artistBiographies}
                    onChange={(e) => {
                        setSettings({
                            general: {
                                ...settings,
                                artistBiographies: e.currentTarget.checked,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.artistBiographies', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            title: t('setting.artistBiographies', { postProcess: 'sentenceCase' }),
        },
    ];

    return <SettingsSection options={artistOptions} />;
};
