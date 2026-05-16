import isElectron from 'is-electron';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import {
    SettingOption,
    SettingsSection,
} from '/@/renderer/features/settings/components/settings-section';
import { useLyricsSettings, useSettingsStoreActions } from '/@/renderer/store';
import { MultiSelect } from '/@/shared/components/multi-select/multi-select';
import { NumberInput } from '/@/shared/components/number-input/number-input';
import { Switch } from '/@/shared/components/switch/switch';
import { LyricSource } from '/@/shared/types/domain-types';

const localSettings = isElectron() ? window.api.localSettings : null;

export const LyricSettings = memo(() => {
    const { t } = useTranslation();
    const settings = useLyricsSettings();
    const { setSettings } = useSettingsStoreActions();

    const updateSetting = (updates: Partial<typeof settings>) => {
        setSettings({
            lyrics: {
                ...settings,
                ...updates,
            },
        });
    };

    const lyricOptions: SettingOption[] = [
        {
            control: (
                <Switch
                    aria-label="Follow lyrics"
                    defaultChecked={settings.follow}
                    onChange={(e) => updateSetting({ follow: e.currentTarget.checked })}
                />
            ),
            description: t('setting.followLyric', {
                context: 'description',
            }),
            title: t('setting.followLyric'),
        },
        {
            control: (
                <Switch
                    aria-label="Prefer local lyrics"
                    defaultChecked={settings.preferLocalLyrics}
                    onChange={(e) => updateSetting({ preferLocalLyrics: e.currentTarget.checked })}
                />
            ),
            description: t('setting.preferLocalLyrics', {
                context: 'description',
            }),
            isHidden: !isElectron(),
            title: t('setting.preferLocalLyrics'),
        },
        {
            control: (
                <Switch
                    aria-label="Enable fetching lyrics"
                    defaultChecked={settings.fetch}
                    onChange={(e) => updateSetting({ fetch: e.currentTarget.checked })}
                />
            ),
            description: t('setting.lyricFetch', {
                context: 'description',
            }),
            isHidden: !isElectron(),
            title: t('setting.lyricFetch'),
        },
        {
            control: (
                <MultiSelect
                    aria-label="Lyric providers"
                    clearable
                    data={Object.values(LyricSource)}
                    defaultValue={settings.sources}
                    onChange={(e: string[]) => {
                        localSettings?.set('lyrics', e);
                        updateSetting({ sources: e.map((source) => source as LyricSource) });
                    }}
                    width={300}
                />
            ),
            description: t('setting.lyricFetchProvider', {
                context: 'description',
            }),
            isHidden: !isElectron(),
            title: t('setting.lyricFetchProvider'),
        },
        {
            control: (
                <NumberInput
                    defaultValue={settings.delayMs}
                    onBlur={(e) => {
                        const value = Number(e.currentTarget.value);
                        updateSetting({ delayMs: value });
                    }}
                    step={10}
                    width={100}
                />
            ),
            description: t('setting.lyricOffset', {
                context: 'description',
            }),
            isHidden: !isElectron(),
            title: t('setting.lyricOffset'),
        },
    ];

    return <SettingsSection options={lyricOptions} title={t('page.setting.lyrics')} />;
});
