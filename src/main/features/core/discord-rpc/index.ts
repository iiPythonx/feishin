import { Client, SetActivity } from '@xhayper/discord-rpc';
import { ipcMain } from 'electron';

const FEISHIN_DISCORD_APPLICATION_ID = '1165957668758900787';

let client: Client | null = null;

const createClient = async (clientId?: string) => {
    client = new Client({
        clientId: clientId || FEISHIN_DISCORD_APPLICATION_ID,
    });

    await client.login();

    return client;
};

const isConnected = () => {
    return client?.isConnected;
};

const setActivity = (activity: SetActivity) => {
    if (client) {
        client.user?.setActivity({
            ...activity,
        });
    }
};

const clearActivity = () => {
    if (client) {
        client.user?.clearActivity();
    }
};

const quit = () => {
    if (client) {
        client?.destroy();
    }
};

ipcMain.handle('discord-rpc-initialize', async (_event, clientId?: string) => {
    await createClient(clientId);
});

ipcMain.handle('discord-rpc-is-connected', () => {
    return isConnected();
});

ipcMain.handle('discord-rpc-set-activity', (_event, activity: SetActivity) => {
    if (client) {
        setActivity(activity);
    }
});

ipcMain.handle('discord-rpc-clear-activity', () => {
    if (client) {
        clearActivity();
    }
});

ipcMain.handle('discord-rpc-quit', () => {
    quit();
});

export const discordRpc = {
    clearActivity,
    createClient,
    isConnected,
    quit,
    setActivity,
};
