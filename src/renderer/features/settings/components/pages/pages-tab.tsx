import { memo } from 'react';

import { BackgroundSettings } from '/@/renderer/features/settings/components/pages/background-settings';
import { PageSettings } from '/@/renderer/features/settings/components/pages/page-settings';
import { Divider } from '/@/shared/components/divider/divider';
import { Stack } from '/@/shared/components/stack/stack';

export const PagesTab = memo(() => {
    return (
        <Stack gap="md">
            <BackgroundSettings />
            <Divider />
            <PageSettings />
        </Stack>
    );
});
