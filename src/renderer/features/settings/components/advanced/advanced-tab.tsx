import isElectron from 'is-electron';
import { memo } from 'react';
import { Fragment } from 'react/jsx-runtime';

import { CacheSettings } from '/@/renderer/features/settings/components/advanced/cache-settngs';
import { ExportImportSettings } from '/@/renderer/features/settings/components/advanced/export-import-settings';
import { LoggerSettings } from '/@/renderer/features/settings/components/advanced/logger-settings';
import { PasswordSettings } from '/@/renderer/features/settings/components/advanced/password-settings';
import { RemoteSettings } from '/@/renderer/features/settings/components/advanced/remote-settings';
import { Divider } from '/@/shared/components/divider/divider';
import { Stack } from '/@/shared/components/stack/stack';

const utils = isElectron() ? window.api.utils : null;

const sections = [
    { component: ExportImportSettings, key: 'export-import' },
    { component: LoggerSettings, key: 'logger' },
    { component: CacheSettings, key: 'cache' },
    { component: RemoteSettings, key: 'remote' },
    { component: PasswordSettings, hidden: !utils?.isLinux(), key: 'password' },
];

export const AdvancedTab = memo(() => {
    return (
        <Stack gap="md">
            {sections.map(({ component: Section, hidden, key }, index) => (
                <Fragment key={key}>
                    {!hidden && <Section />}
                    {index < sections.length - 1 && <Divider />}
                </Fragment>
            ))}
        </Stack>
    );
});
