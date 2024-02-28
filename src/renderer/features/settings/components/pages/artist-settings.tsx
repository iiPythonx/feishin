import { Switch } from '/@/renderer/components';
import { SettingsSection } from '/@/renderer/features/settings/components/settings-section';
import { useArtistSettings, useSettingsStoreActions } from '/@/renderer/store/settings.store';
import { useTranslation } from 'react-i18next';

export const ArtistSettings = () => {
    const { t } = useTranslation();
    const settings = useArtistSettings();
    const { setSettings } = useSettingsStoreActions();

    const artistOptions = [
        {
            control: (
                <Switch
                    defaultChecked={settings.artistBiographies}
                    onChange={(e) => {
                        setSettings({
                            artist: {
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
        {
            control: (
                <Switch
                    defaultChecked={settings.artistTopSongs}
                    onChange={(e) => {
                        setSettings({
                            artist: {
                                ...settings,
                                artistTopSongs: e.currentTarget.checked,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.artistTopSongs', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            title: t('setting.artistTopSongs', { postProcess: 'sentenceCase' }),
        },
    ];

    return <SettingsSection options={artistOptions} />;
};
