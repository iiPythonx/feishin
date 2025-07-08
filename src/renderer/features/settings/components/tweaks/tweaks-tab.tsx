import { Stack } from '@mantine/core';

import { BackgroundSettings } from '/@/renderer/features/settings/components/tweaks/background-settings';
import { DiscordSettings } from '/@/renderer/features/settings/components/tweaks/discord-settings';
import { RandomSettings } from '/@/renderer/features/settings/components/tweaks/random-settings';

export const TweaksTab = () => {
    return (
        <Stack gap="md">
            <DiscordSettings />
            <BackgroundSettings />
            <RandomSettings />
        </Stack>
    );
};
