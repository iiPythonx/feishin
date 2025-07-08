import isElectron from 'is-electron';

import { CacheSettings } from '/@/renderer/features/settings/components/window/cache-settngs';
import { PasswordSettings } from '/@/renderer/features/settings/components/window/password-settings';
import { WindowSettings } from '/@/renderer/features/settings/components/window/window-settings';
import { Stack } from '/@/shared/components/stack/stack';

const utils = isElectron() ? window.api.utils : null;

export const WindowTab = () => {
    return (
        <Stack gap="md">
            <WindowSettings />
            <CacheSettings />
            {utils?.isLinux() && (
                <>
                    <PasswordSettings />
                </>
            )}
        </Stack>
    );
};
