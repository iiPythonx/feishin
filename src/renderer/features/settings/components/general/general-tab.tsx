import { Divider, Stack } from '@mantine/core';
import { ApplicationSettings } from '/@/renderer/features/settings/components/general/application-settings';
import { ControlSettings } from '/@/renderer/features/settings/components/general/control-settings';
import { ThemeSettings } from '/@/renderer/features/settings/components/general/theme-settings';
import { RemoteSettings } from '/@/renderer/features/settings/components/general/remote-settings';
import isElectron from 'is-electron';

export const GeneralTab = () => {
    return (
        <Stack spacing="md">
            <ApplicationSettings />
            <Divider />
            <ThemeSettings />
            <Divider />
            <ControlSettings />
            {isElectron() && (
                <>
                    <Divider />
                    <RemoteSettings />
                </>
            )}
        </Stack>
    );
};
