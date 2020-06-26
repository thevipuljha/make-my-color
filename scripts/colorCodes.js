//color codes conversions
const hexToDec = (hex) => parseInt(hex, 16);
const decToHex = function (decimal) {
    let hex = Number(decimal).toString(16).toUpperCase();
    while (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};

const rgbaToHex = function (red, green, blue, alpha) {
    red = decToHex(red);
    green = decToHex(green);
    blue = decToHex(blue);
    alpha = Math.round(255 * (alpha / 100));
    alpha = decToHex(alpha);
    return red + green + blue + alpha;
};

const rgbatohsl = function (red, green, blue, alpha) {
    red /= 255, green /= 255, blue /= 255;
    let max = Math.max(red, green, blue),
        min = Math.min(red, green, blue),
        hue, sat, light = (max + min) / 2;
    if (min == max) {
        hue = sat = 0;
    } else {
        let diff = max - min;
        sat = diff / (light > 0.5 ? (2 - max - min) : (max + min));

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
    hue = Math.round(hue * 60);
    sat = Math.round(sat * 100);
    light = Math.round(light * 100);
    return {
        hue,
        sat,
        light,
        alpha
    }
};

const rgbToCmyk = function (red, green, blue) {
    let cyan, magenta, yellow, konsant;
    red /= 255, green /= 255, blue /= 255;
    konsant = 1 - Math.max(red, green, blue);
    if (konsant == 1) {
        cyan = 0;
        magenta = 0;
        yellow = 0;
    } else {
        cyan = Math.round(((1 - red - konsant) / (1 - konsant)) * 100);
        magenta = Math.round(((1 - green - konsant) / (1 - konsant)) * 100);
        yellow = Math.round(((1 - blue - konsant) / (1 - konsant)) * 100);
    }
    konsant = Math.round(konsant * 100);
    return {
        cyan,
        magenta,
        yellow,
        konsant
    }
};

const hexToRgba = function (hex) {
    let red = hexToDec(hex.slice(0, 2));
    let green = hexToDec(hex.slice(2, 4));
    let blue = hexToDec(hex.slice(4, 6));
    let alpha = "";
    if (hex.length > 6) {
        alpha = hexToDec(hex.slice(6, 8));
    }

    // hex = String(hex).replace(/[^0-9a-f]/gi, "");
    // let red = (hex=parseInt(hex, 16)) >> 16,
    //     green = hex >> 8 & 255,
    //     blue = 255 & hex;
    return {
        red,
        green,
        blue,
        alpha
    }
};

const hexToHsla = function (hex) {
    const rgba = hexToRgba();
    const {
        hue,
        sat,
        light,
        alpha
    } = rgbatohsl(rgba.red, rgba.green, rgba.blue, rgba.alpha);
    return {
        hue,
        sat,
        light,
        alpha
    }
}

const hexToCmyk = function (hex) {
    const rgb = hexToRgba();
    const {
        cyan,
        magenta,
        yellow,
        konsant
    } = rgbToCmyk(rgb.red, rgb.green, rgb.blue);
    return {
        cyan,
        magenta,
        yellow,
        konsant
    }
}

const hslaToRgb = function (hue, sat, light, alpha) {
    hue /= 360, sat /= 100, light /= 100;
    let red, green, blue;
    if (sat == 0) {
        red = green = blue = light;
    } else {
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
        red = Math.max(0, Math.min(red, 255));
        green = Math.max(0, Math.min(green, 255));
        blue = Math.max(0, Math.min(blue, 255));
    }
    return {
        red,
        green,
        blue,
        alpha
    }
};

const hslaToHex = function (hue, sat, light, alpha) {
    const rgba = hslaToRgb(hue, sat, light, alpha);
    return rgbaToHex(rgba.red, rgba.green, rgba.blue, rgba.alpha);
};

const hslaToCmyk = function (hue, sat, light, alpha) {
    const rgb = hslaToRgb(hue, sat, light, alpha);
    const {
        cyan,
        magenta,
        yellow,
        konsant
    } = rgbToCmyk(rgb.red, rgb.green, rgb.blue);
    return {
        cyan,
        magenta,
        yellow,
        konsant
    }
};

const cmykToRgb = function (cyan, magenta, yellow, konsant) {
    let rgb = [cyan, magenta, yellow];
    rgb = rgb.map(function (element) {
        return Math.round(255 * (1 - element / 100) * (1 - konsant / 100));
    });
    let red = rgb[0],
        green = rgb[1],
        blue = rgb[2];
    return {
        red,
        green,
        blue
    }
};

const cmykToHex = function (cyan, magenta, yellow, konsant) {
    const rgb = cmykToRgb(cyan, magenta, yellow, konsant);
    return rgbaToHex(rgba.red, rgba.green, rgba.blue, 100);
}

const cmykToHsla = function (cyan, magenta, yellow, konsant) {
    const rgb = cmykToRgb(cyan, magenta, yellow, konsant);
    const {
        hue,
        sat,
        light,
        alpha
    } = rgbatohsl(rgb.red, rgb.green, rgb.blue, 100);
    return {
        hue,
        sat,
        light,
        alpha
    }
}
//color code conversion ends

const getRgbaString = (red, green, blue, alpha) => `rgba(${red},${green},${blue},${alpha/100})`;
const getHexString = (hexValue) => `#${hexValue}`;
const getHslaString = (hue, sat, light, alpha) => `hsla(${hue},${sat}%,${light}%,${alpha}%)`;
const getCmykString = (cyan, magenta, yellow, konsant) => `cmyk(${cyan}%,${magenta}%,${yellow}%,${konsant}%)`;

const getRandomColor = () => {
    const red = Math.round(Math.random() * 255);
    const green = Math.round(Math.random() * 255);
    const blue = Math.round(Math.random() * 255);
    return {
        red,
        green,
        blue
    }
};

const setRandomColor = (element) => {
    const {
        red,
        green,
        blue
    } = getRandomColor();
    element.style.backgroundColor = getRgbaString(red, green, blue, 100);
}