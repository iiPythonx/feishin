import { Group } from '@mantine/core';
import clsx from 'clsx';
import {
    createContext,
    MutableRefObject,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { RiRefreshLine } from 'react-icons/ri';

import styles from './sidebar.module.css';

import { api } from '/@/renderer/api';
import { useCurrentServer } from '/@/renderer/store';
import { Button } from '/@/shared/components/button/button';
import { DropdownMenu } from '/@/shared/components/dropdown-menu/dropdown-menu';
import { toast } from '/@/shared/components/toast/toast';
import { ServerType } from '/@/shared/types/domain-types';
import { ScanStatus } from '/@/shared/types/domain-types';

const RescanContext = createContext<{
    scanStatus: ScanStatus;
    setScanStatus?: (status: ScanStatus) => void;
}>({
    scanStatus: { scanning: false },
});

export const RescanProvider = ({ children }: { children: ReactNode }) => {
    const [scanStatus, setScanStatus] = useState<ScanStatus>({ scanning: false });

    const providerValue = useMemo(() => {
        return { scanStatus, setScanStatus };
    }, [scanStatus]);

    return <RescanContext.Provider value={providerValue}>{children}</RescanContext.Provider>;
};

const RescanMenu = ({
    timerRef,
}: {
    timerRef: MutableRefObject<ReturnType<typeof setInterval> | undefined>;
}) => {
    const server = useCurrentServer();
    const {
        scanStatus: { folders, scanning, tracks },
        setScanStatus,
    } = useContext(RescanContext);

    const isNavidrome = server?.type === ServerType.NAVIDROME;

    useEffect(() => {
        if (
            scanning &&
            timerRef.current === undefined &&
            server &&
            server.type !== ServerType.JELLYFIN
        ) {
            timerRef.current = setInterval(async () => {
                const status = await api.controller.getScanStatus({ apiClientProps: { server } });
                if (status) {
                    setScanStatus!(status);

                    if (scanning && !status.scanning) {
                        toast.success({
                            message: 'Scan completed',
                        });
                    }
                }
            }, 1000);
        } else if (!scanning && timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = undefined;
        }
    }, [scanning, server, setScanStatus, timerRef]);

    const handleRefresh = useCallback(
        async (full?: boolean) => {
            try {
                if (!server) return;

                const results = await api.controller.rescan({
                    apiClientProps: { server },
                    full,
                });
                if (server.type === ServerType.JELLYFIN) {
                    toast.success({
                        message: 'Scan started, note that Jellyfin does not report progress.',
                        title: 'Started sync',
                    });
                } else if (results) {
                    toast.success({
                        message: 'Scan started.',
                        title: 'Started sync',
                    });
                    setScanStatus!({ ...results, scanning: true });
                }
            } catch (error) {
                console.error(error);
            }
        },
        [server, setScanStatus],
    );

    return (
        <>
            {scanning && (
                <DropdownMenu.Item
                    closeMenuOnClick={false}
                    disabled
                >
                    Currently scanning...
                </DropdownMenu.Item>
            )}
            {!scanning && (
                <DropdownMenu.Item
                    closeMenuOnClick={server?.type === ServerType.JELLYFIN}
                    onClick={() => handleRefresh(isNavidrome ? false : undefined)}
                >
                    Start scan
                </DropdownMenu.Item>
            )}
            {isNavidrome && !scanning && (
                <DropdownMenu.Item
                    closeMenuOnClick={false}
                    onClick={() => {
                        handleRefresh(true);
                    }}
                >
                    Start full scan
                </DropdownMenu.Item>
            )}
            {(isNavidrome || server?.type === ServerType.SUBSONIC) && (
                <>
                    <DropdownMenu.Item disabled>Folders: {folders ?? '-'}</DropdownMenu.Item>
                    <DropdownMenu.Item disabled>Tracks: {tracks ?? '-'}</DropdownMenu.Item>
                </>
            )}
        </>
    );
};

export const RescanSidebar = () => {
    const { scanStatus, setScanStatus } = useContext(RescanContext);
    const server = useCurrentServer();
    const timerRef = useRef<ReturnType<typeof setInterval>>();

    useEffect(() => {
        if (setScanStatus) setScanStatus({ scanning: false });
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = undefined;
            }
        };
    }, [server, setScanStatus]);

    return (
        <RescanProvider>
            <DropdownMenu>
                <DropdownMenu.Target>
                    <Button
                        className={clsx({
                            [styles.disabled]: false,
                            [styles.link]: true,
                        })}
                        classNames={{
                            inner: styles.inner,
                            label: styles.label,
                        }}
                        style={{ borderRadius: '8px', display: 'flex', width: '100%' }}
                        variant="subtle"
                    >
                        <Group gap="sm">
                            {scanStatus.scanning ? (
                                <RiRefreshLine
                                    style={{
                                        animation: 'rotating 2s ease-in-out infinite',
                                    }}
                                />
                            ) : (
                                <RiRefreshLine />
                            )}
                            Rescan {scanStatus.scanning ? 'in progress' : ''}
                        </Group>
                    </Button>
                </DropdownMenu.Target>
                <DropdownMenu.Dropdown>
                    <RescanMenu timerRef={timerRef} />
                </DropdownMenu.Dropdown>
            </DropdownMenu>
        </RescanProvider>
    );
};
