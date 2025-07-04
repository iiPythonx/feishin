import { StylesSettings } from '/@/renderer/features/settings/components/advanced/styles-settings';
import { RemoteSettings } from '/@/renderer/features/settings/components/general/remote-settings';
import isElectron from 'is-electron';

export const AdvancedTab = () => {
    return (
        <Stack gap="md">
            <StylesSettings />
            
            {isElectron() && <RemoteSettings />}
        </Stack>
    );
};
