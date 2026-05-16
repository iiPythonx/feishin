import type { SettingsState } from '/@/renderer/store/settings.store';

export const getMpvSetting = (
    key: keyof SettingsState['playback']['mpvProperties'],
    value: any,
) => {
    switch (key) {
        case 'audioExclusiveMode':
            return { 'audio-exclusive': value || 'no' };
        case 'audioSampleRateHz':
            return { 'audio-samplerate': value };
        case 'replayGainClip':
            return { 'replaygain-clip': value || 'no' };
        case 'replayGainFallbackDB':
            return { 'replaygain-fallback': value };
        case 'replayGainMode':
            return { replaygain: value || 'no' };
        case 'replayGainPreampDB':
            return { 'replaygain-preamp': value || 0 };
        default:
            return { 'audio-format': value };
    }
};

export const getMpvProperties = (settings: SettingsState['playback']['mpvProperties']) => {
    const properties: Record<string, any> = {
        'audio-exclusive': settings.audioExclusiveMode || 'no',
        'audio-samplerate':
            settings.audioSampleRateHz === 0 ? undefined : settings.audioSampleRateHz,
        replaygain: settings.replayGainMode || 'no',
        'replaygain-clip': settings.replayGainClip || 'no',
        'replaygain-fallback': settings.replayGainFallbackDB,
        'replaygain-preamp': settings.replayGainPreampDB || 0,
    };

    Object.keys(properties).forEach((key) =>
        properties[key] === undefined ? delete properties[key] : {},
    );

    return properties;
};
