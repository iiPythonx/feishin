import clsx from 'clsx';
import isElectron from 'is-electron';
import { useState } from 'react';
import { RiCheckboxBlankLine, RiCloseLine, RiSubtractLine } from 'react-icons/ri';

import styles from './window-controls.module.css';

const browser = isElectron() ? window.api.browser : null;

const close = () => browser?.exit();

const minimize = () => browser?.minimize();

const maximize = () => browser?.maximize();

const unmaximize = () => browser?.unmaximize();

export const WindowControls = () => {
    const [max, setMax] = useState(false);

    const handleMinimize = () => minimize();

    const handleMaximize = () => {
        if (max) {
            unmaximize();
        } else {
            maximize();
        }
        setMax(!max);
    };

    const handleClose = () => close();

    return (
        <>
            {isElectron() && (
                <>
                    <div className={styles.windowsButtonGroup}>
                        <div
                            className={styles.windowsButton}
                            onClick={handleMinimize}
                            role="button"
                        >
                            <RiSubtractLine size={19} />
                        </div>
                        <div
                            className={styles.windowsButton}
                            onClick={handleMaximize}
                            role="button"
                        >
                            <RiCheckboxBlankLine size={13} />
                        </div>
                        <div
                            className={clsx(styles.windowsButton, styles.exitButton)}
                            onClick={handleClose}
                            role="button"
                        >
                            <RiCloseLine size={19} />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
