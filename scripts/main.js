const elementById = (id) => document.getElementById(id);
const elementsByclass = (className) => document.getElementsByClassName(className);
const transparentImage = "url(https://vipul1142.github.io/make-my-color/images/transparentImage.png)";
// const transparentImage = "url(../images/transparentImage.png)";
const gradientColorsRow = () => elementById("gradientColors");
const getGradientColors = () => elementsByclass("colorButton");
const getActiveColorButton = () => elementById("activeColor");

const getColorSliders = () => elementsByclass("color-slider");
const getColorInputs = () => elementsByclass("color-input");
const getColorCodeElements = () => elementsByclass("colorCodes");
const getColorCodeCopy = () => elementsByclass("colorCodesCopy");
const getRadialDirections = () => elementById("radialDirections").children;
const getColorPaletteButtons = () => elementsByclass("preset-color");
const getActiveType = () => elementById("activeType");
const getLinearDegree = () => elementById("linearSlider").value;
const getRadialShape = () => elementById("activeShape");
const getCurrentRadialDirection = () => elementById("currentDirection");

function switchActiveColor(currentActiveColor) {
    const previousActiveColor = getActiveColorButton();
    if (previousActiveColor != null)
        previousActiveColor.removeAttribute("id");
    currentActiveColor.id = "activeColor";
}

function getNewColorButton(switchAciveColor = false) {
    let newColorButton = document.createElement("button");
    newColorButton.className = "colorButton";
    newColorButton.innerText = "gradient";
    setRandomColor(newColorButton);
    newColorButton.setAttribute("onclick", "colorButtonCicked(this)");
    newColorButton.setAttribute("onfocus", "this.click()");
    if (switchAciveColor)
        switchActiveColor(newColorButton);
    gradientColorsRow().appendChild(newColorButton);
}

const getGradientString = () => {
    const colorButtons = getGradientColors();
    const type = getActiveType().value;
    let gradientString = type + "-gradient(";
    if (type == "linear") {
        gradientString += `${getLinearDegree()}deg`;
    }
    if (type == "radial") {
        gradientString += `${getRadialShape().value} at ${getCurrentRadialDirection().value}`;
    }
    const isHex = elementById("codeSwitch").checked;
    for (let index = 0; index < colorButtons.length; index++) {
        const rgba = getBackgroundColor(colorButtons[index]);
        if (isHex) {
            gradientString += `, ${getHexString(rgbaToHex(rgba[0],rgba[1],rgba[2],rgba[3]))}`;
        } else {
            gradientString += `, ${getRgbaString(rgba[0],rgba[1],rgba[2],rgba[3])}`;
        }
    }
    return gradientString + ')';
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

const saveGradientData = () => {
    if (elementById('autosave').checked) {
        const gradientColors = elementById('gradientColors').innerHTML;
        const gradientData = {
            activeType: getActiveType().value,
            linearDegree: getLinearDegree(),
            radialShape: getRadialShape().value,
            radialDirection: getCurrentRadialDirection().value
        }
        localStorage.setItem('colours', gradientColors);
        localStorage.setItem('settings', JSON.stringify(gradientData));
    }
    localStorage.setItem('autosave', elementById('autosave').checked);
};

const setMainGradient = () => {
    elementById("gradient").style.backgroundImage = `${getGradientString()}, ${transparentImage}`;
    elementById("gradientCode").innerText = `background-image : ${getGradientString()};`;
    saveGradientData();
};

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
    getCurrentRadialDirection().removeAttribute("id");
    activeButton.id = "currentDirection";
};

const changeBoxColor = () => {
    const rgba = getSliderRgbaValue();
    const currentColor = `rgba(${rgba.red},${rgba.green},${rgba.blue},${(rgba.alpha)/100})`;
    elementById("alphaSlider").style.backgroundImage = `linear-gradient(90deg, #FFFFFF00,rgb(${rgba.red},${rgba.green},${rgba.blue})),${transparentImage}`;
    elementById("colorWindow").style.backgroundImage = `linear-gradient(90deg, ${currentColor}, ${currentColor}),${transparentImage}`;
}

