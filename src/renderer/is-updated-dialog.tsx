import { Group, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useCallback } from 'react';
import { RiExternalLinkLine } from 'react-icons/ri';

import packageJson from '../../package.json';
import { Button, Dialog, Text } from './components';

export function IsUpdatedDialog() {
    const { version } = packageJson;

    const [value, setValue] = useLocalStorage({ key: 'version' });

    const handleDismiss = useCallback(() => {
        setValue(version);
    }, [setValue, version]);

    return (
        <Dialog
            opened={value !== version}
            position={{ bottom: '5rem', right: '1rem' }}
            styles={{
                root: {
                    marginBottom: '50px',
                    right: '1rem',
                },
            }}
        >
            <Stack
                style={{
                    borderRadius: "18px"
                }}>
                <Text>A new version of Feishin has been installed ({version})</Text>
                <Group noWrap>
                    <Button
                        component="a"
                        href={`https://github.com/jeffvli/feishin/releases/tag/v${version}`}
                        onClick={handleDismiss}
                        rightIcon={<RiExternalLinkLine />}
                        target="_blank"
                        variant="filled"
                    >
                        View release notes
                    </Button>
                    <Button
                        onClick={handleDismiss}
                        variant="default"
                    >
                        Dismiss
                    </Button>
                </Group>
            </Stack>
        </Dialog>
    );
}
