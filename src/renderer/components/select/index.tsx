import type {
    MultiSelectProps as MantineMultiSelectProps,
    SelectProps as MantineSelectProps,
} from '@mantine/core';

import { MultiSelect as MantineMultiSelect, Select as MantineSelect } from '@mantine/core';
import styled from 'styled-components';

export interface MultiSelectProps extends MantineMultiSelectProps {
    maxWidth?: number | string;
    width?: number | string;
}

export interface SelectProps extends MantineSelectProps {
    maxWidth?: number | string;
    width?: number | string;
}

const StyledSelect = styled(MantineSelect)`
    & [data-selected='true'] {
        background: var(--input-bg);
    }

    & [data-disabled='true'] {
        background: var(--input-bg);
        opacity: 0.6;
    }

    & .mantine-Select-label {
        margin-bottom: 0.5rem;
        font-family: var(--label-font-family);
    }

    & .mantine-Select-itemsWrapper {
        & .mantine-Select-item {
            padding: 40px;
        }
    }
`;

export const Select = ({ maxWidth, width, ...props }: SelectProps) => {
    return (
        <StyledSelect
            styles={{
                dropdown: {
                    background: 'rgba(32, 32, 32, 95%);',
                    borderRadius: '6px',
                    filter: 'drop-shadow(0 0 5px rgb(0, 0, 0, 20%))',
                },
                input: {
                    background: 'var(--input-bg)',
                    color: 'var(--input-fg)',
                },
                item: {
                    '&:hover': {
                        background: 'var(--dropdown-menu-bg-hover)',
                    },
                    '&[data-hovered]': {
                        background: 'var(--dropdown-menu-bg-hover)',
                    },
                    '&[data-selected="true"]': {
                        '&:hover': {
                            background: 'var(--dropdown-menu-bg-hover)',
                        },
                        background: 'none',
                        color: 'var(--primary-color)',
                    },
                    borderRadius: '6px',
                    color: 'var(--dropdown-menu-fg)',
                    padding: '.3rem',
                },
            }}
            sx={{ maxWidth, width }}
            transitionProps={{ duration: 100, transition: 'fade' }}
            withinPortal
            {...props}
        />
    );
};

const StyledMultiSelect = styled(MantineMultiSelect)`
    & [data-selected='true'] {
        background: var(--input-select-bg);
    }

    & [data-disabled='true'] {
        background: var(--input-bg);
        opacity: 0.6;
    }

    & .mantine-MultiSelect-itemsWrapper {
        & .mantine-Select-item {
            padding: 40px;
        }
    }
`;

export const MultiSelect = ({ maxWidth, width, ...props }: MultiSelectProps) => {
    return (
        <StyledMultiSelect
            styles={{
                dropdown: {
                    background: 'var(--dropdown-menu-bg)',
                    filter: 'drop-shadow(0 0 5px rgb(0, 0, 0, 20%))',
                },
                input: {
                    background: 'var(--input-bg)',
                    color: 'var(--input-fg)',
                },
                item: {
                    '&:hover': {
                        background: 'var(--dropdown-menu-bg-hover)',
                    },
                    '&[data-hovered]': {
                        background: 'var(--dropdown-menu-bg-hover)',
                    },
                    '&[data-selected="true"]': {
                        '&:hover': {
                            background: 'var(--dropdown-menu-bg-hover)',
                        },
                        background: 'none',
                        color: 'var(--primary-color)',
                    },
                    color: 'var(--dropdown-menu-fg)',
                    padding: '.5rem .1rem',
                },
                value: {
                    margin: '.2rem',
                    paddingBottom: '1rem',
                    paddingLeft: '1rem',
                    paddingTop: '1rem',
                },
            }}
            sx={{ maxWidth, width }}
            transitionProps={{ duration: 100, transition: 'fade' }}
            withinPortal
            {...props}
        />
    );
};
