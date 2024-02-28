import { Divider, Stack } from '@mantine/core';
import { HomeSettings } from '/@/renderer/features/settings/components/pages/home-settings';
import { GeneralSettings } from '/@/renderer/features/settings/components/pages/general-settings';
import { SidebarSettings } from '/@/renderer/features/settings/components/pages/sidebar-settings';

export const PagesTab = () => {
    return (
        <Stack spacing="md">
            <HomeSettings />
            <Divider />
            <GeneralSettings />
            <Divider />
            <SidebarSettings />
        </Stack>
    );
};
