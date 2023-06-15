export const getInputHeight = (size: string): number => {
    switch (size) {
        case 'sm': return 31
        case 'md': return 33
        case 'lg': return 34
        case 'xl': return 37
        case '2x': return 39
        case 'xs': return 28
        default: return 33;
    }
}