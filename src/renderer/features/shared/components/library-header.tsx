import { Center, Group } from '@mantine/core';
import { closeAllModals, openModal } from '@mantine/modals';
import { AutoTextSize } from 'auto-text-size';
import clsx from 'clsx';
import { forwardRef, ReactNode, Ref, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import styles from './library-header.module.css';

import { Text } from '/@/renderer/components';
import { ItemImagePlaceholder } from '/@/renderer/features/shared/components/item-image-placeholder';
import { useTweaksSettings } from '/@/renderer/store';
import { LibraryItem } from '/@/shared/types/domain-types';

interface LibraryHeaderProps {
    background: string;
    blur?: number;
    children?: ReactNode;
    imagePlaceholderUrl?: null | string;
    imageUrl?: null | string;
    item: { route: string; type: LibraryItem };
    title: string;
}

export const LibraryHeader = forwardRef(
    (
        { background, blur, children, imageUrl, item, title }: LibraryHeaderProps,
        ref: Ref<HTMLDivElement>,
    ) => {
        const { t } = useTranslation();
        const [isImageError, setIsImageError] = useState<boolean | null>(false);
        const { albumBackground } = useTweaksSettings();

        const onImageError = () => {
            setIsImageError(true);
        };

        const itemTypeString = () => {
            switch (item.type) {
                case LibraryItem.ALBUM:
                    return t('entity.album', { count: 1 });
                case LibraryItem.ALBUM_ARTIST:
                    return t('entity.albumArtist', { count: 1 });
                case LibraryItem.ARTIST:
                    return t('entity.artist', { count: 1 });
                case LibraryItem.PLAYLIST:
                    return t('entity.playlist', { count: 1 });
                case LibraryItem.SONG:
                    return t('entity.track', { count: 1 });
                default:
                    return t('common.unknown');
            }
        };

        const openImage = useCallback(() => {
            if (imageUrl && !isImageError) {
                const fullSized = imageUrl.replace(/&?(size|width|height)=\d+/, '');

                openModal({
                    children: (
                        <Center
                            onClick={() => closeAllModals()}
                            style={{
                                cursor: 'pointer',
                                height: 'calc(100vh - 80px)',
                                width: '100%',
                            }}
                        >
                            <img
                                alt="cover"
                                src={fullSized}
                                style={{
                                    maxHeight: '100%',
                                    maxWidth: '100%',
                                }}
                            />
                        </Center>
                    ),
                    fullScreen: true,
                });
            }
        }, [imageUrl, isImageError]);

        return (
            <div
                className={styles.libraryHeader}
                ref={ref}
            >
                <div
                    className={styles.background}
                    style={{ background, filter: `blur(${blur ?? 0}rem)` }}
                />
                <div
                    className={clsx(styles.backgroundOverlay, {
                        [styles.opaqueOverlay]: albumBackground,
                    })}
                />
                <div
                    className={styles.imageSection}
                    onClick={() => openImage()}
                    onKeyDown={(event) =>
                        [' ', 'Enter', 'Spacebar'].includes(event.key) && openImage()
                    }
                    role="button"
                    style={{ cursor: 'pointer' }}
                    tabIndex={0}
                >
                    {imageUrl && !isImageError ? (
                        <img
                            alt="cover"
                            className={styles.image}
                            onError={onImageError}
                            // placeholder={imagePlaceholderUrl || 'var(--placeholder-bg)'}
                            src={imageUrl}
                            style={{ height: '' }}
                        />
                    ) : (
                        <ItemImagePlaceholder itemType={item.type} />
                    )}
                </div>
                <div className={styles.metadataSection}>
                    <Group>
                        <h2>
                            <Text
                                $link
                                component={Link}
                                to={item.route}
                                tt="uppercase"
                                weight={600}
                            >
                                {itemTypeString()}
                            </Text>
                        </h2>
                    </Group>
                    <h1 className={styles.title}>
                        <AutoTextSize mode="box">{title}</AutoTextSize>
                    </h1>
                    {children}
                </div>
            </div>
        );
    },
);
