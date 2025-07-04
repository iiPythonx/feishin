import type { MotionProps } from 'motion/react';

const fadeIn: MotionProps = {
    animate: 'show',
    exit: 'hidden',
    initial: 'hidden',
    transition: { duration: 0.3 },
    variants: {
        hidden: { opacity: 0 },
        show: { opacity: 1 },
    },
};

const fadeOut: MotionProps = {
    animate: 'hidden',
    exit: 'show',
    initial: 'show',
    transition: { duration: 0.3 },
    variants: {
        hidden: { opacity: 0 },
        show: { opacity: 1 },
    },
};

const slideInLeft: MotionProps = {
    animate: 'show',
    exit: 'hidden',
    initial: 'initial',
    transition: { duration: 0.3 },
    variants: {
        hidden: { x: -100 },
        initial: { x: -100 },
        show: { x: 0 },
    },
};

const slideOutLeft: MotionProps = {
    animate: 'hidden',
    exit: 'show',
    initial: 'initial',
    transition: { duration: 0.3 },
    variants: {
        hidden: { x: -100 },
        initial: { x: 0 },
        show: { x: 0 },
    },
};

const slideInRight: MotionProps = {
    animate: 'show',
    exit: 'hidden',
    initial: 'initial',
    transition: { duration: 0.3 },
    variants: {
        hidden: { x: 100 },
        initial: { x: 100 },
        show: { x: 0 },
    },
};

const slideOutRight: MotionProps = {
    animate: 'hidden',
    exit: 'show',
    initial: 'show',
    transition: { duration: 0.3 },
    variants: {
        hidden: { x: 100 },
        initial: { x: 0 },
        show: { x: 0 },
    },
};

const slideInUp: MotionProps = {
    animate: 'show',
    exit: 'hidden',
    initial: 'hidden',
    transition: { duration: 0.3 },
    variants: {
        hidden: { y: 100 },
        show: { y: 0 },
    },
};

const slideOutUp: MotionProps = {
    animate: 'hidden',
    exit: 'show',
    initial: 'initial',
    transition: { duration: 0.3 },
    variants: {
        hidden: { y: 100 },
        initial: { y: 0 },
        show: { y: 0 },
    },
};

const slideInDown: MotionProps = {
    animate: 'show',
    exit: 'hidden',
    initial: 'initial',
    transition: { duration: 0.3 },
    variants: {
        hidden: { y: -100 },
        initial: { y: -100 },
        show: { y: 0 },
    },
};

const slideOutDown: MotionProps = {
    animate: 'hidden',
    exit: 'show',
    initial: 'show',
    transition: { duration: 0.3 },
    variants: {
        hidden: { y: -10 },
        show: { y: 0 },
    },
};

const scale: MotionProps = {
    animate: { scale: 1 },
    exit: 'hidden',
    initial: 'hidden',
    transition: { duration: 0.3 },
    variants: {
        hidden: { scale: 0 },
        show: { scale: 1 },
    },
};

const rotate: MotionProps = {
    animate: 'show',
    exit: 'hidden',
    initial: 'hidden',
    transition: { duration: 0.3 },
    variants: {
        hidden: { rotate: 0 },
        show: { rotate: 360 },
    },
};

const bounce: MotionProps = {
    animate: 'show',
    exit: 'hidden',
    initial: 'hidden',
    transition: { duration: 0.3, times: [0, 0.5, 1] },
    variants: {
        hidden: { y: [0, -30, 0] },
        show: { y: 0 },
    },
};

const pulse: MotionProps = {
    animate: 'show',
    exit: 'hidden',
    initial: 'hidden',
    transition: { duration: 1, repeat: Infinity },
    variants: {
        hidden: { scale: [1, 1.1, 1] },
        show: { scale: 1 },
    },
};

const shake: MotionProps = {
    animate: 'show',
    exit: 'hidden',
    initial: 'hidden',
    transition: { duration: 0.3 },
    variants: {
        hidden: { x: [-10, 10, -10, 10, 0] },
        show: { x: 0 },
    },
};

const flip: MotionProps = {
    animate: 'show',
    exit: 'hidden',
    initial: 'hidden',
    transition: { duration: 0.3 },
    variants: {
        hidden: { rotateY: 0 },
        show: { rotateY: 360 },
    },
};

const zoomIn: MotionProps = {
    animate: 'show',
    exit: 'hidden',
    initial: 'hidden',
    transition: { duration: 0.3 },
    variants: {
        hidden: { opacity: 0, scale: 0.5 },
        show: { opacity: 1, scale: 1 },
    },
};

const zoomOut: MotionProps = {
    animate: { opacity: 0, scale: 0.5 },
    exit: 'hidden',
    initial: 'hidden',
    transition: { duration: 0.3 },
    variants: {
        hidden: { opacity: 0, scale: 0.5 },
        show: { opacity: 1, scale: 1 },
    },
};

const rotateIn: MotionProps = {
    animate: 'show',
    exit: 'hidden',
    initial: 'hidden',
    transition: { duration: 0.3 },
    variants: {
        hidden: { opacity: 0, rotate: -180 },
        show: { opacity: 1, rotate: 0 },
    },
};

const swing: MotionProps = {
    animate: 'show',
    exit: 'hidden',
    initial: 'hidden',
    transition: { duration: 1, repeat: Infinity },
    variants: {
        hidden: { rotate: [0, 15, -15, 0] },
        show: { rotate: 0 },
    },
};

const rubberBand: MotionProps = {
    animate: 'show',
    exit: 'hidden',
    initial: 'hidden',
    transition: { duration: 0.8 },
    variants: {
        hidden: { scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1] },
        show: { scaleX: 1 },
    },
};

const fadeInUp: MotionProps = {
    animate: 'show',
    exit: 'hidden',
    initial: 'hidden',
    transition: { duration: 0.3 },
    variants: {
        hidden: { opacity: 0, y: 50 },
        show: { opacity: 1, y: 0 },
    },
};

const fadeInDown: MotionProps = {
    animate: 'show',
    exit: 'hidden',
    initial: 'hidden',
    transition: { duration: 0.3 },
    variants: {
        hidden: { opacity: 0, y: -50 },
        show: { opacity: 1, y: 0 },
    },
};

const rotateScale: MotionProps = {
    animate: 'show',
    exit: 'hidden',
    initial: 'hidden',
    transition: { duration: 0.7 },
    variants: {
        hidden: { rotate: 0, scale: 1 },
        show: { rotate: 360, scale: 1.5 },
    },
};

export const animationProps = {
    bounce,
    fadeIn,
    fadeInDown,
    fadeInUp,
    fadeOut,
    flip,
    pulse,
    rotate,
    rotateIn,
    rotateScale,
    rubberBand,
    scale,
    shake,
    slideInDown,
    slideInLeft,
    slideInRight,
    slideInUp,
    slideOutDown,
    slideOutLeft,
    slideOutRight,
    slideOutUp,
    swing,
    zoomIn,
    zoomOut,
};
