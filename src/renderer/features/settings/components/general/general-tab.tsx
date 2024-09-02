import { Stack } from '@mantine/core';
import { ApplicationSettings } from '/@/renderer/features/settings/components/general/application-settings';
import { ControlSettings } from '/@/renderer/features/settings/components/general/control-settings';
import { ThemeSettings } from '/@/renderer/features/settings/components/general/theme-settings';
import { ContextMenuSettings } from '/@/renderer/features/settings/components/general/context-menu-settings';
import { ArtistSettings } from '/@/renderer/features/settings/components/general/artist-settings';

export const GeneralTab = () => {
    return (
        <Stack spacing="md">
            <ApplicationSettings />
            <ThemeSettings />
            <ControlSettings />
            <ArtistSettings />
            <ContextMenuSettings />
        </Stack>
    );
};
