import { Stack } from '@mantine/core';
import { WindowSettings } from '/@/renderer/features/settings/components/window/window-settings';
import { CacheSettings } from '/@/renderer/features/settings/components/window/cache-settngs';

export const WindowTab = () => {
    return (
        <Stack spacing="md">
            <WindowSettings />
            <CacheSettings />
        </Stack>
    );
};
