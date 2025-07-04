import clsx from 'clsx';

import styles from './play-button.module.css';

import { ActionIcon, ActionIconProps } from '/@/shared/components/action-icon/action-icon';

export interface PlayButtonProps extends ActionIconProps {
    size?: number | string;
}

export const PlayButton = ({ className, ...props }: PlayButtonProps) => {
    return (
        <ActionIcon
            className={clsx(styles.button, className)}
            icon="mediaPlay"
            iconProps={{
                size: 'xl',
            }}
            variant="filled"
            {...props}
        />
    );
};
