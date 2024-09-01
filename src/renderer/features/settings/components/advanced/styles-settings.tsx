import { useState } from 'react';
import { Button, Switch, Textarea } from '/@/renderer/components';
import { sanitizeCss } from '/@/renderer/utils/sanitize';
import { SettingsOptions } from '/@/renderer/features/settings/components/settings-option';
import { useTranslation } from 'react-i18next';
import { useCssSettings, useSettingsStoreActions } from '/@/renderer/store';

export const StylesSettings = () => {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    const { enabled, content } = useCssSettings();
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
                })}
                title={t('setting.customCssEnable')}
            />
            {enabled && (
                <>
                    <SettingsOptions
                        control={
                            <>
                                {open && (
                                    <Button
                                        compact
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
                            </>
                        }
                        description={t('setting.customCss', {
                            context: 'description',
                        })}
                        title={t('setting.customCss')}
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
                        </>
                    )}
                </>
            )}
        </>
    );
};
