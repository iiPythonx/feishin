import { lazy } from 'react';
import { Tabs } from '/@/renderer/components';
import { useSettingsStore, useSettingsStoreActions } from '/@/renderer/store/settings.store';
import isElectron from 'is-electron';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const GeneralTab = lazy(() =>
    import('/@/renderer/features/settings/components/general/general-tab').then((module) => ({
        default: module.GeneralTab,
    })),
);

const PagesTab = lazy(() =>
    import('/@/renderer/features/settings/components/pages/pages-tab').then((module) => ({
        default: module.PagesTab,
    })),
);

const PlaybackTab = lazy(() =>
    import('/@/renderer/features/settings/components/playback/playback-tab').then((module) => ({
        default: module.PlaybackTab,
    })),
);

const ApplicationTab = lazy(() =>
    import('/@/renderer/features/settings/components/window/window-tab').then((module) => ({
        default: module.WindowTab,
    })),
);

const HotkeysTab = lazy(() =>
    import('/@/renderer/features/settings/components/hotkeys/hotkeys-tab').then((module) => ({
        default: module.HotkeysTab,
    })),
);

const AdvancedTab = lazy(() =>
    import('/@/renderer/features/settings/components/advanced/advanced-tab').then((module) => ({
        default: module.AdvancedTab,
    })),
);

const TweaksTab = lazy(() =>
    import('/@/renderer/features/settings/components/tweaks/tweaks-tab').then((module) => ({
        default: module.TweaksTab,
    })),
);

const TabContainer = styled.div`
    width: 100%;
    height: 100%;
    padding: 1rem;
    overflow: scroll;
`;

export const SettingsContent = () => {
    const { t } = useTranslation();
    const currentTab = useSettingsStore((state) => state.tab);
    const { setSettings } = useSettingsStoreActions();

    return (
        <TabContainer>
            <Tabs
                keepMounted={false}
                orientation="horizontal"
                value={currentTab}
                variant="default"
                onTabChange={(e) => e && setSettings({ tab: e })}
            >
                <Tabs.List>
                    <Tabs.Tab value="general">
                        {t('page.setting.generalTab', { postProcess: 'sentenceCase' })}
                    </Tabs.Tab>
                    <Tabs.Tab value="pages">
                        {t('page.setting.pagesTab', { postProcess: 'sentenceCase' })}
                    </Tabs.Tab>
                    <Tabs.Tab value="playback">
                        {t('page.setting.playbackTab', { postProcess: 'sentenceCase' })}
                    </Tabs.Tab>
                    <Tabs.Tab value="hotkeys">
                        {t('page.setting.hotkeysTab', { postProcess: 'sentenceCase' })}
                    </Tabs.Tab>
                    {isElectron() && (
                        <Tabs.Tab value="window">
                            {t('page.setting.windowTab', { postProcess: 'sentenceCase' })}
                        </Tabs.Tab>
                    )}
                    <Tabs.Tab value="advanced">
                        {t('page.setting.advanced', { postProcess: 'sentenceCase' })}
                    </Tabs.Tab>
                    <Tabs.Tab value="tweaks">
                        {t('page.setting.tweaks', { postProcess: 'sentenceCase' })}
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="general">
                    <GeneralTab />
                </Tabs.Panel>
                <Tabs.Panel value="pages">
                    <PagesTab />
                </Tabs.Panel>
                <Tabs.Panel value="playback">
                    <PlaybackTab />
                </Tabs.Panel>
                <Tabs.Panel value="hotkeys">
                    <HotkeysTab />
                </Tabs.Panel>
                {isElectron() && (
                    <Tabs.Panel value="window">
                        <ApplicationTab />
                    </Tabs.Panel>
                )}
                <Tabs.Panel value="advanced">
                    <AdvancedTab />
                </Tabs.Panel>
                <Tabs.Panel value="tweaks">
                    <TweaksTab />
                </Tabs.Panel>
            </Tabs>
        </TabContainer>
    );
};
