import clsx from 'clsx';
import { ComponentPropsWithoutRef } from 'react';

import styles from './lyric-line.module.css';

import { Box } from '/@/shared/components/box/box';
import { Stack } from '/@/shared/components/stack/stack';

interface LyricLineProps extends ComponentPropsWithoutRef<'div'> {
    alignment: 'center' | 'left' | 'right';
    fontSize: number;
    text: string;
}

export const LyricLine = ({ alignment, className, fontSize, text, ...props }: LyricLineProps) => {
    const lines = text.split('_BREAK_');

    return (
        <Box
            className={clsx(styles.lyricLine, className)}
            style={{
                fontSize,
                textAlign: alignment,
            }}
            {...props}
        >
            <Stack gap={0}>
                {lines.map((line, index) => (
                    <span key={index}>{line}</span>
                ))}
            </Stack>
        </Box>
    );
};
