import { memo } from 'react';

import {
    ArtistReleaseTypeSettings,
    ArtistSettings,
} from '/@/renderer/features/settings/components/pages/artist-settings';
import { FullscreenPlayerSettings } from '/@/renderer/features/settings/components/pages/fullscreen-player-settings';
import { HomeSettings } from '/@/renderer/features/settings/components/pages/home-settings';
import { SettingsSection } from '/@/renderer/features/settings/components/settings-section';

export const PageSettings = memo(() => {
    return (
        <SettingsSection
            extra={
                <>
                    <HomeSettings />
                    <ArtistSettings />
                    <ArtistReleaseTypeSettings />
                    <FullscreenPlayerSettings />
                </>
            }
            options={[]}
            title={'Pages'}
        />
    );
});
