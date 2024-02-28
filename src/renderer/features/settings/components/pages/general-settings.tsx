import { Switch } from '/@/renderer/components';
import { SettingsSection } from '/@/renderer/features/settings/components/settings-section';
import { useGeneralSettings, useSettingsStoreActions } from '/@/renderer/store/settings.store';
import { useTranslation } from 'react-i18next';

export const GeneralSettings = () => {
    const { t } = useTranslation();
    const settings = useGeneralSettings();
    const { setSettings } = useSettingsStoreActions();

    const generalOptions = [
        {
            control: (
                <Switch
                    aria-label="Go to playlist songs page by default"
                    defaultChecked={settings.defaultFullPlaylist}
                    onChange={(e) =>
                        setSettings({
                            general: {
                                ...settings,
                                defaultFullPlaylist: e.currentTarget.checked,
                            },
                        })
                    }
                />
            ),
            description: t('setting.skipPlaylistPage', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            isHidden: false,
            title: t('setting.skipPlaylistPage', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <Switch
                    defaultChecked={settings.externalLinks}
                    onChange={(e) => {
                        setSettings({
                            general: {
                                ...settings,
                                externalLinks: e.currentTarget.checked,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.externalLinks', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            title: t('setting.externalLinks', { postProcess: 'sentenceCase' }),
        },
    ];

    return <SettingsSection options={generalOptions} />;
};
