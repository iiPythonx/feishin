import { useQuery } from '@tanstack/react-query';
import isEqual from 'lodash/isEqual';
import { useEffect } from 'react';

import { controller } from '/@/renderer/api/controller';
import { queryKeys } from '/@/renderer/api/query-keys';
import { useAuthStoreActions, useCurrentServer } from '/@/renderer/store';

export const useServerVersion = () => {
    const { updateServer } = useAuthStoreActions();
    const server = useCurrentServer();

    const serverInfo = useQuery({
        enabled: !!server,
        queryFn: async ({ signal }) => {
            return controller.getServerInfo({
                apiClientProps: {
                    serverId: server?.id || '',
                    signal,
                },
            });
        },
        queryKey: queryKeys.server.root(server?.id),
    });

    useEffect(() => {
        if (!server?.id) {
            return;
        }

        if (server?.id === serverInfo.data?.id) {
            const { features, version } = serverInfo.data || {};
            if (version !== server?.version || !isEqual(features, server?.features)) {
                updateServer(server.id, {
                    features,
                    version,
                });
            }
        }
    }, [serverInfo?.data, server?.features, server?.id, server?.version, updateServer]);
};
