import { Stack } from '@mantine/core';
import { DiscordSettings } from '/@/renderer/features/settings/components/tweaks/discord-settings';

export const TweaksTab = () => {
    return (
        <Stack spacing="md">
            <DiscordSettings />
        </Stack>
    );
};
