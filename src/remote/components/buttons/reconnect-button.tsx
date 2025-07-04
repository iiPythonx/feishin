import { RiRestartLine } from 'react-icons/ri';

import { useConnected, useReconnect } from '/@/remote/store';
import { ActionIcon } from '/@/shared/components/action-icon/action-icon';

export const ReconnectButton = () => {
    const connected = useConnected();
    const reconnect = useReconnect();

    return (
        <ActionIcon
            onClick={() => reconnect()}
            tooltip={{
                label: connected ? 'Reconnect' : 'Not connected. Reconnect.',
            }}
            variant="default"
        >
            <RiRestartLine
                color={connected ? 'var(--theme-colors-primary)' : 'var(--theme-colors-foreground)'}
                size={30}
            />
        </ActionIcon>
    );
};
