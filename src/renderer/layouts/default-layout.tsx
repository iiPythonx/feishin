import { HotkeyItem, useHotkeys } from '@mantine/hooks';
import isElectron from 'is-electron';
import { lazy } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

import { CommandPalette } from '/@/renderer/features/search/components/command-palette';
import { MainContent } from '/@/renderer/layouts/default-layout/main-content';
import { PlayerBar } from '/@/renderer/layouts/default-layout/player-bar';
import { useCommandPalette } from '/@/renderer/store';
import {
    useGeneralSettings,
    useHotkeySettings,
    useSettingsStore,
    useSettingsStoreActions,
    useTweaksSettings,
    useWindowSettings,
} from '/@/renderer/store/settings.store';
import { Platform, PlaybackType } from '/@/shared/types/types';

if (!isElectron()) {
    useSettingsStore.getState().actions.setSettings({
        playback: {
            ...useSettingsStore.getState().playback,
            type: PlaybackType.WEB,
        },
    });
}

const Layout = styled.div<{ 
    $windowBarStyle: Platform,
    $floatingPlayer: boolean
 }>`
    display: grid;
    grid-template-areas:
        'window-bar'
        'main-content'
        'player';
    grid-template-rows: ${(props) => {
        if (props.$floatingPlayer) return '30px';
        if (
            props.$windowBarStyle === Platform.WINDOWS ||
            props.$windowBarStyle === Platform.MACOS
        ) return '30px calc(100vh - 120px) 90px';
        return '0px calc(100vh - 90px) 90px';
    }};

    grid-template-columns: 1fr;
    gap: 0;
    height: 100%;
    overflow: hidden;
    background-color: var(--main-bg)
`;

const WindowBar = lazy(() =>
    import('/@/renderer/layouts/window-bar').then((module) => ({
        default: module.WindowBar,
    })),
);

interface DefaultLayoutProps {
    shell?: boolean;
}

export const DefaultLayout = ({ shell }: DefaultLayoutProps) => {
    const { windowBarStyle } = useWindowSettings();
    const { opened, ...handlers } = useCommandPalette();
    const { bindings } = useHotkeySettings();
    const navigate = useNavigate();
    const localSettings = isElectron() ? window.api.localSettings : null;
    const settings = useGeneralSettings();
    const { setSettings } = useSettingsStoreActions();

    const { floatingPlayer } = useTweaksSettings();

    console.log(floatingPlayer)

    const updateZoom = (increase: number) => {
        const newVal = settings.zoomFactor + increase;
        if (newVal > 300 || newVal < 50 || !isElectron()) return;
        setSettings({
            general: {
                ...settings,
                zoomFactor: newVal,
            },
        });
        localSettings?.setZoomFactor(settings.zoomFactor);
    };
    localSettings?.setZoomFactor(settings.zoomFactor);

    const zoomHotkeys: HotkeyItem[] = [
        [bindings.zoomIn.hotkey, () => updateZoom(5)],
        [bindings.zoomOut.hotkey, () => updateZoom(-5)],
    ];

    useHotkeys([
        [bindings.globalSearch.hotkey, () => handlers.open()],
        [bindings.browserBack.hotkey, () => navigate(-1)],
        [bindings.browserForward.hotkey, () => navigate(1)],
        ...(isElectron() ? zoomHotkeys : []),
    ]);

    return (
        <>
            <Layout
                $windowBarStyle={windowBarStyle}
                $floatingPlayer={floatingPlayer}
                id="default-layout"
            >
                {windowBarStyle !== Platform.WEB && <WindowBar />}
                <MainContent shell={shell} />
                <PlayerBar />
            </Layout>
            <CommandPalette modalProps={{ handlers, opened }} />
        </>
    );
};
