import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { api } from '/@/renderer/api';
import { MutationOptions } from '/@/renderer/lib/react-query';
import { useIncrementQueuePlayCount } from '/@/renderer/store';
import { usePlayEvent } from '/@/renderer/store/event.store';
import { ScrobbleArgs, ScrobbleResponse } from '/@/shared/types/domain-types';

export const useSendScrobble = (options?: MutationOptions) => {
    const incrementPlayCount = useIncrementQueuePlayCount();
    const sendPlayEvent = usePlayEvent();

    return useMutation<ScrobbleResponse, AxiosError, ScrobbleArgs, null>({
        mutationFn: (args) => {
            return api.controller.scrobble({
                ...args,
                apiClientProps: { serverId: args.apiClientProps.serverId },
            });
        },
        onSuccess: (_data, variables) => {
            // Manually increment the play count for the song in the queue if scrobble was submitted
            if (variables.query.submission) {
                incrementPlayCount([variables.query.id]);
                sendPlayEvent(variables.query.id);
            }
        },
        ...options,
    });
};
