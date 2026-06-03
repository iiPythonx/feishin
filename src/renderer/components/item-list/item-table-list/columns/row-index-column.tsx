import clsx from 'clsx';

import styles from './row-index-column.module.css';

import { isRowPlayControlColumn } from '/@/renderer/components/item-list/helpers/get-row-play-control-column';
import { RowPlayControlCell } from '/@/renderer/components/item-list/item-table-list/columns/row-play-control-cell';
import { useRowPlayControl } from '/@/renderer/components/item-list/item-table-list/columns/use-row-play-control';
import {
    ItemTableListInnerColumn,
    TableColumnTextContainer,
} from '/@/renderer/components/item-list/item-table-list/item-table-list-column';
import { ItemListItem } from '/@/renderer/components/item-list/types';
import { ActionIcon } from '/@/shared/components/action-icon/action-icon';
import { Flex } from '/@/shared/components/flex/flex';
import { Icon } from '/@/shared/components/icon/icon';
import { Text } from '/@/shared/components/text/text';
import { LibraryItem } from '/@/shared/types/domain-types';
import { TableColumn } from '/@/shared/types/types';

const RowIndexColumnBase = (props: ItemTableListInnerColumn) => {
    const { itemType } = props;

    if (!isRowPlayControlColumn(TableColumn.ROW_INDEX, props.columns)) {
        return <DefaultRowIndexColumn {...props} />;
    }

    switch (itemType) {
        case LibraryItem.ALBUM:
        case LibraryItem.ALBUM_ARTIST:
        case LibraryItem.ARTIST:
        case LibraryItem.FOLDER:
        case LibraryItem.PLAYLIST_SONG:
        case LibraryItem.QUEUE_SONG:
        case LibraryItem.SONG:
            return <PlayableRowIndexColumn {...props} />;
        default:
            return <DefaultRowIndexColumn {...props} />;
    }
};

export const RowIndexColumn = RowIndexColumnBase;

const DefaultRowIndexColumn = (props: ItemTableListInnerColumn) => {
    const { enableHeader, rowIndex, startRowIndex } = props;

    let adjustedRowIndex =
        props.getAdjustedRowIndex?.(rowIndex) ??
        props.adjustedRowIndexMap?.get(rowIndex) ??
        (enableHeader ? rowIndex : rowIndex + 1);

    if (startRowIndex !== undefined && adjustedRowIndex > 0) {
        adjustedRowIndex = startRowIndex + adjustedRowIndex;
    }

    return <TableColumnTextContainer {...props}>{adjustedRowIndex}</TableColumnTextContainer>;
};

const PlayableRowIndexColumn = (props: ItemTableListInnerColumn) => {
    const { handlePlay, isActive, isPlaying, showPlayControls } = useRowPlayControl(props);

    let adjustedRowIndex =
        props.getAdjustedRowIndex?.(props.rowIndex) ??
        props.adjustedRowIndexMap?.get(props.rowIndex) ??
        (props.enableHeader ? props.rowIndex : props.rowIndex + 1);

    if (props.startRowIndex !== undefined && adjustedRowIndex > 0) {
        adjustedRowIndex = props.startRowIndex + adjustedRowIndex;
    }

    const indexContent = isActive ? (
        <Flex className={styles.indexContent}>
            <Icon fill="primary" icon={isPlaying ? 'mediaPlay' : 'mediaPause'} />
        </Flex>
    ) : (
        adjustedRowIndex
    );

    return (
        <RowPlayControlCell
            {...props}
            indexContent={indexContent}
            onPlay={handlePlay}
            showPlayControls={showPlayControls}
        />
    );
};
