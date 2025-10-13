import { Stack } from '@mantine/core';

import { DiscordSettings } from '/@/renderer/features/settings/components/tweaks/discord-settings';
import { RandomSettings } from '/@/renderer/features/settings/components/tweaks/random-settings';

export const TweaksTab = () => {
    return (
        <Stack gap="md">
            <DiscordSettings />
            <RandomSettings />
        </Stack>
    );
};
