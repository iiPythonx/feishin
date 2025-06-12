import { Code, Divider } from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Switch, Text, Textarea } from '/@/renderer/components';
import { SettingsOptions } from '/@/renderer/features/settings/components/settings-option';
import { useCssSettings, useSettingsStoreActions } from '/@/renderer/store';
import { sanitizeCss } from '/@/renderer/utils/sanitize';

export const StylesSettings = () => {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    const { content, enabled } = useCssSettings();
    const [css, setCss] = useState(content);

    const { setSettings } = useSettingsStoreActions();

    const handleSave = () => {
        setSettings({
            css: {
                content: css,
                enabled,
            },
        });
    };

    return (
        <>
            <SettingsOptions
                control={
                    <Switch
                        checked={enabled}
                        onChange={(e) => {
                            setSettings({
                                css: {
                                    content,
                                    enabled: e.currentTarget.checked,
                                },
                            });
                        }}
                    />
                }
                description={t('setting.customCssEnable', {
                    context: 'description',
                    postProcess: 'sentenceCase',
                })}
                title={t('setting.customCssEnable', { postProcess: 'sentenceCase' })}
            />
            {enabled && (
                <>
                    <SettingsOptions
                        control={
                            <>
                                {open && (
                                    <Button
                                        compact
                                        onClick={handleSave}
                                        // disabled={isSaveButtonDisabled}
                                        variant="filled"
                                    >
                                        {t('common.save', { postProcess: 'titleCase' })}
                                    </Button>
                                )}
                                <Button
                                    compact
                                    onClick={() => setOpen(!open)}
                                    variant="filled"
                                >
                                    {t(open ? 'common.close' : 'common.edit', {
                                        postProcess: 'titleCase',
                                    })}
                                </Button>
                            </>
                        }
                        description={'Insert the content of your custom CSS here. Sanitization is disabled, so anything can be placed in the input and will render.'}
                        title={'Custom CSS'}
                    />
                    {open && (
                        <>
                            <Textarea
                                autosize
                                defaultValue={css}
                                onBlur={(e) =>
                                    setCss(sanitizeCss(`<style>${e.currentTarget.value}`))
                                }
                            />
                            <Text>{t('common.preview', { postProcess: 'sentenceCase' })}: </Text>
                            <Code block>{css}</Code>
                        </>
                    )}
                </>
            )}
            <Divider />
        </>
    );
};
