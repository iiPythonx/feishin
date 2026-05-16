import clsx from 'clsx';
import { lazy, Suspense } from 'react';

import styles from './playerbar.module.css';

import { CenterControls } from '/@/renderer/features/player/components/center-controls';
import { LeftControls } from '/@/renderer/features/player/components/left-controls';
import { RightControls } from '/@/renderer/features/player/components/right-controls';
import { useIsMobile } from '/@/renderer/hooks/use-is-mobile';
import { Spinner } from '/@/shared/components/spinner/spinner';

const MobilePlayerbar = lazy(() =>
    import('./mobile-playerbar').then((module) => ({
        default: module.MobilePlayerbar,
    })),
);
import { PlaybackSelectors } from '/@/shared/constants/playback-selectors';

export const Playerbar = () => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Suspense fallback={<Spinner />}>
                <MobilePlayerbar />
            </Suspense>
        );
    }

    return (
        <div className={clsx(styles.container, PlaybackSelectors.mediaPlayer)}>
            <div className={styles.controlsGrid}>
                <div className={styles.leftGridItem}>
                    <LeftControls />
                </div>
                <div className={styles.centerGridItem}>
                    <CenterControls />
                </div>
                <div className={styles.rightGridItem}>
                    <RightControls />
                </div>
            </div>
        </div>
    );
};
