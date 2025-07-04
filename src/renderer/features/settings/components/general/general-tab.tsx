import { Stack } from '@mantine/core';

import { ApplicationSettings } from '/@/renderer/features/settings/components/general/application-settings';
import { ArtistSettings } from '/@/renderer/features/settings/components/general/artist-settings';
import { ContextMenuSettings } from '/@/renderer/features/settings/components/general/context-menu-settings';
import { ControlSettings } from '/@/renderer/features/settings/components/general/control-settings';
import { HomeSettings } from '/@/renderer/features/settings/components/general/home-settings';
import { SidebarReorder } from '/@/renderer/features/settings/components/general/sidebar-reorder';
import { SidebarSettings } from '/@/renderer/features/settings/components/general/sidebar-settings';
import { ThemeSettings } from '/@/renderer/features/settings/components/general/theme-settings';

export const GeneralTab = () => {
    return (
        <Stack gap="md">
            <ApplicationSettings />
            <ThemeSettings />
            <ControlSettings />
            <HomeSettings />
            <ArtistSettings />
            <SidebarReorder />
            <SidebarSettings />
            <ContextMenuSettings />
        </Stack>
    );
};
