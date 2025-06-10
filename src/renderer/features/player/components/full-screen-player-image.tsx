import { Center, Flex, Group, Stack } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { AnimatePresence, HTMLMotionProps, motion, Variants } from 'framer-motion';
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RiAlbumFill } from 'react-icons/ri';
import { generatePath } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Badge, Text, TextTitle } from '/@/renderer/components';
import { useFastAverageColor } from '/@/renderer/hooks';
import { AppRoute } from '/@/renderer/router/routes';
import { useFullScreenPlayerStore, usePlayerData, usePlayerStore } from '/@/renderer/store';
import { useSettingsStore } from '/@/renderer/store/settings.store';
import { PlayerData, QueueSong } from '/@/shared/types/domain-types';

const Image = styled(motion.img)<any>`
    position: absolute;
    max-width: 100%;
    height: 100%;
    object-fit: ${({ $useAspectRatio }) => ($useAspectRatio ? 'contain' : 'cover')};
    object-position: 50% 100%;
    border-radius: 16px;
    z-index: 1;
`;

const BlurImage = styled(motion.img)<any>`
    position: absolute;
    max-width: 110%;
    height: 110%;
    width: 110%;
    object-fit: ${({ $useAspectRatio }) => ($useAspectRatio ? 'contain' : 'cover')};
    object-position: 50% 100%;
    border-radius: 16px;
    z-index: 0;
    top: -5%;
    filter: blur(2rem);
`;

const ImageContainer = styled(motion.div)`
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    max-width: 100%;
    height: 65%;
    aspect-ratio: 1/1;
    margin-bottom: 1rem;
`;

interface TransparentMetadataContainer {
    opacity?: number;
}

const MetadataContainer = styled(Stack)<TransparentMetadataContainer>`
    padding: 1rem;
    border-radius: 5px;

    h1 {
        font-size: 3.5vh;
    }
`;

const PlayerContainer = styled(Flex)`
    @media screen and (height <= 640px) {
        .full-screen-player-image-metadata {
            display: none;
            height: 100%;
            margin-bottom: 0;
        }

        ${ImageContainer} {
            height: 100%;
            margin-bottom: 0;
        }
    }
`;

const imageVariants: Variants = {
    closed: {
        opacity: 0,
        transition: {
            duration: 0.8,
            ease: 'linear',
        },
    },
    initial: {
        opacity: 0,
    },
    open: (custom) => {
        const { isOpen } = custom;
        return {
            opacity: isOpen ? 1 : 0,
            transition: {
                duration: 0.4,
                ease: 'linear',
            },
        };
    },
};

const scaleImageUrl = (imageSize: number, url?: null | string) => {
    return url
        ?.replace(/&size=\d+/, `&size=${imageSize}`)
        .replace(/\?width=\d+/, `?width=${imageSize}`)
        .replace(/&height=\d+/, `&height=${imageSize}`);
};

const ImageWithPlaceholder = ({
    useAspectRatio,
    ...props
}: HTMLMotionProps<'img'> & { placeholder?: string; useAspectRatio: boolean }) => {
    if (!props.src) {
        return (
            <Center
                sx={{
                    background: 'var(--placeholder-bg)',
                    borderRadius: 'var(--card-default-radius)',
                    height: '100%',
                    width: '100%',
                }}
            >
                <RiAlbumFill
                    color="var(--placeholder-fg)"
                    size="25%"
                />
            </Center>
        );
    }

    return (
        <Image
            $useAspectRatio={useAspectRatio}
            {...props}
        />
    );
};

