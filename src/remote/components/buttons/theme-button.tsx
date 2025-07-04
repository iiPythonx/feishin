import { useIsDark, useToggleDark } from '/@/remote/store';
import { ActionIcon } from '/@/shared/components/action-icon/action-icon';
import { Icon } from '/@/shared/components/icon/icon';

export const ThemeButton = () => {
    const isDark = useIsDark();
    const toggleDark = useToggleDark();

    const handleToggleTheme = () => {
        toggleDark();
    };

    return (
        <ActionIcon
            onClick={handleToggleTheme}
            tooltip={{
                label: 'Toggle Theme',
            }}
            variant="default"
        >
            {isDark ? (
                <Icon
                    icon="themeLight"
                    size={30}
                />
            ) : (
                <Icon
                    icon="themeDark"
                    size={30}
                />
            )}
        </ActionIcon>
    );
};
