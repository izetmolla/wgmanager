import { ClassAttributes, FC, HTMLAttributes, ReactNode, useState, Suspense, SetStateAction, Fragment, useEffect, useMemo } from "react"
import { Box, Pressable, Text, useBreakpointValue } from "native-base"
import Modal from "react-overlays/esm/Modal"

interface AppPopoverTypes {
    bodyWidth?: number | string
    backDrop?: {
        opacity?: boolean
    }
    position?: {
        top?: number | string
        bottom?: number | string
    }
    children: ReactNode
    button: JSX.Element;
    opacity?: number,
    contentProps?: any
}


const AppPopover: FC<AppPopoverTypes> = ({
    children,
    button,
    bodyWidth = 0,
    contentProps = {}
}): JSX.Element => {
    const isMobile = useBreakpointValue({ base: true, sm: false })
    const [loaded, setLoaded] = useState(false)
    const [position, setPosition] = useState({ width: 42, top: "30%", left: "30%" })
    const [boxSize, setBoxSize] = useState({ width: bodyWidth })
    const [showModal, setShowModal] = useState(false);
    const renderBackdrop = (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement>) => <div style={{
        position: "fixed",
        zIndex: 1040,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#000",
        opacity: 0,
    }}  {...props} />

    var handleClose = () => setShowModal(false);

    const handleLayout = (event: { nativeEvent: { layout: SetStateAction<{ width: string | number }> } }) => {
        setBoxSize(event?.nativeEvent?.layout)
        setLoaded(true)
    };


    const onLayoutButtonCallback = useMemo(() => {
        const handleLayout = (event: any) => {
            setPosition(event.nativeEvent.layout)
        };
        return handleLayout;
    }, []);



    useEffect(() => {

    }, [])

    return (
        <Fragment>
            <Pressable onPress={() => setShowModal(true)} onLayout={onLayoutButtonCallback}>
                {button}
            </Pressable>
            <Modal
                style={{
                    opacity: loaded ? 1 : 0,
                    maxWidth: window.screen.width,
                    position: "fixed",
                    zIndex: 1040,
                    top: position.top + position.width + 10,
                    left: isMobile ? (window.screen.width - (window.screen.width + 0.1)) : position.left + (-boxSize.width + (position.width)),
                }}
                show={showModal}
                onHide={handleClose}
                renderBackdrop={renderBackdrop}
            >
                <Box
                    onLayout={handleLayout}
                    flex={1}
                    shadow={5}
                    rounded="lg"
                    backgroundColor="white"
                    {...contentProps}>
                    <Suspense fallback={<Text>Loading...</Text>}>
                        {children}
                    </Suspense>
                </Box>
            </Modal>
        </Fragment >

    )
}

export default AppPopover