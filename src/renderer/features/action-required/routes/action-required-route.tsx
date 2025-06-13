import { Center, Group, Stack } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { useTranslation } from 'react-i18next';
import { RiEdit2Line, RiErrorWarningFill, RiRestartFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

import { Button, PageHeader, Text } from '/@/renderer/components';
import { ActionRequiredContainer } from '/@/renderer/features/action-required/components/action-required-container';
import { ServerCredentialRequired } from '/@/renderer/features/action-required/components/server-credential-required';
import { ServerRequired } from '/@/renderer/features/action-required/components/server-required';
import { ServerList } from '/@/renderer/features/servers';
import { AnimatedPage } from '/@/renderer/features/shared';
import { AppRoute } from '/@/renderer/router/routes';
import { useCurrentServer } from '/@/renderer/store';

const ActionRequiredRoute = () => {
    const { t } = useTranslation();
    const currentServer = useCurrentServer();
    const isServerRequired = !currentServer;
    const isCredentialRequired = currentServer && !currentServer.credential;

    const checks = [
        {
            component: <ServerCredentialRequired />,
            title: t('error.credentialsRequired', { postProcess: 'sentenceCase' }),
            valid: !isCredentialRequired,
        },
        {
            component: <ServerRequired />,
            title: t('error.serverRequired', { postProcess: 'serverRequired' }),
            valid: !isServerRequired,
        },
    ];

    const canReturnHome = checks.every((c) => c.valid);
    const displayedCheck = checks.find((c) => !c.valid);

    const handleManageServersModal = () => {
        openModal({
            children: <ServerList />,
            title: t('page.appMenu.manageServers', { postProcess: 'sentenceCase' }),
        });
    };

    return (
        <AnimatedPage>
            <PageHeader />
            <Center sx={{ height: '100%', width: '100vw' }}>
                <Stack
                    spacing="xl"
                    sx={{ maxWidth: '50%' }}
                >
                    <Group noWrap>
                        {displayedCheck && (
                            <ActionRequiredContainer title={displayedCheck.title}>
                                {displayedCheck?.component}
                            </ActionRequiredContainer>
                        )}
                    </Group>
                    <Stack mt="2rem">
                        {canReturnHome && (
                            <>
                                <Group
                                    noWrap
                                    position="center"
                                >
                                    <RiErrorWarningFill
                                        color="var(--warning-color)"
                                        size={50}
                                    />
                                    <Text size="xl">Cannot connect to server</Text>
                                </Group>
                                <Button
                                    component={Link}
                                    disabled={!canReturnHome}
                                    leftIcon={<RiRestartFill />}
                                    to={AppRoute.HOME}
                                    variant="filled"
                                >
                                    Try again
                                </Button>
                            </>
                        )}
                        {!displayedCheck && (
                            <Group
                                noWrap
                                position="center"
                            >
                                <Button
                                    fullWidth
                                    leftIcon={<RiEdit2Line />}
                                    onClick={handleManageServersModal}
                                    variant="filled"
                                >
                                    {"Edit servers"}
                                </Button>
                            </Group>
                        )}
                    </Stack>
                </Stack>
            </Center>
        </AnimatedPage>
    );
};

export default ActionRequiredRoute;
