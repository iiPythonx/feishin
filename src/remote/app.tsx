import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import '/@/shared/styles/global.css';

import { useEffect } from 'react';

import { Shell } from '/@/remote/components/shell';
import { useIsDark, useReconnect } from '/@/remote/store';
import { useAppTheme } from '/@/renderer/themes/use-app-theme';
import { AppTheme } from '/@/shared/themes/app-theme-types';

export const App = () => {
    const isDark = useIsDark();
    const reconnect = useReconnect();

    useEffect(() => {
        reconnect();
    }, [reconnect]);

    const { mode, theme } = useAppTheme(isDark ? AppTheme.DEFAULT_DARK : AppTheme.DEFAULT_LIGHT);

    return (
        <MantineProvider
            defaultColorScheme={mode}
            theme={theme}
        >
            <Shell />
        </MantineProvider>
    );
};
