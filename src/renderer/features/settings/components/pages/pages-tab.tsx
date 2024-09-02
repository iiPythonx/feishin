import { Stack } from '@mantine/core';
import { HomeSettings } from '/@/renderer/features/settings/components/pages/home-settings';
import { GeneralSettings } from '/@/renderer/features/settings/components/pages/general-settings';
import { SidebarSettings } from '/@/renderer/features/settings/components/pages/sidebar-settings';
import { SidebarReorder } from '/@/renderer/features/settings/components/general/sidebar-reorder';

export const PagesTab = () => {
    return (
        <Stack spacing="md">
            <HomeSettings />
            <GeneralSettings />
            <SidebarSettings />
            <SidebarReorder />
        </Stack>
    );
};
