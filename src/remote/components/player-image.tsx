import styles from './player-image.module.css';

import { useSend } from '/@/remote/store';

interface PlayerImageProps {
    src?: null | string;
}
export const PlayerImage = ({ src }: PlayerImageProps) => {
    const send = useSend();

    return (
        <img
            className={styles.container}
            onError={() => send({ event: 'proxy' })}
            src={src?.replaceAll(/&(size|width|height)=\d+/g, '')}
        />
    );
};
