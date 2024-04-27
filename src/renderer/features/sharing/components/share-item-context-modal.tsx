import { useState } from 'react';
import { Box, Divider, Group, Stack, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { closeModal, ContextModalProps } from '@mantine/modals';
import { Text, Button, Switch, toast } from '/@/renderer/components';
import { useSharingSettings, useSettingsStoreActions, useCurrentServer } from '/@/renderer/store';
import isEqual from 'lodash/isEqual';
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

    const shareItemMutation = useShareItem({});

    const server = useCurrentServer();
    if (!server) throw new Error('Server not found');

    // Uses the same default as Navidrome: 1 year
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() + 1);

    const form = useForm({
        initialValues: {
            allowDownloading: false,
            baseUrl: settings[server.url] || server.url,
            description: '',
            expires: defaultDate,
        },
        validate: {
            expires: (value) =>
                value > new Date()
                    ? null
                    : t('form.shareItem.expireInvalid', {
                          postProcess: 'sentenceCase',
                      }),
        },
    });

    const handleSubmit = form.onSubmit(async (values) => {
        shareItemMutation.mutate(
            {
                body: {
                    description: values.description,
                    downloadable: values.allowDownloading,
                    expires: values.expires.getTime(),
                    resourceIds: itemIds.join(),
                    resourceType,
                },
                serverId: server?.id,
            },
            {
                onError: () => {
                    toast.error({
                        message: t('form.shareItem.createFailed', {
                            postProcess: 'sentenceCase',
                        }),
                    });
                },
                onSuccess: (_data) => {
                    if (!server) throw new Error('Server not found');
                    if (!_data?.id) throw new Error('Failed to share item');

                    const shareUrl = `${values.baseUrl}/share/${_data.id}`;

                    navigator.clipboard.writeText(shareUrl);
                    toast.success({
                        autoClose: 5000,
                        id: 'share-item-toast',
                        message: t('form.shareItem.success', {
                            postProcess: 'sentenceCase',
                        }),
                        onClick: (a) => {
                            if (!(a.target instanceof HTMLElement)) return;

                            // Make sure we weren't clicking close (otherwise clicking close /also/ opens the url)
                            if (a.target.nodeName !== 'svg') {
                                window.open(shareUrl);
                                toast.hide('share-item-toast');
                            }
                        },
                    });
                },
            },
        );

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
                    <DateTimePicker
                        clearable
                        label={t('form.shareItem.setExpiration', {
                            postProcess: 'titleCase',
                        })}
                        minDate={new Date()}
                        placeholder={defaultDate.toLocaleDateString()}
                        popoverProps={{ withinPortal: true }}
                        valueFormat="MM/DD/YYYY HH:mm"
                        {...form.getInputProps('expires')}
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
