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

function showToast(message) {
    elementById("toastContainer").style.display = "flex";
    elementById("toastNotify").innerText = message;
    setTimeout(() => elementById("toastContainer").style.display = "none", 700);
}

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
    return {
        red: elementById("redSlider").value,
        green: elementById("greenSlider").value,
        blue: elementById("blueSlider").value,
        alpha: elementById("alphaSlider").value
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

const setColorCodeElements = () => {
    const colorCodeElements = getColorCodeElements();
    const {
        red,
        green,
        blue,
        alpha
    } = getSliderRgbaValue();
    const hex = rgbaToHex(red, green, blue, alpha);
    const hsla = rgbatohsla(red, green, blue, alpha);
    const cmyk = rgbToCmyk(red, green, blue);
    colorCodeElements[0].value = getRgbaString(red, green, blue, alpha);
    colorCodeElements[1].value = getHexString(hex);
    colorCodeElements[2].value = getHslaString(hsla.hue, hsla.sat, hsla.light, hsla.alpha);
    colorCodeElements[3].value = getCmykString(cmyk.cyan, cmyk.magenta, cmyk.yellow, cmyk.konsant);
}

function updatesToActiveColor() {
    const colorSliders = getColorSliders();
    const colorInputs = getColorInputs();
    const rgba = getBackgroundColor(getActiveColorButton());
    elementById("hexInput").value = rgbaToHex(rgba[0], rgba[1], rgba[2], rgba[3]);
    for (let index = 0; index < 4; index++) {
        colorSliders[index].value = rgba[index];
        colorInputs[index].value = rgba[index];
    }
    const currentColor = getRgbaString(rgba[0], rgba[1], rgba[2], rgba[3]);
    elementById("colorWindow").style.backgroundImage = `linear-gradient(90deg, ${currentColor}, ${currentColor}),${transparentImage}`;
    setColorCodeElements();
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

const isHexValid = (hexValue) => {
    const hexRegEx = RegExp(`^([A-F0-9]{3}|[A-F0-9]{6}|[A-F0-9]{8})$`);
    return hexRegEx.test(hexValue);
};

function updatesByHex(hexValue) {
    getActiveColorButton().style.backgroundColor = getHexString(hexValue);
    updatesToActiveColor();
}

function gradientColorsSpacing() {
    let spaceValue = "space-around";
    if (getGradientColors().length > 4) {
        spaceValue = "space-between";
    }
    gradientColorsRow().style.justifyContent = spaceValue;
}

const addEventListeners = () => {
    const colorSliders = getColorSliders();
    const colorInputs = getColorInputs();
    const colorCodeElements = getColorCodeElements();
    const colorCodeCopyButton = getColorCodeCopy();
    const hexInput = elementById("hexInput");

    hexInput.addEventListener('change', () => {
        let hex = hexInput.value;
        if (!isHexValid(hex)) {
            const rgba = getBackgroundColor(getActiveColorButton());
            hex = rgbaToHex(rgba[0], rgba[1], rgba[2], rgba[3]);
        } else if (hex.length == 3)
            hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}FF`;
        hexInput.value = hex;
    });

    hexInput.addEventListener('input', () => {
        const inputRegEx = RegExp(`[^A-Fa-f0-9]`, 'g');
        const hex = hexInput.value.replace(inputRegEx, "").slice(0, 8).toUpperCase();
        if (isHexValid(hex))
            updatesByHex(hex);
        hexInput.value = hex;
    });

    for (let index = 0; index < 4; index++) {
        colorSliders[index].addEventListener('input', () => {
            colorInputs[index].value = colorSliders[index].value;
            changeBoxColor();
            setColorCodeElements();
            changeActiveButtonColor();
            updatesToActiveColor();
        });

        colorInputs[index].addEventListener('input', () => {
            if (index == 3) {
                setInputLimit(colorInputs[index], 0, 100);
            } else {
                setInputLimit(colorInputs[index], 0, 255);
            }
            if (colorInputs[index].value != "") {
                colorSliders[index].value = colorInputs[index].value;
                changeBoxColor();
                setColorCodeElements();
                changeActiveButtonColor();
                updatesToActiveColor();
            }
        });

        colorCodeCopyButton[index].addEventListener("click", () => {
            function listener(event) {
                event.clipboardData.setData("text/plain", colorCodeElements[index].value);
                event.preventDefault();
            }
            document.addEventListener("copy", listener);
            document.execCommand("copy");
            document.removeEventListener("copy", listener);
            showToast("Copied");
        });
    }

    const linearSlider = elementById("linearSlider");
    const linearInput = elementById("linearInput");
    linearSlider.addEventListener('input', () => {
        linearInput.value = linearSlider.value;
        changeLinearDegree(linearSlider, linearDegrees);
    });

    linearInput.addEventListener('input', () => {
        setInputLimit(linearInput, 0, 359);
        linearSlider.value = linearInput.value;
        changeLinearDegree(linearSlider, linearDegrees);
    });

    const linearDegrees = elementById("linearDirections").children;
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

    const radialDirection = getRadialDirections();
    for (let index = 0; index < radialDirection.length; index++) {
        radialDirection[index].setAttribute("onclick", "radialDirectionSwitch(this);setMainGradient()");
        radialDirection[index].setAttribute("onfocus", "this.click()");
    }

    elementById("gradientCopyButton").addEventListener('click', () => {
        function listener(event) {
            event.clipboardData.setData("text/plain", elementById('gradientCode').innerText);
            event.preventDefault();
        }
        document.addEventListener("copy", listener);
        document.execCommand("copy");
        document.removeEventListener("copy", listener);
        showToast('Copied')
    });
    elementById("leftShift").addEventListener("click", () => {
        if (getActiveColorButton().value > 0)
            swapColors("left");
    });
    elementById("rightShift").addEventListener("click", () => {
        if (getActiveColorButton().value < getGradientColors().length - 1)
            swapColors("right");
    });

    elementById("deleteColor").addEventListener("click", () => {
        const gradientColors = getGradientColors();
        if (gradientColors.length > 2) {
            let currentIndex = Number(getActiveColorButton().value);
            gradientColors[currentIndex].remove();
            if (currentIndex === gradientColors.length) {
                currentIndex--;
            } else
                for (let index = currentIndex; index < gradientColors.length; index++) {
                    gradientColors[index].value = index;
                }
            gradientColors[currentIndex].id = "activeColor";
            setMainGradient();
            updatesToActiveColor();
            gradientColorsSpacing();
        }
    });

    elementById("addColorButton").addEventListener("click", () => {
        getNewColorButton(true);
        gradientColorsSpacing();
        updatesToActiveColor();
    });

    elementById("loadButton").addEventListener("click", () => {
        if (localStorage.getItem('settings') != null) {
            applySavedGradient();
            updatesToActiveColor();
            showToast(`Gradient Restored`);
        } else {
            showToast(`Save some gradient`);
        }
    });
};

const swapColors = (shiftDirection) => {
    let colorList = getGradientColors();
    const currentIndex = Number(getActiveColorButton().value);
    const temp = colorList[currentIndex].style.backgroundColor;
    let colorToSwap = colorList[currentIndex + 1];
    if (shiftDirection === "left") {
        colorToSwap = colorList[currentIndex - 1];
    }
    colorList[currentIndex].style.backgroundColor = colorToSwap.style.backgroundColor;
    colorToSwap.style.backgroundColor = temp;
    colorList[currentIndex].removeAttribute('id');
    colorToSwap.id = "activeColor";
    setMainGradient();
};

const setInputLimit = (element, lowerLimit, upperLimit) => {
    if (element.value > upperLimit) {
        element.value = upperLimit;
    }
    if (element.value < lowerLimit) {
        element.value = lowerLimit;
    }
}
const setColorPallete = () => {
    const colors = ['EB808E', 'C0C0D8', '53C6A9', 'AF3C44', '80BFFF', 'FF99BB', '17918A', '31F26E', 'E0C145', 'CC397B', 'EA9482'];
    for (let index = 0; index < 11; index++) {
        let newColor = document.createElement("button");
        newColor.className = "preset-color";
        newColor.style.backgroundColor = `#${colors[index]}FF`;
        newColor.setAttribute("onclick", "palleteColorChoosed(this)");
        elementById("colorPallete").appendChild(newColor);
    }
    let newColor = document.createElement("button");
    newColor.className = "preset-color";
    newColor.title = "random color";
    newColor.addEventListener('click', () => {
        setRandomColor(getActiveColorButton());
        updatesToActiveColor();
    });
    elementById("colorPallete").appendChild(newColor);
};

function toggleActives(gradientSetting, active, inActive, id) {
    gradientSetting[active].id = id;
    gradientSetting[inActive].removeAttribute('id');
}

const applySavedGradient = () => {
    const gradientData = JSON.parse(localStorage.getItem('settings'));
    if (gradientData == null) return;
    const gradientColors = localStorage.getItem('colours');
    gradientColorsRow().innerHTML = gradientColors;

    function retrieveLinearSettigs(gradientSetting) {
        toggleActives(gradientSetting, 0, 1, "activeType");
        elementById('linearInput').value = gradientData.linearDegree;
        elementById('linearSlider').value = gradientData.linearDegree;
        elementById('linearDiv').style.display = "flex"
        elementById('radialDiv').style.display = "none"
    }

    function retrieveRadialSettigs(gradientSetting) {
        const radialType = elementsByclass('radialType');
        const radialDirections = getRadialDirections();
        toggleActives(gradientSetting, 1, 0, "activeType");
        if (gradientData.radialShape == "circle")
            toggleActives(radialType, 0, 1, "activeShape");
        else
            toggleActives(radialType, 1, 0, "activeShape");
        elementById('linearDiv').style.display = "none"
        elementById('radialDiv').style.display = "flex"
        for (let index = 0; index < radialDirections.length; index++) {
            if (radialDirections[index].value == gradientData.radialDirection) {
                radialDirections[index].id = "currentDirection";
                index = radialDirections.length;
            } else
                radialDirections[index].removeAttribute('id');
        }
    }

    const gradientType = elementsByclass('gradientType');
    if (gradientData.activeType == 'linear') {
        retrieveLinearSettigs(gradientType);
    } else {
        retrieveRadialSettigs(gradientType);
    }
    elementById("gradient").style.backgroundImage = `${getGradientString()}, ${transparentImage}`;
    elementById("gradientCode").innerText = `background-image : ${getGradientString()};`;
};

const setLocalData = () => {
    if (localStorage.getItem('autosave') == 'true') {
        applySavedGradient();
        elementById('autosave').checked = true;
    } else {
        elementById('autosave').checked = false;
    }
};

function getNewColorButton(switchAciveColor = false) {
    let newColorButton = document.createElement("button");
    newColorButton.className = "colorButton";
    newColorButton.innerText = "gradient";
    setRandomColor(newColorButton);
    newColorButton.setAttribute("onclick", "colorButtonCicked(this)");
    newColorButton.setAttribute("onfocus", "this.click()");
    newColorButton.value = getGradientColors().length;
    if (switchAciveColor)
        switchActiveColor(newColorButton);
    gradientColorsRow().appendChild(newColorButton);
}

const setInitialGradientColors = () => {
    getNewColorButton(true);
    getNewColorButton();
};

const initiate = () => {
    setInitialGradientColors();
    setColorPallete();
    setLocalData();
    updatesToActiveColor();
    addEventListeners();
    const userColors = elementsByclass("user-color");
    for (let index = 0; index < userColors.length; index++) {
        userColors[index].addEventListener("mouseenter", () => {
            const html = `<button>&check;</button><button>&cross;</button>`;
            userColors[index].innerHTML = html;
        });
        userColors[index].addEventListener("mouseleave", () => {
            const html = ``;
            userColors[index].innerHTML = html;
        });
    }
    const userGradient = elementsByclass("user-grad");
    for (let index = 0; index < userGradient.length; index++) {
        userGradient[index].addEventListener("mouseenter", () => {
            const html = `<button>&check;</button><button>&cross;</button>`;
            userGradient[index].innerHTML = html;
        });
        userGradient[index].addEventListener("mouseleave", () => {
            const html = ``;
            userGradient[index].innerHTML = html;
        });
    }
};

window.onload = initiate;