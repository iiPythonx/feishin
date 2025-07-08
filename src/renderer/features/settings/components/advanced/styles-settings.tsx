import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SettingsOptions } from '/@/renderer/features/settings/components/settings-option';
import { useCssSettings, useSettingsStoreActions } from '/@/renderer/store';
import { sanitizeCss } from '/@/renderer/utils/sanitize';
import { Button } from '/@/shared/components/button/button';
import { Code } from '/@/shared/components/code/code';
import { Divider } from '/@/shared/components/divider/divider';
import { Switch } from '/@/shared/components/switch/switch';
import { Text } from '/@/shared/components/text/text';
import { Textarea } from '/@/shared/components/textarea/textarea';

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
                                        onClick={handleSave}
                                        size="compact-md"
                                        // disabled={isSaveButtonDisabled}
                                        variant="filled"
                                    >
                                        {t('common.save', { postProcess: 'titleCase' })}
                                    </Button>
                                )}
                                <Button
                                    onClick={() => setOpen(!open)}
                                    size="compact-md"
                                    variant="filled"
                                >
                                    {t(open ? 'common.close' : 'common.edit', {
                                        postProcess: 'titleCase',
                                    })}
                                </Button>
                            </>
                        }
                        description={
                            'Insert the content of your custom CSS here. Sanitization is disabled, so anything can be placed in the input and will render.'
                        }
                        title={'Custom CSS'}
                    />
                    {open && (
                        <>
                            <Textarea
                                autosize
                                defaultValue={css}
                                minRows={8}
                                onBlur={(e) =>
                                    setCss(sanitizeCss(`<style>${e.currentTarget.value}`))
                                }
                            />
                        </>
                    )}
                </>
            )}
            <Divider />
        </>
    );
};
