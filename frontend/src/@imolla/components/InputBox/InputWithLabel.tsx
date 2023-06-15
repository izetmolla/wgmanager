import { FC, useState } from "react";
import BoxWithLabel from "../BoxWithLabel";
import { StyleProp, TextInput, TextInputProps, TextStyle } from "react-native";

interface InputWithLabelTypes extends TextInputProps {
    boxProps?: any
    label?: string
    error?: string
    value?: string
    style?: StyleProp<TextStyle> | undefined;
    type?: string
    disabled?: boolean
}
const InputWithLabel: FC<InputWithLabelTypes> = ({ boxProps, style, label = "", value, error = undefined, ...res }) => {
    const [isHeading, setIsHeading] = useState(value === '' ? false : true);
    function onBlur() {
        value === '' ? setIsHeading(false) : setIsHeading(true);
    }

    return (
        <BoxWithLabel label={label} isHeading={isHeading} visit={""} error={error} {...boxProps} >
            <TextInput
                value={value}
                onFocus={() => setIsHeading(true)}
                onBlur={onBlur}
                {...res}
                style={[{ flex: 1, borderWidth: 0, borderStyle: "dashed" }, style]}
            />
        </BoxWithLabel>

    );
}
export default InputWithLabel;