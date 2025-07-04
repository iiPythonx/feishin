import { useTranslation } from 'react-i18next';

import { Select, SelectProps } from '/@/shared/components/select/select';

export interface YesNoSelectProps extends Omit<SelectProps, 'data' | 'onChange' | 'value'> {
    onChange: (e?: boolean) => void;
    value?: boolean;
}

export const YesNoSelect = ({ onChange, value, ...props }: YesNoSelectProps) => {
    const { t } = useTranslation();

    return (
        <Select
            clearable
            data={[
                {
                    label: t('common.no', { postProcess: 'sentenceCase' }),
                    value: 'false',
                },
                {
                    label: t('common.yes', { postProcess: 'sentenceCase' }),
                    value: 'true',
                },
            ]}
            onChange={(e) => {
                onChange(e ? e === 'true' : undefined);
            }}
            value={value !== undefined ? value.toString() : null}
            {...props}
        />
    );
};
