import { SetContextMenuItems } from '/@/renderer/features/context-menu/events';

export const QUEUE_CONTEXT_MENU_ITEMS: SetContextMenuItems = [
    { divider: false, id: 'removeFromQueue' },
    { id: 'moveToNextOfQueue' },
    { id: 'moveToBottomOfQueue' },
    { divider: false, id: 'moveToTopOfQueue' },
    { divider: false, id: 'addToPlaylist' },
    { id: 'addToFavorites' },
    { divider: false, id: 'removeFromFavorites' },
    { children: true, disabled: false, id: 'setRating' },
    { disabled: false, divider: false, id: 'deselectAll' },
    { id: 'download' },
    { divider: false, id: 'shareItem' },
    { divider: false, id: 'showDetails' },
];

export const SONG_CONTEXT_MENU_ITEMS: SetContextMenuItems = [
    { id: 'play' },
    { id: 'playLast' },
    { id: 'playNext' },
    { id: 'playShuffled' },
    { divider: false, id: 'playSimilarSongs' },
    { divider: false, id: 'addToPlaylist' },
    { id: 'addToFavorites' },
    { divider: false, id: 'removeFromFavorites' },
    { children: true, disabled: false, divider: false, id: 'setRating' },
    { id: 'download' },
    { divider: false, id: 'shareItem' },
    { divider: false, id: 'showDetails' },
];

export const SONG_ALBUM_PAGE: SetContextMenuItems = [
    { id: 'play' },
    { id: 'playLast' },
    { id: 'playNext' },
    { divider: false, id: 'playShuffled' },
    { divider: false, id: 'addToPlaylist' },
];

export const PLAYLIST_SONG_CONTEXT_MENU_ITEMS: SetContextMenuItems = [
    { id: 'play' },
    { id: 'playLast' },
    { id: 'playNext' },
    { id: 'playShuffled' },
    { divider: false, id: 'playSimilarSongs' },
    { id: 'addToPlaylist' },
    { divider: false, id: 'removeFromPlaylist' },
    { id: 'addToFavorites' },
    { divider: false, id: 'removeFromFavorites' },
    { children: true, disabled: false, id: 'setRating' },
    { id: 'download' },
    { divider: false, id: 'shareItem' },
    { divider: false, id: 'showDetails' },
];

export const SMART_PLAYLIST_SONG_CONTEXT_MENU_ITEMS: SetContextMenuItems = [
    { id: 'play' },
    { id: 'playLast' },
    { id: 'playNext' },
    { divider: false, id: 'playShuffled' },
    { divider: false, id: 'playSimilarSongs' },
    { divider: false, id: 'addToPlaylist' },
    { id: 'addToFavorites' },
    { divider: false, id: 'removeFromFavorites' },
    { children: true, disabled: false, id: 'setRating' },
    { id: 'download' },
    { divider: false, id: 'shareItem' },
    { divider: false, id: 'showDetails' },
];

export const ALBUM_CONTEXT_MENU_ITEMS: SetContextMenuItems = [
    { id: 'play' },
    { id: 'playLast' },
    { id: 'playNext' },
    { divider: false, id: 'playShuffled' },
    { divider: false, id: 'addToPlaylist' },
    { id: 'addToFavorites' },
    { id: 'removeFromFavorites' },
    { children: true, disabled: false, divider: false, id: 'setRating' },
    { divider: false, id: 'shareItem' },
    { divider: false, id: 'showDetails' },
];

export const GENRE_CONTEXT_MENU_ITEMS: SetContextMenuItems = [
    { id: 'play' },
    { id: 'playLast' },
    { id: 'playNext' },
    { divider: false, id: 'playShuffled' },
    { divider: false, id: 'addToPlaylist' },
];

export const ARTIST_CONTEXT_MENU_ITEMS: SetContextMenuItems = [
    { id: 'play' },
    { id: 'playLast' },
    { id: 'playNext' },
    { divider: false, id: 'playShuffled' },
    { divider: false, id: 'addToPlaylist' },
    { id: 'addToFavorites' },
    { divider: false, id: 'removeFromFavorites' },
    { children: true, disabled: false, id: 'setRating' },
    { divider: false, id: 'shareItem' },
    { divider: false, id: 'showDetails' },
];

export const PLAYLIST_CONTEXT_MENU_ITEMS: SetContextMenuItems = [
    { id: 'play' },
    { id: 'playLast' },
    { id: 'playNext' },
    { divider: false, id: 'playShuffled' },
    { divider: false, id: 'shareItem' },
    { divider: false, id: 'deletePlaylist' },
    { divider: false, id: 'showDetails' },
];
