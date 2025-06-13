import { Box } from '@mantine/core';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { Paper, PaperProps, SpinnerIcon, TextTitle } from '/@/renderer/components';
import { PlayButton as PlayBtn } from '/@/renderer/features/shared/components/play-button';

interface LibraryHeaderBarProps {
    children: ReactNode;
}

const HeaderContainer = styled.div`
    display: flex;
    flex-wrap: nowrap;
    gap: 1rem;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0 1rem;
    backdrop-filter: blur(1rem);
`;

export const LibraryHeaderBar = ({ children }: LibraryHeaderBarProps) => {
    return <HeaderContainer>{children}</HeaderContainer>;
};

interface TitleProps {
    children: ReactNode;
}

const Title = ({ children }: TitleProps) => {
    return (
        <TextTitle
            order={1}
            overflow="hidden"
            weight={700}
        >
            {children}
        </TextTitle>
    );
};

interface PlayButtonProps {
    onClick: (args: any) => void;
}

const PlayButton = ({ onClick }: PlayButtonProps) => {
    return (
        <Box>
            <PlayBtn
                h="45px"
                onClick={onClick}
                w="45px"
            />
        </Box>
    );
};

const Badge = styled(Paper)`
    padding: 0.3rem 1rem;
    font-weight: 600;
    border-radius: 0.3rem;
`;

interface HeaderBadgeProps extends PaperProps {
    isLoading?: boolean;
}

const HeaderBadge = ({ children, isLoading, ...props }: HeaderBadgeProps) => {
    return <Badge {...props}>{isLoading ? <SpinnerIcon /> : children}</Badge>;
};

LibraryHeaderBar.Title = Title;
LibraryHeaderBar.PlayButton = PlayButton;
LibraryHeaderBar.Badge = HeaderBadge;
