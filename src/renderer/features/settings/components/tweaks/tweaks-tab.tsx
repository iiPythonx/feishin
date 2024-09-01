import { Stack } from '@mantine/core';
import { BackgroundSettings } from './background-settings';
import { DiscordSettings } from './discord-settings';
import { Tweaks } from './iipython-tweaks';

export const TweaksTab = () => {
    return (
        <Stack spacing="md">
            <Tweaks />
            <DiscordSettings />
            <BackgroundSettings />
        </Stack>
    );
};
