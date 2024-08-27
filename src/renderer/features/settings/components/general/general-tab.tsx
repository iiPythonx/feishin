import { Stack } from '@mantine/core';
import { ApplicationSettings } from '/@/renderer/features/settings/components/general/application-settings';
import { ControlSettings } from '/@/renderer/features/settings/components/general/control-settings';
import { ThemeSettings } from '/@/renderer/features/settings/components/general/theme-settings';
import { RemoteSettings } from '/@/renderer/features/settings/components/general/remote-settings';
import isElectron from 'is-electron';
import { ContextMenuSettings } from '/@/renderer/features/settings/components/general/context-menu-settings';

export const GeneralTab = () => {
    return (
        <Stack spacing="md">
            <ApplicationSettings />
            <ThemeSettings />
            <ControlSettings />
            <ContextMenuSettings />
            {isElectron() && <RemoteSettings />}
        </Stack>
    );
};