export const FullScreenPlayerImage = () => {
    const mainImageRef = useRef<HTMLImageElement | null>(null);
    const [mainImageDimensions, setMainImageDimensions] = useState({ idealSize: 1 });

    const albumArtRes = useSettingsStore((store) => store.general.albumArtRes);

    const { queue } = usePlayerData();
    const { useImageAspectRatio } = useFullScreenPlayerStore();
    const currentSong = queue.current;
    const { color: background } = useFastAverageColor({
        algorithm: 'dominant',
        src: queue.current?.imageUrl,
        srcLoaded: true,
    });
    const imageKey = `image-${background}`;
    const [imageState, setImageState] = useSetState({
        bottomImage: scaleImageUrl(mainImageDimensions.idealSize, queue.next?.imageUrl),
        current: 0,
        topImage: scaleImageUrl(mainImageDimensions.idealSize, queue.current?.imageUrl),
    });

    const updateImageSize = useCallback(() => {
        if (mainImageRef.current) {
            setMainImageDimensions({
                idealSize:
                    albumArtRes ||
                    Math.ceil((mainImageRef.current as HTMLDivElement).offsetHeight / 100) * 100,
            });

            setImageState({
                bottomImage: scaleImageUrl(mainImageDimensions.idealSize, queue.next?.imageUrl),
                current: 0,
                topImage: scaleImageUrl(mainImageDimensions.idealSize, queue.current?.imageUrl),
            });
        }
    }, [mainImageDimensions.idealSize, queue, setImageState, albumArtRes]);

    useLayoutEffect(() => {
        updateImageSize();
    }, [updateImageSize]);

    useEffect(() => {
        const unsubSongChange = usePlayerStore.subscribe(
            (state) => [state.current.song, state.actions.getPlayerData().queue],
            (state) => {
                const isTop = imageState.current === 0;
                const queue = state[1] as PlayerData['queue'];

                const currentImageUrl = scaleImageUrl(
                    mainImageDimensions.idealSize,
                    queue.current?.imageUrl,
                );
                const nextImageUrl = scaleImageUrl(
                    mainImageDimensions.idealSize,
                    queue.next?.imageUrl,
                );

                setImageState({
                    bottomImage: isTop ? currentImageUrl : nextImageUrl,
                    current: isTop ? 1 : 0,
                    topImage: isTop ? nextImageUrl : currentImageUrl,
                });
            },
            { equalityFn: (a, b) => (a[0] as QueueSong)?.id === (b[0] as QueueSong)?.id },
        );

        return () => {
            unsubSongChange();
        };
    }, [imageState, mainImageDimensions.idealSize, queue, setImageState]);

    return (
        <PlayerContainer
            align="center"
            className="full-screen-player-image-container"
            direction="column"
            justify="flex-start"
            p="1rem"
        >
            <ImageContainer ref={mainImageRef}>
                <AnimatePresence
                    initial={false}
                    mode="sync"
                >
                    {imageState.current === 0 && (
                        <ImageWithPlaceholder
                            animate="open"
                            className="full-screen-player-image"
                            custom={{ isOpen: imageState.current === 0 }}
                            draggable={false}
                            exit="closed"
                            initial="closed"
                            key={imageKey}
                            placeholder="var(--placeholder-bg)"
                            src={imageState.topImage || ''}
                            useAspectRatio={useImageAspectRatio}
                            variants={imageVariants}
                        />
                    )}

                    {imageState.current === 1 && (
                        <ImageWithPlaceholder
                            animate="open"
                            className="full-screen-player-image"
                            custom={{ isOpen: imageState.current === 1 }}
                            draggable={false}
                            exit="closed"
                            initial="closed"
                            key={imageKey}
                            placeholder="var(--placeholder-bg)"
                            src={imageState.bottomImage || ''}
                            useAspectRatio={useImageAspectRatio}
                            variants={imageVariants}
                        />
                    )}

                    <BlurImage
                        $useAspectRatio={useImageAspectRatio}
                        aria-hidden
                        src={imageState.topImage}
                    />
                </AnimatePresence>
            </ImageContainer>
            <MetadataContainer
                className="full-screen-player-image-metadata"
                maw="100%"
                spacing="xs"
            >
                <TextTitle
                    align="center"
                    order={1}
                    overflow="hidden"
                    w="100%"
                    weight={900}
                >
                    {currentSong?.name}
                </TextTitle>
                <TextTitle
                    $link
                    align="center"
                    component={Link}
                    order={3}
                    overflow="hidden"
                    to={generatePath(AppRoute.LIBRARY_ALBUMS_DETAIL, {
                        albumId: currentSong?.albumId || '',
                    })}
                    w="100%"
                    weight={600}
                >
                    {currentSong?.album}{' '}
                </TextTitle>
                <TextTitle
                    align="center"
                    key="fs-artists"
                    order={3}
                >
                    {currentSong?.artists?.map((artist, index) => (
                        <Fragment key={`fs-artist-${artist.id}`}>
                            {index > 0 && (
                                <Text
                                    $secondary
                                    sx={{
                                        display: 'inline-block',
                                        padding: '0 0.5rem',
                                    }}
                                >
                                    •
                                </Text>
                            )}
                            <Text
                                $link
                                $secondary
                                component={Link}
                                to={generatePath(AppRoute.LIBRARY_ALBUM_ARTISTS_DETAIL, {
                                    albumArtistId: artist.id,
                                })}
                                weight={600}
                            >
                                {artist.name}
                            </Text>
                        </Fragment>
                    ))}
                </TextTitle>
                <Group
                    mt="sm"
                    position="center"
                >
                    {currentSong?.container && (
                        <Badge size="lg">
                            {currentSong?.container.replaceAll('audio/', '')} {currentSong?.bitRate}
                        </Badge>
                    )}
                    {currentSong?.releaseYear && (
                        <Badge size="lg">YEAR {currentSong?.releaseYear}</Badge>
                    )}
                </Group>
            </MetadataContainer>
        </PlayerContainer>
    );
};
