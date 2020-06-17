const elementById = (id) => document.getElementById(id);
const elementsByclass = (className) => document.getElementsByClassName(className);
const changeLinearInput = () => elementById("linearInput").value = elementById("linearSlider").value;
const changeLinearSlider = () => elementById("linearSlider").value = elementById("linearInput").value;
const transparentImage = "url(https://vipul1142.github.io/make-my-color/images/transparentImage.png)";
// const transparentImage = "url(../images/transparentImage.png)";
const getColorSliders = () => elementsByclass("color-slider");
const getColorInputs = () => elementsByclass("color-input");
const getColorCodes = () => elementsByclass("colorCodes");
const getColorCodeCopy = () => elementsByclass("colorCodesCopy");
const getColorButtons = () => elementsByclass("colorButton");
const getActiveColorButton = () => elementById("activeColor");
const getActiveType = () => elementById("activeType");
const getLinearDegree = () => elementById("linearSlider").value;
const getRadialShape = () => elementById("activeShape");
const getRadialDirection = () => elementById("currentDirection");
const getGradientPrefix = () => {
    const type = getActiveType().value;
    let gradientString = type + "-gradient(";
    if (type == "linear") {
        gradientString += `${getLinearDegree()}deg`;
    }
    if (type == "radial") {
        gradientString += `${getRadialShape().value} at ${getRadialDirection().value}`;
    }
    return gradientString;
};
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

function getBackgroundColor(domElelment) {
    let color = domElelment.style.backgroundColor;
    color = String(color).split(",");
    let red = +(color[0].split("(")[1]);
    let green = +color[1];
    let blue = +color[2];
    let alpha = 100;
    if (color.length == 4)
        alpha = +(color[3].split(")")[0] * 100);
    else
        blue = +(color[2].split(")")[0]);
    return [red, green, blue, alpha];
};

const setMainGradient = () => {
    const colorButtons = getColorButtons();
    let gradientString = getGradientPrefix();
    for (let index = 0; index < colorButtons.length; index++) {
        const rgba = getBackgroundColor(colorButtons[index]);
        gradientString += `,${getRgbaString(rgba[0],rgba[1],rgba[2],rgba[3])}`;
    }
    gradientString += `),${transparentImage}`;
    elementById("gradient").style.backgroundImage = gradientString;
    console.log(gradientString);
};
const setRandomColor = (element) => {
    const {
        red,
        green,
        blue
    } = getRandomColor();
    element.style.backgroundColor = getRgbaString(red, green, blue, 100);
}

const getSliderRgbaValue = () => {
    let red = elementById("redSlider").value;
    let green = elementById("greenSlider").value;
    let blue = elementById("blueSlider").value;
    let alpha = elementById("alphaSlider").value;
    return {
        red,
        green,
        blue,
        alpha
    }
}

//color codes conversions
const getRgbaString = (red, green, blue, alpha) => `rgba(${red},${green},${blue},${alpha/100})`;
const getHexString = (hexValue) => `#${hexValue}`;
const getHslaString = (hue, sat, light, alpha) => `hsla(${hue},${sat}%,${light}%,${alpha}%)`;
const getCmykString = (cyan, magenta, yellow, konsant) => `cmyk(${cyan}%,${magenta}%,${yellow}%,${konsant}%)`;
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

