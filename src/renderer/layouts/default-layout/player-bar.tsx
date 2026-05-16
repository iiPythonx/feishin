import clsx from 'clsx';

import styles from './player-bar.module.css';

import { Playerbar } from '/@/renderer/features/player/components/playerbar';

export const PlayerBar = () => {
    return (
        <div className={clsx(styles.container, styles.openDrawer)} id="player-bar">
            <Playerbar />
        </div>
    );
};
