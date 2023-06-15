import React, { FC, useState } from 'react';
import { TextInput, Animated, TextInputProps } from 'react-native';

interface FloatingInput extends TextInputProps {
    label?: string
}
const FloatingInput: FC<FloatingInput> = ({ label, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedValue = new Animated.Value(props.value ? 1 : 0);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const labelStyle = {
        position: 'absolute',
        left: 10,
        top: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
        }),
        fontSize: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
        }),
        color: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['#aaa', '#000'],
        }),
    };

    return (
        <>
            <Animated.Text style={labelStyle as any}>{label}</Animated.Text>
            <TextInput
                {...props}
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, padding: 10 }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChangeText={props.onChangeText}
                value={props.value}
            />
        </>
    );
};

export default FloatingInput;