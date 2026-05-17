import {
    ItemTableListInnerColumn,
    TableColumnTextContainer,
} from '/@/renderer/components/item-list/item-table-list/item-table-list-column';
import { useIsActiveRow } from '/@/renderer/components/item-list/item-table-list/item-table-list-context';
import { usePlayerStatus } from '/@/renderer/store';
import { Flex } from '/@/shared/components/flex/flex';
import { Icon } from '/@/shared/components/icon/icon';
import { LibraryItem, QueueSong } from '/@/shared/types/domain-types';
import { PlayerStatus } from '/@/shared/types/types';

const RowIndexColumnBase = (props: ItemTableListInnerColumn) => {
    const { itemType } = props;

    switch (itemType) {
        case LibraryItem.FOLDER:
        case LibraryItem.PLAYLIST_SONG:
        case LibraryItem.QUEUE_SONG:
        case LibraryItem.SONG:
            return <QueueSongRowIndexColumn {...props} />;
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

const QueueSongRowIndexColumn = (props: ItemTableListInnerColumn) => {
    const status = usePlayerStatus();
    const song = (props.getRowItem?.(props.rowIndex) ?? props.data[props.rowIndex]) as QueueSong;
    const isActive = useIsActiveRow(song?.id, song?._uniqueId);

    const isActiveAndPlaying = isActive && status === PlayerStatus.PLAYING;

    let adjustedRowIndex =
        props.getAdjustedRowIndex?.(props.rowIndex) ??
        props.adjustedRowIndexMap?.get(props.rowIndex) ??
        (props.enableHeader ? props.rowIndex : props.rowIndex + 1);

    if (props.startRowIndex !== undefined && adjustedRowIndex > 0) {
        adjustedRowIndex = props.startRowIndex + adjustedRowIndex;
    }

    return (
        <InnerQueueSongRowIndexColumn
            {...props}
            adjustedRowIndex={adjustedRowIndex}
            isActive={isActive}
            isPlaying={isActiveAndPlaying}
        />
    );
};

const InnerQueueSongRowIndexColumn = (
    props: ItemTableListInnerColumn & {
        adjustedRowIndex: number;
        isActive: boolean;
        isPlaying: boolean;
    },
) => {
    return (
        <TableColumnTextContainer {...props}>
            {props.isActive ? (
                props.isPlaying ? (
                    <Flex>
                        <Icon fill="primary" icon="mediaPlay" />
                    </Flex>
                ) : (
                    <Flex>
                        <Icon fill="primary" icon="mediaPause" />
                    </Flex>
                )
            ) : (
                props.adjustedRowIndex
            )}
        </TableColumnTextContainer>
    );
};
