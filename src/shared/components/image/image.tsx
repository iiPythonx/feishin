import clsx from 'clsx';
import { motion, MotionConfigProps } from 'motion/react';
import { type ImgHTMLAttributes } from 'react';
import { Img } from 'react-image';

import styles from './image.module.css';

import { animationProps } from '/@/shared/components/animations/animation-props';
import { Icon } from '/@/shared/components/icon/icon';
import { Skeleton } from '/@/shared/components/skeleton/skeleton';

interface ImageContainerProps extends MotionConfigProps {
    children: React.ReactNode;
    className?: string;
    enableAnimation?: boolean;
}

interface ImageLoaderProps {
    className?: string;
}

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    containerClassName?: string;
    enableAnimation?: boolean;
    imageContainerProps?: Omit<ImageContainerProps, 'children'>;
    includeLoader?: boolean;
    includeUnloader?: boolean;
    src: string | string[] | undefined;
    thumbHash?: string;
}

interface ImageUnloaderProps {
    className?: string;
}

export function Image({
    className,
    containerClassName,
    enableAnimation,
    imageContainerProps,
    includeLoader = true,
    includeUnloader = true,
    src,
}: ImageProps) {
    if (src) {
        return (
            <Img
                className={clsx(styles.image, className)}
                container={(children) => (
                    <ImageContainer
                        className={containerClassName}
                        enableAnimation={enableAnimation}
                        {...imageContainerProps}
                    >
                        {children}
                    </ImageContainer>
                )}
                loader={
                    includeLoader ? (
                        <ImageContainer className={containerClassName}>
                            <ImageLoader className={className} />
                        </ImageContainer>
                    ) : null
                }
                src={src}
                unloader={
                    includeUnloader ? (
                        <ImageContainer className={containerClassName}>
                            <ImageUnloader className={className} />
                        </ImageContainer>
                    ) : null
                }
            />
        );
    }

    return <ImageUnloader />;
}

function ImageContainer({ children, className, enableAnimation, ...props }: ImageContainerProps) {
    if (!enableAnimation) {
        return (
            <div
                className={clsx(styles.imageContainer, className)}
                {...props}
            >
                {children}
            </div>
        );
    }

    return (
        <motion.div
            className={clsx(styles.imageContainer, className)}
            {...animationProps.fadeIn}
            {...props}
        >
            {children}
        </motion.div>
    );
}

function ImageLoader({ className }: ImageLoaderProps) {
    return (
        <div className={clsx(styles.loader, className)}>
            <Skeleton
                className={clsx(styles.skeleton, className)}
                enableAnimation={true}
            />
        </div>
    );
}

function ImageUnloader({ className }: ImageUnloaderProps) {
    return (
        <div className={clsx(styles.unloader, className)}>
            <Icon
                icon="emptyImage"
                size="xl"
            />
        </div>
    );
}