const changeActiveButtonColor = () => {
    const colorSliders = getColorSliders();
    const activeButton = getActiveColorButton();
    const rgba = [0, 0, 0, 0].map(func = (value, index) => colorSliders[index].value);
    activeButton.style.backgroundColor = getRgbaString(rgba[0], rgba[1], rgba[2], rgba[3]);
};

const setcolorCodeElements = () => {
    const colorCodeElements = getColorCodeElements();
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
    } = rgbatohsl(red, green, blue, alpha);
    const {
        cyan,
        magenta,
        yellow,
        konsant
    } = rgbToCmyk(red, green, blue);
    colorCodeElements[0].value = getRgbaString(red, green, blue, alpha);
    colorCodeElements[1].value = getHexString(hex);
    colorCodeElements[2].value = getHslaString(hue, sat, light, alpha);
    colorCodeElements[3].value = getCmykString(cyan, magenta, yellow, konsant);
}

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
    setcolorCodeElements();
    setMainGradient();
}

function colorButtonCicked(colorButton) {
    switchActiveColor(colorButton);
    updatesToActiveColor();
}

function palleteColorChoosed(palleteColor) {
    getActiveColorButton().style.backgroundColor = palleteColor.style.backgroundColor;
    updatesToActiveColor();
}

function changeLinearDegree(linearSlider, linearDegrees) {
    const index = Math.floor((linearSlider.value) / 45);
    elementById("currentDegree").removeAttribute("id");
    linearDegrees[index].id = "currentDegree";
    setMainGradient();
}

function changeCodeCopyButton(backgroundColor, text, color) {
    const copyButton = elementById("gradientCopyButton");
    copyButton.style.backgroundColor = backgroundColor;
    copyButton.innerHTML = text;
    copyButton.style.color = color;
}

const addEventListeners = () => {
    const colorSliders = getColorSliders();
    const colorInputs = getColorInputs();
    const colorCodeElements = getColorCodeElements();
    const colorCodeCopy = getColorCodeCopy();
    const linearDegrees = elementById("linearDirections").children;
    const radialDirection = getRadialDirections();
    for (let index = 0; index < 4; index++) {
        colorInputs[index].addEventListener('input', () => {
            if (index != 3) {
                setInputLimit(colorInputs[index], 0, 255);
            } else {
                setInputLimit(colorInputs[index], 0, 100);
            }
            colorSliders[index].value = colorInputs[index].value;
            changeBoxColor();
            setcolorCodeElements();
            changeActiveButtonColor();
            setMainGradient();
        });

        colorSliders[index].addEventListener('input', () => {
            colorInputs[index].value = colorSliders[index].value;
            changeBoxColor();
            setcolorCodeElements();
            changeActiveButtonColor();
            setMainGradient();
        });

        colorCodeCopy[index].addEventListener("click", () => {
            function listener(event) {
                event.clipboardData.setData("text/plain", colorCodeElements[index].value);
                event.preventDefault();
            }
            document.addEventListener("copy", listener);
            document.execCommand("copy");
            document.removeEventListener("copy", listener);
        });
    }
    elementById("addColorButton").addEventListener("click", () => {
        getNewColorButton(true);
        if (getGradientColors().length > 4) {
            gradientColorsRow().style.justifyContent = "space-between";
        }
        updatesToActiveColor();
    });
    const linearSlider = elementById("linearSlider");
    const linearInput = elementById("linearInput");
    linearSlider.addEventListener('input', () => {
        linearInput.value = linearSlider.value;
        changeLinearDegree(linearSlider, linearDegrees);
    });

    linearInput.addEventListener('input', () => {
        setInputLimit(linearInput, 0, 359)
        linearSlider.value = linearInput.value;
        changeLinearDegree(linearSlider, linearDegrees);
    });

    for (let index = 0; index < radialDirection.length; index++) {
        radialDirection[index].setAttribute("onclick", "radialDirectionSwitch(this);setMainGradient()");
        radialDirection[index].setAttribute("onfocus", "this.click()");
    }
    for (let index = 0; index < linearDegrees.length; index++) {
        const currentButton = linearDegrees[index];
        currentButton.value = index * 45;
        currentButton.setAttribute("onfocus", "this.click()");
        currentButton.addEventListener("click", () => {
            elementById("linearSlider").value = currentButton.value;
            elementById("linearInput").value = currentButton.value;
            elementById("currentDegree").removeAttribute("id");
            currentButton.id = "currentDegree";
            setMainGradient();
        });
    }
    elementById("gradientCopyButton").addEventListener('click', () => {
        function listener(event) {
            event.clipboardData.setData("text/plain", elementById('gradientCode').innerText);
            event.preventDefault();
        }
        document.addEventListener("copy", listener);
        document.execCommand("copy");
        document.removeEventListener("copy", listener);
        changeCodeCopyButton("green", "&checkmark;", "white");
        setTimeout(() => changeCodeCopyButton("white", "Copy Code", "black"), 3000);
    });
};
const setInputLimit = (element, lowerLimit, upperLimit) => {
    if (element.value > upperLimit) {
        element.value = upperLimit;
    }
    if (element.value < lowerLimit) {
        element.value = lowerLimit;
    }
};

