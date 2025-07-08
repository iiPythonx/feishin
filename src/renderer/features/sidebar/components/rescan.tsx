import { Group } from '@mantine/core';
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
import { Accordion } from '/@/shared/components/accordion/accordion';
import { Button } from '/@/shared/components/button/button';
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
                if (status) setScanStatus!(status);
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
                if (results) {
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
                <Button
                    style={{ borderRadius: '8px', display: 'flex', width: '100%' }}
                    variant="subtle"
                >
                    <Group gap="sm">Scan in progress...</Group>
                </Button>
            )}
            {!scanning && (
                <Button
                    onClick={() => handleRefresh(isNavidrome ? false : undefined)}
                    style={{ borderRadius: '8px', display: 'flex', width: '100%' }}
                    variant="subtle"
                >
                    <Group gap="sm">Normal Scan</Group>
                </Button>
            )}
            {isNavidrome && !scanning && (
                <Button
                    onClick={() => handleRefresh(true)}
                    style={{ borderRadius: '8px', display: 'flex', width: '100%' }}
                    variant="subtle"
                >
                    <Group gap="sm">Full Scan</Group>
                </Button>
            )}
            {(isNavidrome || server?.type === ServerType.SUBSONIC) && (
                <>
                    <Button
                        disabled
                        style={{ borderRadius: '8px', display: 'flex', width: '100%' }}
                        variant="subtle"
                    >
                        Folders: {folders ?? 'N/A'} | Tracks: {tracks ?? 'N/A'}
                    </Button>
                </>
            )}
        </>
    );
};

export const RescanSidebar = () => {
    const { setScanStatus } = useContext(RescanContext);
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
            <Accordion
                classNames={{
                    item: styles.accordionItem,
                }}
            >
                <Accordion.Item value="rescan">
                    <Accordion.Control style={{ borderRadius: '8px', paddingLeft: '18px' }}>
                        <Group gap="sm">
                            <RiRefreshLine />
                            Rescan
                        </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <RescanMenu timerRef={timerRef} />
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </RescanProvider>
    );
};
