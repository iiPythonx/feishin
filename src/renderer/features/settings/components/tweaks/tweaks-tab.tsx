import { Stack } from '@mantine/core';
import { DiscordSettings } from '/@/renderer/features/settings/components/tweaks/discord-settings';
import { BackgroundSettings } from '/@/renderer/features/settings/components/tweaks/background-settings';
import { RandomSettings } from '/@/renderer/features/settings/components/tweaks/random-settings';

export const TweaksTab = () => {
    return (
        <Stack spacing="md">
            <DiscordSettings />
            <BackgroundSettings />
            <RandomSettings />
        </Stack>
    );
};
