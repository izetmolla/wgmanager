import React, { FC, ReactNode, useEffect, useRef } from 'react';
import { StyleSheet, Animated, ViewProps } from 'react-native';
import { Text, View } from 'native-base';



const colors = {
    border: '#E2E2E2',
    // bgColor: 'red',
}

interface BoxWithLabelTypes {
    labelColor?: string
    style?: ViewProps['style']
    labelContent?: {
        color: string[]
        backgroundColor: string[]
    }
    isHeading: boolean,
    visit: string
    error: any
    label: string
    children: ReactNode
    paddingHorizontal?: number
}

const BoxWithLabel: FC<BoxWithLabelTypes> = ({
    labelColor = "gray",
    style,
    labelContent = { color: ["gray", "black"], backgroundColor: ["transparent", "white"] },
    isHeading = false,
    label,
    error,
    children,
    paddingHorizontal = 10,
}) => {
    const _animatedIsFocused = useRef(new Animated.Value(isHeading ? 1 : 0));

    useEffect(() => {
        Animated.timing(_animatedIsFocused?.current, {
            toValue: isHeading ? 1 : 0,
            duration: 120,
            useNativeDriver: false,
        }).start();
    }, [isHeading])

    const labelStyle = {
        borderRadius: 5,
        position: 'absolute',
        left: 10,
        top: _animatedIsFocused?.current.interpolate({
            inputRange: [0, 1],
            outputRange: ["29%", "-20%"],
        }),
        // ...fonts.regular,
        // fontSize: _animatedIsFocused?.current.interpolate({
        //     inputRange: [0, 1],
        //     outputRange: [10, 10],
        // }),
        // lineHeight: _animatedIsFocused?.current.interpolate({
        //     inputRange: [0, 1],
        //     outputRange: [5, 15],
        // }),
        color: _animatedIsFocused?.current.interpolate({
            inputRange: [0, 1],
            outputRange: labelContent.color,
        }),
        backgroundColor: _animatedIsFocused?.current.interpolate({
            inputRange: [0, 1],
            outputRange: labelContent.backgroundColor,
        }),
        zIndex: _animatedIsFocused?.current.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 9999],
        }),
        paddingHorizontal: paddingHorizontal,
        marginHorizontal: 0,
    };

    return (
        <>
            <View style={[styles.container, { borderColor: colors.border, }, style]}>
                {typeof label === 'string' ? (
                    <Animated.Text style={{ ...labelStyle, color: typeof error == "string" ? "red" : labelColor ? labelColor : "black" } as any} numberOfLines={1}>
                        {label}
                    </Animated.Text>
                ) : null}
                <View style={{ flex: 1, zIndex: 9998 }} {...error && { borderWidth: 2, borderColor: "red.800" }}>
                    {children}
                </View>

            </View>
            {typeof error === 'string' ? (
                <Text style={[styles.textError]} color={"red.900"}>
                    {error}
                </Text>
            ) : null}
        </>
    );

}


const styles = StyleSheet.create({
    container: {
        minHeight: 46,
        borderWidth: 1,
        borderRadius: 5,
    },
    textError: {
        fontSize: 10,
        lineHeight: 15,
    },
});
export default BoxWithLabel;
