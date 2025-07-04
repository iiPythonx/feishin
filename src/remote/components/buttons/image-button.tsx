import { CiImageOff, CiImageOn } from 'react-icons/ci';

import { useShowImage, useToggleShowImage } from '/@/remote/store';
import { ActionIcon } from '/@/shared/components/action-icon/action-icon';

export const ImageButton = () => {
    const showImage = useShowImage();
    const toggleImage = useToggleShowImage();

    return (
        <ActionIcon
            onClick={() => toggleImage()}
            tooltip={{
                label: showImage ? 'Hide Image' : 'Show Image',
            }}
            variant="default"
        >
            {showImage ? <CiImageOff size={30} /> : <CiImageOn size={30} />}
        </ActionIcon>
    );
};
