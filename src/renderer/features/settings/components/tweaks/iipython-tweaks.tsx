import { NumberInput } from '/@/renderer/components';
import { SettingsSection } from '/@/renderer/features/settings/components/settings-section';
import { useGeneralSettings, useSettingsStoreActions } from '/@/renderer/store/settings.store';
import { useTranslation } from 'react-i18next';

export const Tweaks = () => {
    const { t } = useTranslation();
    const settings = useGeneralSettings();
    const { setSettings } = useSettingsStoreActions();

    const controlOptions = [
        {
            control: (
                <NumberInput
                    defaultValue={settings.buttonSize}
                    max={30}
                    min={15}
                    rightSection="px"
                    width={75}
                    onBlur={(e) => {
                        if (!e) return;
                        const newVal = e.currentTarget.value
                            ? Math.min(Math.max(Number(e.currentTarget.value), 15), 30)
                            : settings.buttonSize;
                        setSettings({
                            general: {
                                ...settings,
                                buttonSize: newVal,
                            },
                        });
                    }}
                />
            ),
            description: t('setting.buttonSize', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            isHidden: false,
            title: t('setting.buttonSize', { postProcess: 'sentenceCase' }),
        },
        {
            control: (
                <NumberInput
                    defaultValue={settings.albumArtRes || undefined}
                    max={2500}
                    placeholder="0"
                    rightSection="px"
                    value={settings.albumArtRes ?? 0}
                    width={75}
                    onBlur={(e) => {
                        const newVal =
                            e.currentTarget.value !== '0'
                                ? Math.min(Math.max(Number(e.currentTarget.value), 175), 2500)
                                : null;
                        setSettings({ general: { ...settings, albumArtRes: newVal } });
                    }}
                />
            ),
            description: t('setting.playerAlbumArtResolution', {
                context: 'description',
                postProcess: 'sentenceCase',
            }),
            isHidden: false,
            title: t('setting.playerAlbumArtResolution', { postProcess: 'sentenceCase' }),
        },
    ];

    return <SettingsSection options={controlOptions} />;
};
