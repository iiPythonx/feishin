import { Divider, Stack } from '@mantine/core';
import { StylesSettings } from '/@/renderer/features/settings/components/advanced/styles-settings';
import { RemoteSettings } from '/@/renderer/features/settings/components/advanced/remote-settings';
import { PasswordSettings } from '/@/renderer/features/settings/components/advanced/password-settings';
import isElectron from 'is-electron';

const utils = isElectron() ? window.electron.utils : null;

export const AdvancedTab = () => {
    return (
        <Stack spacing="md">
            <StylesSettings />
            <Divider />
            {isElectron() && <RemoteSettings />}
            {utils?.isLinux() && (
                <>
                    <PasswordSettings />
                </>
            )}
        </Stack>
    );
};
