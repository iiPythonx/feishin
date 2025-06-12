import styled from 'styled-components';

import { Playerbar } from '/@/renderer/features/player';
import { useGeneralSettings, useTweaksSettings } from '/@/renderer/store/settings.store';

interface PlayerbarContainerProps {
    $drawerEffect: boolean;
    $hovering: boolean
}

const PlayerbarContainer = styled.footer<PlayerbarContainerProps>`
    
overflow: hidden;
    ${(props) =>
        (props.$hovering &&
            `
                z-index: 200;
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);

                background: rgba(var(--playerbar-bg-rgb), 70%);
                backdrop-filter: blur(2rem);
                transition: background 0.5s;

                width: 90%;
                border-radius: 30px;
    `) ||
        `
            z-index: 200;
            grid-area: player;
            background: var(--playerbar-bg);
            transition: background 0.5s;
        `
    }

    ${(props) =>
        props.$drawerEffect &&
        `
      &:hover {
        background: var(--playerbar-bg-active);
      }
    `}
`;

export const PlayerBar = () => {
    const { playerbarOpenDrawer } = useGeneralSettings();
    const { floatingPlayer } = useTweaksSettings();

    return (
        <PlayerbarContainer
            $drawerEffect={playerbarOpenDrawer}
            $hovering={floatingPlayer}
            id="player-bar"
        >
            <Playerbar />
        </PlayerbarContainer>
    );
};
