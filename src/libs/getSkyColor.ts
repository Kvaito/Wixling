export function getSkyColor(time:number, dayLength:number) {
    const ratio = time / dayLength;

    const startColor = { r: 60, g: 75, b: 91 };    // Синий
    const midColor = { r: 255, g: 192, b: 203 };    // Розоватый

    let r, g, b;
    // console.log(ratio);
    if (ratio <= 0.5) {  // от синего к розоватому
        r = Math.floor(startColor.r + (midColor.r - startColor.r) * (ratio * 2));
        g = Math.floor(startColor.g + (midColor.g - startColor.g) * (ratio * 2));
        b = Math.floor(startColor.b + (midColor.b - startColor.b) * (ratio * 2));
    } else {  // от розоватого к синему
        const adjustedRatio = (ratio - 0.5) * 2; // нормализуем значение
        r = Math.floor(midColor.r + (startColor.r - midColor.r) * adjustedRatio);
        g = Math.floor(midColor.g + (startColor.g - midColor.g) * adjustedRatio);
        b = Math.floor(midColor.b + (startColor.b - midColor.b) * adjustedRatio);
    }


    // Преобразование RGB в HEX
    const toHex = (color) => {
        const hex = color.toString(16).padStart(2, '0');
        return hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