const setSavedGradientData = () => {
    const gradientData = JSON.parse(localStorage.getItem('settings'));
    if (gradientData != null) {
        const gradientColors = localStorage.getItem('colours');
        gradientColorsRow().innerHTML = gradientColors;
        const gradientType = elementsByclass('gradientType');
        const radialType = elementsByclass('radialType');
        const radialDirections = getRadialDirections();
        for (let index = 0; index < 2; index++) {
            if (gradientType[index].value == gradientData.activeType)
                gradientType[index].id = "activeType";
            else
                gradientType[index].removeAttribute('id');
            if (radialType[index].value == gradientData.radialShape)
                radialType[index].id = "activeShape";
            else
                radialType[index].removeAttribute('id');
        }
        elementById('linearSlider').value = gradientData.linearDegree;
        elementById('linearInput').value = gradientData.linearDegree;
        for (let index = 0; index < radialDirections.length; index++) {
            if (radialDirections[index].value == gradientData.radialDirection) {
                radialDirections[index].id = "currentDirection";
                index = radialDirections.length;
            } else
                radialDirections[index].removeAttribute('id');
        }
        if (getActiveType().value == 'radial') {
            elementById('linearDiv').style.display = "none"
            elementById('radialDiv').style.display = "flex"
        }
        elementById("gradient").style.backgroundImage = `${getGradientString()}, ${transparentImage}`;
        elementById("gradientCode").innerText = `background-image : ${getGradientString()};`;
    }
};

const setLocalData = () => {
    if (localStorage.getItem('autosave') == 'true') {
        setSavedGradientData();
        elementById('autosave').checked = true;
    } else {
        elementById('autosave').checked = false;
    }
};

const setInitialGradientColors = () => {
    getNewColorButton(true);
    getNewColorButton();
};
const setColorPallete = () => {
    const colors = ['EB808E', 'C0C0D8', '53C6A9', 'AF3C44', '80BFFF', 'FF99BB', '17918A', '31F26E', 'E0C145', 'CC397B', 'EA9482'];
    for (let index = 0; index < 12; index++) {
        let newColor = document.createElement("button");
        newColor.className = "preset-color";
        if (index < 11) {
            newColor.style.backgroundColor = `#${colors[index]}FF`;
            newColor.setAttribute("onclick", "palleteColorChoosed(this)");
        } else {
            newColor.title = "random color";
            newColor.innerHTML = "&#x1f500";
            newColor.addEventListener('click', () => {
                setRandomColor(getActiveColorButton());
                updatesToActiveColor();
            });
        }
        elementById("colorPallete").appendChild(newColor);
    }
};

const initiate = () => {
    setInitialGradientColors();
    setColorPallete();
    setLocalData();
    updatesToActiveColor();
    addEventListeners();
};

window.onload = initiate;