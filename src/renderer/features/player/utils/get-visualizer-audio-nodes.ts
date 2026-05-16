import type { WebAudio } from '/@/shared/types/types';

export function getVisualizerAudioNodes(webAudio: undefined | WebAudio): AudioNode[] {
    return webAudio ? webAudio.gains : [];
}
