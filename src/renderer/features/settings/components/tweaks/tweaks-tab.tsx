import { Stack } from '@mantine/core';
import { DiscordSettings } from '/@/renderer/features/settings/components/tweaks/discord-settings';
import { BackgroundSettings } from '/@/renderer/features/settings/components/tweaks/background-settings';

export const TweaksTab = () => {
    return (
        <Stack spacing="md">
            <DiscordSettings />
            <BackgroundSettings />
        </Stack>
    );
};
