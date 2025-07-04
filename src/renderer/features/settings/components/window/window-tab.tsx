import isElectron from 'is-electron';

import { PasswordSettings } from '/@/renderer/features/settings/components/window/password-settings';
import { UpdateSettings } from '/@/renderer/features/settings/components/window/update-settings';
import { WindowSettings } from '/@/renderer/features/settings/components/window/window-settings';
import { CacheSettings } from '/@/renderer/features/settings/components/window/cache-settngs';

const utils = isElectron() ? window.api.utils : null;

export const WindowTab = () => {
    return (
        <Stack gap="md">
            <WindowSettings />
            <UpdateSettings />
            <CacheSettings />
            {utils?.isLinux() && (
                <>
                    <PasswordSettings />
                </>
            )}
        </Stack>
    );
};
