export const menuSlide = {
    initial: { x: "100%" },
    enter: { x: "0", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
    exit: {
        x: "100%",
        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
    },
};

export const menuVariants = {
    initial: { opacity: 0, scale: 0.95, y: -10 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } },
};

export const modalVariants = {
    hidden: { y: "-100vh" },
    visible: { y: 0 },
    exit: { y: "-100vh" },
};

export const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

export const containerVariants = {
    close: {
        width: "6rem",
        transition: {
            type: "spring",
            damping: 15,
            duration: 0.5,
        },
    },
    open: {
        width: "20rem",
        transition: {
            type: "spring",
            damping: 15,
            duration: 0.5,
        },
    },
}

export const svgVariants = {
    close: {
        rotate: 360,
    },
    open: {
        rotate: 180,
    },
}