const rgbtohsl = function (red, green, blue) {
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
        light
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

const hexToRgb = function (hexString) {
    let red = hexToDec(hexString.slice(0, 2));
    let green = hexToDec(hexString.slice(2, 4));
    let blue = hexToDec(hexString.slice(4, 6));
    let alpha = "";
    if (hexString.length > 6) {
        alpha = hexToDec(hexString.slice(6, 8));
    }

    // hexString = String(hexString).replace(/[^0-9a-f]/gi, "");
    // let red = (hexString=parseInt(hexString, 16)) >> 16,
    //     green = hexString >> 8 & 255,
    //     blue = 255 & hexString;
    return {
        red,
        green,
        blue,
        alpha
    }
};

const hslToRgb = function (hue, sat, light) {
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
        blue
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
//color code conversion ends
const setColorCodes = () => {
    const colorCodes = getColorCodes();
    const {
        red,
        green,
        blue,
        alpha
    } = getSliderRgbaValue();
    const hex = rgbaToHex(red, green, blue, alpha);
    const {
        hue,
        sat,
        light
    } = rgbtohsl(red, green, blue);
    const {
        cyan,
        magenta,
        yellow,
        konsant
    } = rgbToCmyk(red, green, blue);
    colorCodes[0].value = getRgbaString(red, green, blue, alpha);
    colorCodes[1].value = getHexString(hex);
    colorCodes[2].value = getHslaString(hue, sat, light, alpha);
    colorCodes[3].value = getCmykString(cyan, magenta, yellow, konsant);
}

const gradientTypeSwitch = (activeButton) => {
    elementById(getActiveType().value + "Div").style.display = "none";
    elementById(activeButton.value + "Div").style.display = "flex";
    getActiveType().removeAttribute("id");
    activeButton.id = "activeType";
    setMainGradient();
};
const radialShapeSwitch = (activeButton) => {
    getRadialShape().removeAttribute("id");
    activeButton.id = "activeShape";
    setMainGradient();
};
const radialDirectionSwitch = (activeButton) => {
    getRadialDirection().removeAttribute("id");
    activeButton.id = "currentDirection";
};
const changeBoxColor = () => {
    const rgba = getSliderRgbaValue();
    const currentColor = `rgba(${rgba.red},${rgba.green},${rgba.blue},${(rgba.alpha)/100})`;
    elementById("alphaSlider").style.backgroundImage = `linear-gradient(90deg, #FFFFFF00,rgb(${rgba.red},${rgba.green},${rgba.blue})),${transparentImage}`;
    elementById("colorWindow").style.backgroundImage = `linear-gradient(90deg, ${currentColor}, ${currentColor}),${transparentImage}`;
}

function switchActiveColorButton(currentButton) {
    getActiveColorButton().removeAttribute("id");
    currentButton.id = "activeColor";
}

const changeActiveButtonColor = () => {
    const colorSliders = getColorSliders();
    const activeButton = getActiveColorButton();
    const rgba = [0, 0, 0, 0].map(func = (value, index) => colorSliders[index].value);
    activeButton.style.backgroundColor = getRgbaString(rgba[0], rgba[1], rgba[2], rgba[3]);
};

function updatesToActiveColor() {
    const colorSliders = getColorSliders();
    const colorInputs = getColorInputs();
    const rgba = getBackgroundColor(getActiveColorButton());
    for (let index = 0; index < 4; index++) {
        colorSliders[index].value = rgba[index];
        colorInputs[index].value = rgba[index];
    }
    const currentColor = getRgbaString(rgba[0], rgba[1], rgba[2], rgba[3]);
    elementById("colorWindow").style.backgroundImage = `linear-gradient(90deg, ${currentColor}, ${currentColor}),${transparentImage}`;
    setColorCodes();
}

function colorButtonCicked(colorButton) {
    switchActiveColorButton(colorButton);
    updatesToActiveColor();
}

const addEventListeners = () => {
    const colorSliders = getColorSliders();
    const colorInputs = getColorInputs();
    const colorCodes = getColorCodes();
    const colorCodeCopy = getColorCodeCopy();
    const colorButtons = getColorButtons();
    const linearDegrees = elementById("linearDirections").children;
    const radialDirection = elementById("radialDirections").children;
    for (let index = 0; index < 4; index++) {
        colorInputs[index].addEventListener('input', () => {
            setRgbInputLimit(colorInputs);
            colorSliders[index].value = colorInputs[index].value;
            changeBoxColor();
            setColorCodes();
            changeActiveButtonColor();
            setMainGradient();
        });

        colorSliders[index].addEventListener('input', () => {
            colorInputs[index].value = colorSliders[index].value;
            changeBoxColor();
            setColorCodes();
            changeActiveButtonColor();
            setMainGradient();
        });
        colorCodeCopy[index].addEventListener("click", () => {
            colorCodes[index].select();
            colorCodes[index].setSelectionRange(0, 99999);
            document.execCommand("copy");
        });
    }
    elementById("addColorButton").addEventListener("click", () => {
        let newColorButton = document.createElement("button");
        newColorButton.className = "colorButton";
        newColorButton.innerText = "gradient";
        newColorButton.id = "activeColor";
        setRandomColor(newColorButton);
        newColorButton.setAttribute("onclick", "colorButtonCicked(this)");
        elementById("gradientColorButtons").appendChild(newColorButton);
        if (colorButtons.length > 4) {
            elementById("gradientColorButtons").style.justifyContent = "space-between";
        }
        switchActiveColorButton(newColorButton);
        setMainGradient();
        updatesToActiveColor();
    });
    for (let index = 0; index < radialDirection.length; index++) {
        radialDirection[index].setAttribute("onclick", "radialDirectionSwitch(this);setMainGradient()")
    }
    for (let index = 0; index < linearDegrees.length; index++) {
        const currentButton = linearDegrees[index];
        currentButton.value = index * 45;
        currentButton.addEventListener("click", () => {
            elementById("linearSlider").value = currentButton.value;
            elementById("linearInput").value = currentButton.value;
            elementById("currentDegree").removeAttribute("id");
            currentButton.id = "currentDegree";
            setMainGradient();
        });
    }
}
const setRgbInputLimit = (colorInputs) => {
    for (let index = 0; index < 3; index++) {
        if (colorInputs[index].value > 255)
            colorInputs[index].value = 255;
        if (colorInputs[index].value < 0)
            colorInputs[index].value = 0;
    }
    if (colorInputs[3].value > 100)
        colorInputs[3].value = 100;
    if (colorInputs[3].value < 0)
        colorInputs[3].value = 0;
};

const setInitialColorButtons = () => {
    const colorButtons = elementsByclass("colorButton");
    for (let index = 0; index < 2; index++) {
        setRandomColor(colorButtons[index]);
        colorButtons[index].setAttribute("onclick", "colorButtonCicked(this)");
    }
    colorButtons[0].id = "activeColor";
};

const initiate = () => {
    setInitialColorButtons();
    setColorCodes();
    updatesToActiveColor();
    setMainGradient();
    addEventListeners();
};

window.onload = initiate;