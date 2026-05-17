import { memo } from 'react';
import { Fragment } from 'react/jsx-runtime';

import { DiscordSettings } from '/@/renderer/features/settings/components/window/discord-settings';
import { WindowSettings } from '/@/renderer/features/settings/components/window/window-settings';
import { Divider } from '/@/shared/components/divider/divider';
import { Stack } from '/@/shared/components/stack/stack';

const sections = [
    { component: WindowSettings, key: 'window' },
    { component: DiscordSettings, key: 'discord' },
];

export const WindowTab = memo(() => {
    return (
        <Stack gap="md">
            {sections.map(({ component: Section, key }, index) => (
                <Fragment key={key}>
                    <Section />
                    {index < sections.length - 1 && <Divider />}
                </Fragment>
            ))}
        </Stack>
    );
});
