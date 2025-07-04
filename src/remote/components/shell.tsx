import { AppShell, Flex, Grid, Image } from '@mantine/core';

import { ImageButton } from '/@/remote/components/buttons/image-button';
import { ReconnectButton } from '/@/remote/components/buttons/reconnect-button';
import { ThemeButton } from '/@/remote/components/buttons/theme-button';
import { RemoteContainer } from '/@/remote/components/remote-container';
import { useConnected } from '/@/remote/store';
import { Center } from '/@/shared/components/center/center';
import { Group } from '/@/shared/components/group/group';
import { Spinner } from '/@/shared/components/spinner/spinner';

export const Shell = () => {
    const connected = useConnected();

    return (
        <AppShell
            h="100vh"
            padding="md"
            w="100vw"
        >
            <AppShell.Header style={{ background: 'var(--theme-colors-surface)' }}>
                <Grid
                    px="md"
                    py="sm"
                >
                    <Grid.Col span={4}>
                        <Flex
                            align="center"
                            direction="row"
                            h="100%"
                            justify="flex-start"
                            style={{
                                justifySelf: 'flex-start',
                            }}
                        >
                            <Image
                                fit="contain"
                                height={32}
                                src="/favicon.ico"
                                width={32}
                            />
                        </Flex>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <Group
                            gap="sm"
                            justify="flex-end"
                            wrap="nowrap"
                        >
                            <ReconnectButton />
                            <ImageButton />
                            <ThemeButton />
                        </Group>
                    </Grid.Col>
                </Grid>
            </AppShell.Header>
            <AppShell.Main pt="60px">
                {connected ? (
                    <RemoteContainer />
                ) : (
                    <Center
                        h="100vh"
                        w="100vw"
                    >
                        <Spinner />
                    </Center>
                )}
            </AppShell.Main>
        </AppShell>
    );
};
