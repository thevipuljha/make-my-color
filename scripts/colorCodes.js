const getRgbaString = (red, green, blue, alpha) => `rgba(${red},${green},${blue},${alpha/100})`;
const getHexString = (hexValue) => `#${hexValue}`;
const getHslaString = (hue, sat, light, alpha) => `hsla(${hue},${sat}%,${light}%,${alpha})`;
const getCmykString = (cyan, magenta, yellow, konsant) => `cmyk(${cyan}%,${magenta}%,${yellow}%,${konsant}%)`;
const getRandomInteger = (limit) => Math.round(Math.random() * limit);

//color codes conversions
const hexToDec = (hex) => parseInt(hex, 16);
const decToHex = (decimal) => {
    let hex = Number(decimal).toString(16).toUpperCase();
    while (hex.length < 2)
        hex = "0" + hex;
    return hex;
};

const rgbaToHex = function (red, green, blue, alpha = 100) {
    red = decToHex(red);
    green = decToHex(green);
    blue = decToHex(blue);
    if (alpha <= 1)
        alpha *= 100;
    alpha = Math.round(255 * (alpha / 100));
    alpha = decToHex(alpha);
    return `${red}${green}${blue}${alpha}`;
};

const rgbatohsla = function (red, green, blue, alpha = 100) {
    red /= 255, green /= 255, blue /= 255;
    let max = Math.max(red, green, blue),
        min = Math.min(red, green, blue),
        hue = 0,
        sat = 0,
        light = (max + min) / 2;
    if (min != max) {
        let diff = max - min;
        sat = diff / (light > 0.5 ? (2 - max - min) : (max + min));
        //oneLiner
        // hue = (max==red?((green - blue) / diff + (green < blue ? 6 : 0)):(max==green)?((blue - red) / diff + 2):((red - green) / diff + 4));
        switch (max) {
            case red:
                hue = (green - blue) / diff + (green < blue ? 6 : 0);
                break;
            case green:
                hue = (blue - red) / diff + 2;
                break;
            case blue:
                hue = (red - green) / diff + 4;
                break;
        }
    }
    if (alpha > 1)
        alpha /= 100;
    return {
        hue: Math.round(hue * 60),
        sat: Math.round(sat * 100),
        light: Math.round(light * 100),
        alpha
    }
};

const rgbToCmyk = function (red, green, blue) {
    red /= 255, green /= 255, blue /= 255;
    let cyan = magenta = yellow = 0,
        konsant;
    konsant = 1 - Math.max(red, green, blue);
    if (konsant != 1) {
        cyan = Math.round(((1 - red - konsant) / (1 - konsant)) * 100);
        magenta = Math.round(((1 - green - konsant) / (1 - konsant)) * 100);
        yellow = Math.round(((1 - blue - konsant) / (1 - konsant)) * 100);
    }
    return {
        cyan,
        magenta,
        yellow,
        konsant: Math.round(konsant * 100)
    }
};

const hexToRgba = function (hex) {
    hex = hex.toString();
    let alpha = 100;
    if (hex.length > 6) {
        alpha = hexToDec(hex.slice(6, 8));
        alpha = Math.round((alpha * 100) / 255);
    }
    return {
        red: hexToDec(hex.slice(0, 2)),
        green: hexToDec(hex.slice(2, 4)),
        blue: hexToDec(hex.slice(4, 6)),
        alpha
    }
};

const hexToHsla = function (hex) {
    const rgba = hexToRgba(hex);
    return rgbatohsla(rgba.red, rgba.green, rgba.blue, rgba.alpha)
}

const hexToCmyk = function (hex) {
    const rgb = hexToRgba(hex);
    return rgbToCmyk(rgb.red, rgb.green, rgb.blue);
}

const hslaToRgba = function (hue, sat, light, alpha = 100) {
    hue /= 360, sat /= 100, light /= 100;
    let red = green = blue = light;
    if (sat != 0) {
        function getHueRgb(color, temp1, temp2) {
            if (color < 0) color += 1;
            if (color > 1) color -= 1;
            if (6 * color < 1) return temp2 + (temp1 - temp2) * 6 * color;
            if (2 * color < 1) return temp1;
            if (3 * color < 2) return temp2 + (temp1 - temp2) * (2 / 3 - color) * 6;
            return temp2;
        }
        let temp1 = light < 0.5 ? light * (sat + 1) : light + sat - light * sat;
        let temp2 = 2 * light - temp1;

        red = Math.round(getHueRgb(hue + 1 / 3, temp1, temp2) * 255);
        green = Math.round(getHueRgb(hue, temp1, temp2) * 255);
        blue = Math.round(getHueRgb(hue - 1 / 3, temp1, temp2) * 255);
    }
    if (alpha > 1)
        alpha /= 100;
    return {
        red: Math.max(0, Math.min(red, 255)),
        green: Math.max(0, Math.min(green, 255)),
        blue: Math.max(0, Math.min(blue, 255)),
        alpha
    }
};

const hslaToHex = function (hue, sat, light, alpha = 100) {
    const rgba = hslaToRgba(hue, sat, light, alpha);
    return rgbaToHex(rgba.red, rgba.green, rgba.blue, rgba.alpha);
};

const hslaToCmyk = function (hue, sat, light, alpha = 100) {
    const rgb = hslaToRgba(hue, sat, light, alpha);
    return rgbToCmyk(rgb.red, rgb.green, rgb.blue)
};

const cmykToRgb = function (cyan, magenta, yellow, konsant) {
    const rgb = [cyan, magenta, yellow].map(element => Math.round(255 * (1 - element / 100) * (1 - konsant / 100)));
    return {
        red: rgb[0],
        green: rgb[1],
        blue: rgb[2]
    }
};

const cmykToHex = function (cyan, magenta, yellow, konsant) {
    const rgb = cmykToRgb(cyan, magenta, yellow, konsant);
    return rgbaToHex(rgb.red, rgb.green, rgb.blue);
}

const cmykToHsla = function (cyan, magenta, yellow, konsant) {
    const rgb = cmykToRgb(cyan, magenta, yellow, konsant);
    return rgbatohsla(rgb.red, rgb.green, rgb.blue);
}
//color code conversion ends

const getRandomColor = () => {
    return {
        red: getRandomInteger(255),
        green: getRandomInteger(255),
        blue: getRandomInteger(255)
    }
};

const setRandomColor = (element) => {
    const rgb = getRandomColor();
    element.style.backgroundColor = getRgbaString(rgb.red, rgb.green, rgb.blue, 100);
}