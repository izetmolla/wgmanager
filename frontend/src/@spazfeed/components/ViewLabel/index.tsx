import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Text } from 'react-native';

const {
    sizes, lineHeights,
    margin, padding, borderRadius
} = {
    sizes: { base: 1 }, lineHeights: { base: 1, small: 1 },
    margin: { base: 1, small: 1 }, padding: { large: 1, base: 1 }, borderRadius: { base: 1 }
}

const MIN_HEIGHT = 46;
const TOP = 8;
const BOTTOM = margin.base - 8;

type Props = {
    label?: string;
    error?: string;
    isHeading?: boolean;
    children?: React.ReactNode;
};

const ViewLabel: React.FC<Props> = ({
    label,
    error,
    isHeading = false,
    children,
}) => {
    const _animatedIsFocused = useRef(new Animated.Value(isHeading ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(_animatedIsFocused, {
            toValue: isHeading ? 1 : 0,
            duration: 120,
            useNativeDriver: false,
        }).start();
    }, [isHeading]);

    const paddingHorizontal = padding.large - margin.small;
    const topCenter = (MIN_HEIGHT - lineHeights.base) / 2;

    const labelStyle = {
        position: 'absolute',
        left: 0,
        top: _animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [topCenter, -TOP],
        }),
        // ...fonts.regular,
        fontSize: _animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [sizes.base, 10],
        }),
        lineHeight: _animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [lineHeights.base, 15],
        }),
        color: _animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: ["blue", "yellow"],
        }),
        zIndex: _animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 9999],
        }),
        backgroundColor: "white",
        paddingHorizontal: paddingHorizontal,
        marginHorizontal: margin.small,
    };

    return (
        <>
            <View
                style={[
                    styles.container,
                    {
                        borderColor: "black",
                    },
                ]}
            >
                {typeof label === 'string' ? (
                    <Animated.Text style={labelStyle as any} numberOfLines={1}>
                        {label}
                    </Animated.Text>
                ) : null}
                {children}
            </View>
            {typeof error === 'string' ? (
                <Text
                    style={[
                        styles.textError,
                        {
                            color: "red",
                        },
                    ]}
                >
                    {error}
                </Text>
            ) : null}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: MIN_HEIGHT,
        borderWidth: 1,
        borderRadius: borderRadius.base,
        marginTop: TOP,
        marginBottom: BOTTOM,
    },
    textError: {
        fontSize: 10,
        lineHeight: 15,
        marginBottom: BOTTOM,
    },
});

export default ViewLabel;
export { MIN_HEIGHT };
