import { useState } from 'react';
import { Box, Divider, Group, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSharingSettings, useSettingsStoreActions, useCurrentServer } from '/@/renderer/store';
import { closeModal, ContextModalProps } from '@mantine/modals';
import isEqual from 'lodash/isEqual';
import { Text, Button, Switch, toast } from '/@/renderer/components';
import { useTranslation } from 'react-i18next';
import { useShareItem } from '../mutations/share-item-mutation';

export const ShareItemContextModal = ({
    id,
    innerProps,
}: ContextModalProps<{
    itemIds: string[];
    resourceType: string;
}>) => {
    const { t } = useTranslation();
    const { itemIds, resourceType } = innerProps;
    const [open, setOpen] = useState(false);
    const settings = useSharingSettings();
    const { setSettings } = useSettingsStoreActions();

    const server = useCurrentServer();
    if (!server) throw new Error('Server not found');

    const shareItemMutation = useShareItem({});

    const form = useForm({
        initialValues: {
            allowDownloading: false,
            baseUrl: settings[server.url] || server.url,
            description: '',
        },
    });

    const handleSubmit = form.onSubmit(async (values) => {
        shareItemMutation.mutate({
            baseUrl: values.baseUrl,
            body: {
                description: values.description,
                downloadable: values.allowDownloading,
                resourceIds: itemIds.join(),
                resourceType,
            },
            serverId: server?.id,
        });

        toast.success({
            message: t('form.shareItem.success', {
                postProcess: 'sentenceCase',
            }),
        });
        closeModal(id);
        return null;
    });

    const handleSave = () => {
        settings[server.url] = form.values.baseUrl;
        setSettings({ sharing: settings });
    };

    const isSaveButtonDisabled = isEqual(form.values.baseUrl, settings[server.url]);

    return (
        <Box p="1rem">
            <form onSubmit={handleSubmit}>
                <Stack>
                    <TextInput
                        label={t('form.shareItem.description', {
                            postProcess: 'titleCase',
                        })}
                        {...form.getInputProps('description')}
                    />
                    <Switch
                        defaultChecked={false}
                        label={t('form.shareItem.allowDownloading', {
                            postProcess: 'titleCase',
                        })}
                        {...form.getInputProps('allowDownloading')}
                    />
                    <Divider />
                    <Group
                        noWrap
                        position="apart"
                        sx={{ alignItems: 'center' }}
                    >
                        <Stack
                            spacing="xs"
                            sx={{
                                alignSelf: 'flex-start',
                                display: 'flex',
                                maxWidth: '50%',
                            }}
                        >
                            <Group>
                                <Text
                                    $noSelect
                                    size="md"
                                >
                                    Advanced settings
                                </Text>
                            </Group>
                        </Stack>
                        <Group position="right">
                            {open && (
                                <Button
                                    compact
                                    disabled={isSaveButtonDisabled}
                                    variant="filled"
                                    onClick={handleSave}
                                >
                                    {t('common.save', { postProcess: 'titleCase' })}
                                </Button>
                            )}
                            <Button
                                compact
                                variant="filled"
                                onClick={() => setOpen(!open)}
                            >
                                {t(open ? 'common.close' : 'common.edit', {
                                    postProcess: 'titleCase',
                                })}
                            </Button>
                        </Group>
                    </Group>
                    {open && (
                        <TextInput
                            label="Navidrome Base URL (server specific)"
                            {...form.getInputProps('baseUrl')}
                        />
                    )}
                    <Divider />
                    <Group position="right">
                        <Group>
                            <Button
                                size="md"
                                variant="subtle"
                                onClick={() => closeModal(id)}
                            >
                                {t('common.cancel', { postProcess: 'titleCase' })}
                            </Button>
                            <Button
                                size="md"
                                type="submit"
                                variant="filled"
                            >
                                {t('common.share', { postProcess: 'titleCase' })}
                            </Button>
                        </Group>
                    </Group>
                </Stack>
            </form>
        </Box>
    );
};
