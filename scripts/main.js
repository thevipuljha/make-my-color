const elementById = (id) => document.getElementById(id);
const elementsByClass = (className) => document.getElementsByClassName(className);
const getLocalItem = (key) => localStorage.getItem(key);
const setLocalItem = (key, value) => localStorage.setItem(key, value);

const gradientColorsRow = () => elementById("gradientColors");
const getGradientColors = () => elementsByClass("colorButton");
const getActiveColorButton = () => elementById("activeColor");

const getHslaSliders = () => elementsByClass("hsla-slider");
const getHslaInputs = () => elementsByClass("hsla-input");
const getRgbInputs = () => elementsByClass("rgb-input");

const getRadialDirections = () => elementById("radialDirections").children;
const getColorPaletteButtons = () => elementsByClass("preset-color");
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
        const rgba = getBackgroundColor(colorButtons[index], "rgb");
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

const createElement = (tag, classname, background) => {
    const newElement = document.createElement(tag);
    if (typeof (classname) == "object")
        classname.forEach(currentValue => {
            newElement.classList.add(currentValue);
        });
    else
        newElement.className = classname;
    if (typeof (background) != "undefined")
        newElement.style.background = background;
    return newElement;
};

function getBackgroundColor(domElelment, colorType) {
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
    if (colorType == "rgb") {
        return [red, green, blue, alpha];
    } else if (colorType == "hex") {
        return rgbaToHex(red, green, blue, alpha);
    }
};

const getCurrentGradientObj = () => {
    return {
        gradientColors: elementById('gradientColors').innerHTML,
        activeType: getActiveType().value,
        linearDegree: getLinearDegree(),
        radialShape: getRadialShape().value,
        radialDirection: getCurrentRadialDirection().value
    }
};

const saveGradientData = () => {
    if (elementById('autosave').checked) {
        const gradientData = getCurrentGradientObj();
        setLocalItem('autoGradient', JSON.stringify(gradientData));
    }
    setLocalItem('autosave', elementById('autosave').checked);
};

const setMainGradient = () => {
    elementById("gradient").style.background = getGradientString();
    elementById("gradientCode").innerText = `background : ${getGradientString()};`;
    saveGradientData();
};

const getSliderHslaValue = () => {
    const hslaSliders = getHslaSliders();
    return {
        hue: hslaSliders[0].value,
        sat: hslaSliders[1].value,
        light: hslaSliders[2].value,
        alpha: hslaSliders[3].value / 100
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
    const hsla = getSliderHslaValue();
    const fullColor = `#${hslaToHex(hsla.hue,hsla.sat,hsla.light,100)}`;
    const currentColor = `#${hslaToHex(hsla.hue,hsla.sat,hsla.light,hsla.alpha)}`;
    elementById("satSlider").style.backgroundImage = `linear-gradient(90deg, ${getHslaString(hsla.hue,0,hsla.light,100)}, ${getHslaString(hsla.hue,100,hsla.light,100)})`;
    elementById("alphaSlider").style.background = `linear-gradient(90deg, transparent,${fullColor})`;
    document.documentElement.style.setProperty("--active-color", currentColor);
}

const changeActiveButtonColor = () => {
    const hsla = getSliderHslaValue();
    getActiveColorButton().style.backgroundColor = getHslaString(hsla.hue, hsla.sat, hsla.light, hsla.alpha);
};

function getForegroundColor(rgb) {
    const sum = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
    return (sum > 128) ? '#222222' : '#dddddd';
}

function updatesByActiveColor(changeSlider = true) {
    const rgba = getBackgroundColor(getActiveColorButton(), "rgb");
    const rgbInputs = getRgbInputs();
    for (let index = 0; index < rgbInputs.length; index++) {
        rgbInputs[index].value = rgba[index];
    }
    const hex = getBackgroundColor(getActiveColorButton(), "hex");
    elementById("hexInput").value = hex;
    if (changeSlider) {
        const hsla = rgbatohsla(rgba[0], rgba[1], rgba[2], rgba[3]);
        const hslaSliders = getHslaSliders();
        hslaSliders[0].value = hsla.hue;
        hslaSliders[1].value = hsla.sat;
        hslaSliders[2].value = hsla.light;
        hslaSliders[3].value = hsla.alpha * 100;
        const hslaInputs = getHslaInputs();
        for (let index = 0; index < 4; index++) {
            hslaInputs[index].value = hslaSliders[index].value;
        }
    }
    document.documentElement.style.setProperty("--active-color", getHexString(hex));
    const fontColor = getForegroundColor(rgba);
    document.documentElement.style.setProperty("--font-color", fontColor);
    setMainGradient();
}

function colorButtonCicked(colorButton) {
    switchActiveColor(colorButton);
    updatesByActiveColor();
}

function palleteColorChoosed(palleteColor) {
    getActiveColorButton().style.backgroundColor = palleteColor.style.backgroundColor;
    updatesByActiveColor();
}

function applySavedColor(hexColor) {
    getActiveColorButton().style.backgroundColor = hexColor;
    updatesByActiveColor();
    showToast(`${hexColor} Applied`);
}

function deleteSavedColor(colorID) {
    let userColorList = JSON.parse(getLocalItem("userColorList"));
    elementById(colorID).remove();
    if (userColorList.length == 1) {
        localStorage.removeItem("userColorList");
        const colorListContainer = elementById("userColors");
        colorListContainer.classList.add("empty-list");
        colorListContainer.innerHTML = "Save Some Colors";
    } else {
        const indexToDelete = userColorList.indexOf(colorID);
        userColorList.splice(indexToDelete, 1);
        setLocalItem("userColorList", JSON.stringify(userColorList));
    }
    showToast(`${colorID} Deleted`);
}

function deleteSavedGradient(gradientId) {
    let userGradList = JSON.parse(getLocalItem("userGradList"));
    elementById(gradientId).remove();
    showToast(`Gradient Deleted`);
    if (userGradList.length == 1) {
        localStorage.removeItem("userGradList");
        const gradListContainer = elementById("userGradients");
        gradListContainer.classList.add("empty-list");
        gradListContainer.innerHTML = "Save Some Gradients";
    } else {
        for (let index = 0; index < userGradList.length; index++) {
            if (userGradList[index].gradientID == gradientId) {
                userGradList.splice(index, 1);
                setLocalItem("userGradList", JSON.stringify(userGradList));
                return;
            }
        }
    }
}

function applySavedUserGradient(gradientId) {
    const userGradList = JSON.parse(getLocalItem("userGradList"));
    let userGradient;
    userGradList.forEach(gradientObj => {
        if (gradientObj.gradientID == gradientId) {
            userGradient = gradientObj;
        }
    });
    applySavedGradientData(userGradient);
    updatesByActiveColor();
}

const getUserColorContainer = (hexColor) => {
    const colorContainer = createElement("div", "user-color-container");
    colorContainer.id = hexColor;
    const userColorBg = createElement("div", "user-div-bg");

    const userColor = createElement("div", "user-color", hexColor);
    userColor.addEventListener("mouseenter", () => {
        const html = `<button class="user-color-apply" value="${hexColor}" onclick="applySavedColor(this.value)"><i class="gi gi-apply"></i></button>
                      <button class="user-color-delete" value="${hexColor}" onclick="deleteSavedColor(this.value)"><i class="gi gi-remove"></i></button>`;
        userColor.innerHTML = html;
    });
    userColor.addEventListener("mouseleave", () => {
        userColor.innerHTML = "";
    });

    const userColorInfo = createElement("button", "user-color-info");
    userColorInfo.title = "Copy Hex";
    userColorInfo.innerText = hexColor;
    userColorInfo.style.border = `3px solid ${hexColor}`;
    userColorInfo.addEventListener("click", () => {
        function listener(event) {
            event.clipboardData.setData("text/plain", hexColor);
            event.preventDefault();
        }
        document.addEventListener("copy", listener);
        document.execCommand("copy");
        document.removeEventListener("copy", listener);
        showToast(`${hexColor} Copied`)
    });
    userColorBg.append(userColor);
    colorContainer.append(userColorBg, userColorInfo);
    return colorContainer;
};

const getUserGradContainer = (gradientId, gradientCode) => {
    let gradContainer = createElement("div", "user-grad-container");
    gradContainer.id = gradientId;
    let userGradBg = createElement("div", "user-div-bg");

    let userGrad = createElement("div", "user-grad", gradientCode);

    userGrad.addEventListener("mouseenter", () => {
        const html = `<button class="user-grad-apply" value="${gradientId}" onclick="applySavedUserGradient(this.value)"><i class="gi gi-apply"></i></button>
                  <button class="user-grad-delete" value="${gradientId}" onclick="deleteSavedGradient(this.value)"><i class="gi gi-remove"></i></button>`;
        userGrad.innerHTML = html;
    });
    userGrad.addEventListener("mouseleave", () => {
        userGrad.innerHTML = "";
    });

    let userGradCopy = createElement("button", "user-grad-copy");
    userGradCopy.title = "Copy Gradient";
    userGradCopy.innerHTML = `<i class="gi gi-copy"></i>Copy`;
    userGradCopy.addEventListener("click", () => {
        function listener(event) {
            event.clipboardData.setData("text/plain", `background : ${gradientCode};`);
            event.preventDefault();
        }
        document.addEventListener("copy", listener);
        document.execCommand("copy");
        document.removeEventListener("copy", listener);
        showToast(`Gradient Code Copied`)
    });
    userGradBg.appendChild(userGrad);
    gradContainer.append(userGradBg, userGradCopy);
    return gradContainer;
};

function isUserGradExists(userGradList, gradientId) {
    let matchResult = false;
    userGradList.forEach(gradient => {
        if (gradient.gradientID == gradientId)
            matchResult = true;
    });
    return matchResult;
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
    updatesByActiveColor();
}

function gradientColorsSpacing() {
    let spaceValue = "space-around";
    if (getGradientColors().length > 4) {
        spaceValue = "space-between";
    }
    gradientColorsRow().style.justifyContent = spaceValue;
}

function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function makeGradientId(gradientCode) {
    let tempArray = gradientCode.split(",");
    let gradientID = tempArray[0].split("(")[1];
    for (let index = 1; index < tempArray.length; index++) {
        gradientID = gradientID + tempArray[index];
    }
    return gradientID.replace(RegExp(`[ #)]`, 'g'), "");
}

const addEventListeners = () => {
    const hslaSliders = getHslaSliders();
    const hslaInputs = getHslaInputs();
    const rgbInputs = getRgbInputs();
    const hexInput = elementById("hexInput");
    const toTopButton = document.getElementById("toTop");

    window.onscroll = function () {
        if (document.body.scrollTop > 120 || document.documentElement.scrollTop > 120) {
            toTopButton.style.display = "grid";
        } else {
            toTopButton.style.display = "none";
        }
    };

    hexInput.addEventListener('change', () => {
        let hex = hexInput.value;
        if (!isHexValid(hex)) {
            hex = getBackgroundColor(getActiveColorButton(), "hex");
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
        hslaSliders[index].addEventListener('input', () => {
            hslaInputs[index].value = hslaSliders[index].value;
            changeBoxColor();
            changeActiveButtonColor();
            updatesByActiveColor(false);
        });

        hslaInputs[index].addEventListener('input', () => {
            if (index == 0) {
                setInputLimit(hslaInputs[index], 0, 359);
            } else {
                setInputLimit(hslaInputs[index], 0, 100);
            }
            hslaSliders[index].value = hslaInputs[index].value;
            changeBoxColor();
            changeActiveButtonColor();
            updatesByActiveColor(false);
        });
        if (index != 3) {
            rgbInputs[index].addEventListener('input', () => {
                setInputLimit(rgbInputs[index], 0, 255);
                const red = rgbInputs[0].value;
                const green = rgbInputs[1].value;
                const blue = rgbInputs[2].value;
                const alpha = hslaSliders[3].value;
                getActiveColorButton().style.backgroundColor = getRgbaString(red, green, blue, alpha);
                updatesByActiveColor();
            });
        }
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
            elementsByClass("color-buttons-gap")[currentIndex + 1].remove();
            if (currentIndex === gradientColors.length) {
                currentIndex--;
            } else
                for (let index = currentIndex; index < gradientColors.length; index++) {
                    gradientColors[index].value = index;
                }
            gradientColors[currentIndex].id = "activeColor";
            setMainGradient();
            updatesByActiveColor();
            gradientColorsSpacing();
        }
    });

    elementById("addColorButton").addEventListener("click", () => {
        addNewColorButton(true);
        gradientColorsSpacing();
        updatesByActiveColor();
        elementById("colorBlockContainer").scrollLeft = elementById("colorBlockContainer").scrollWidth;
    });

    elementById("loadButton").addEventListener("click", () => {
        const gradientData = getLocalItem('autoGradient');
        if (gradientData == null) {
            showToast(`Save some gradient`);
            return;
        }
        applySavedGradientData(JSON.parse(gradientData))
        updatesByActiveColor();
        showToast(`Gradient Restored`);
    });

    elementById("addUserColor").addEventListener("click", () => {
        const hex = `#${getBackgroundColor(getActiveColorButton(), "hex")}`;
        let userColorList = getLocalItem("userColorList");
        if (userColorList == null) {
            userColorList = new Array();
        } else {
            userColorList = JSON.parse(userColorList);
        }
        if (userColorList.indexOf(hex) != -1) {
            showToast("Color already saved");
            return;
        }
        userColorList.push(hex);
        setLocalItem("userColorList", JSON.stringify(userColorList));

        let colorListContainer = elementById("userColors");
        if (colorListContainer.classList.contains("empty-list")) {
            colorListContainer.classList.remove("empty-list");
            colorListContainer.innerHTML = "";
        }
        const colorContainer = getUserColorContainer(hex);
        colorListContainer.appendChild(colorContainer);
        elementById("userColors").scrollTop = elementById("userColors").scrollHeight;
    });

    elementById("addUserGrad").addEventListener("click", () => {
        let userGradList = getLocalItem("userGradList");
        if (userGradList == null) {
            userGradList = new Array();
        } else {
            userGradList = JSON.parse(userGradList);
        }
        const codeSwitch = elementById("codeSwitch");
        const codeSwitchState = codeSwitch.checked;
        codeSwitch.checked = "true";
        const currentGradientCode = getGradientString();
        const gradientId = makeGradientId(currentGradientCode);
        if (isUserGradExists(userGradList, gradientId)) {
            showToast("Gradient already saved");
        } else {
            let gradientData = getCurrentGradientObj();
            gradientData["gradientID"] = gradientId;
            gradientData["gradientCode"] = currentGradientCode;
            userGradList.push(gradientData);
            setLocalItem("userGradList", JSON.stringify(userGradList));

            let gradListContainer = elementById("userGradients");
            if (gradListContainer.classList.contains("empty-list")) {
                gradListContainer.innerHTML = "";
                gradListContainer.classList.remove("empty-list");
            }
            const gradContainer = getUserGradContainer(gradientId, currentGradientCode);
            gradListContainer.appendChild(gradContainer);
            elementById("userGradients").scrollTop = elementById("userGradients").scrollHeight;
        }
        codeSwitch.checked = codeSwitchState;
    });
};

function setUserGradients() {
    let userGradList = getLocalItem("userGradList");
    let gradListContainer = elementById("userGradients");
    if (userGradList != null) {
        userGradList = JSON.parse(userGradList);
        for (let index = 0; index < userGradList.length; index++) {
            const currentGradientCode = userGradList[index].gradientCode;
            const gradientId = makeGradientId(currentGradientCode);
            const gradContainer = getUserGradContainer(gradientId, currentGradientCode);
            gradListContainer.appendChild(gradContainer);
        }
    } else {
        gradListContainer.classList.add("empty-list");
        gradListContainer.innerHTML = "Save Some Gradients";
    }
}

function setUserColors() {
    let userColorList = getLocalItem("userColorList");
    let colorListContainer = elementById("userColors");
    if (userColorList == null) {
        colorListContainer.classList.add("empty-list");
        colorListContainer.innerHTML = "Save Some Colors";
        return;
    }
    userColorList = JSON.parse(userColorList);
    for (let index = 0; index < userColorList.length; index++) {
        const hex = userColorList[index];
        const colorContainer = getUserColorContainer(hex)
        colorListContainer.appendChild(colorContainer);
    }

}

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
    if (element.value >= upperLimit) {
        element.value = upperLimit;
    }
    if (element.value <= lowerLimit) {
        element.value = lowerLimit;
    }
}

function applySavedGradientData(gradientData) {
    gradientColorsRow().innerHTML = gradientData.gradientColors;

    function toggleActives(gradientSetting, active, inActive, id) {
        gradientSetting[active].id = id;
        gradientSetting[inActive].removeAttribute('id');
    }

    function retrieveLinearSettigs(gradientSetting) {
        toggleActives(gradientSetting, 0, 1, "activeType");
        elementById('linearInput').value = gradientData.linearDegree;
        elementById('linearSlider').value = gradientData.linearDegree;
        elementById('linearDiv').style.display = "flex"
        elementById('radialDiv').style.display = "none"
    }

    function retrieveRadialSettigs(gradientSetting) {
        const radialTypeButton = elementsByClass('radialTypeButton');
        const radialDirections = getRadialDirections();
        toggleActives(gradientSetting, 1, 0, "activeType");
        if (gradientData.radialShape == "circle")
            toggleActives(radialTypeButton, 0, 1, "activeShape");
        else
            toggleActives(radialTypeButton, 1, 0, "activeShape");
        elementById('linearDiv').style.display = "none"
        elementById('radialDiv').style.display = "flex"
        for (let index = 0; index < radialDirections.length; index++) {
            if (radialDirections[index].value == gradientData.radialDirection) {
                radialDirections[index].id = "currentDirection";
            } else
                radialDirections[index].removeAttribute('id');
        }
    }

    const gradientTypeButton = elementsByClass('gradientTypeButton');
    if (gradientData.activeType == 'linear') {
        retrieveLinearSettigs(gradientTypeButton);
    } else {
        retrieveRadialSettigs(gradientTypeButton);
    }
    elementById("gradient").style.background = getGradientString();
    elementById("gradientCode").innerText = `background : ${getGradientString()};`;
}

const setSliderBackgrounds = () => {
    const sliders = getHslaSliders();
    const hsla = getSliderHslaValue();
    sliders[0].style.background = `linear-gradient(90deg, #F00 0%, #FF0 16.66%, #0F0 33.33%, #0FF 50%, #00F 66.66%, #F0F 83.33%, #F00 100%)`;
    sliders[1].style.background = `linear-gradient(90deg, ${getHslaString(hsla.hue,0,hsla.light,100)}, ${getHslaString(hsla.hue,100,hsla.light,100)})`;
    sliders[2].style.background = `linear-gradient(90deg, black, white)`;
};

const setLocalData = () => {
    const autosaveState = getLocalItem('autosave');
    if (autosaveState == null) {
        elementById('autosave').checked = true;
        return;
    }
    if (autosaveState === 'false') {
        elementById('autosave').checked = false;
        return;
    }
    const gradientData = getLocalItem('autoGradient');
    if (gradientData != null)
        applySavedGradientData(JSON.parse(gradientData));
    elementById('autosave').checked = true;
};

const setColorPallete = () => {
    const pallete = elementById("colorPallete");
    const colors = ['EB808E', 'C0C0D8', '53C6A9', 'AF3C44', '80BFFF', 'FF99BB', '17918A', '31F26E', 'E0C145', 'CC397B', 'EA9482'];
    for (let index = 0; index < 11; index++) {
        const newColor = createElement("button", "preset-color", `#${colors[index]}FF`);
        newColor.setAttribute("onclick", "palleteColorChoosed(this)");
        pallete.appendChild(newColor);
    }
    const newColor = createElement("button", ["preset-color", "gi", "gi-random"]);
    newColor.title = "random color";
    newColor.addEventListener('click', () => {
        setRandomColor(getActiveColorButton());
        updatesByActiveColor();
    });
    pallete.appendChild(newColor);
};

function addNewColorButton(activeColor = false) {
    const colorButton = createElement("button", "colorButton");
    colorButton.innerText = "gradient";
    setRandomColor(colorButton);
    colorButton.setAttribute("onclick", "colorButtonCicked(this)");
    colorButton.setAttribute("onfocus", "this.click()");
    colorButton.value = getGradientColors().length;
    if (activeColor)
        switchActiveColor(colorButton);
    const colorButtonGap = createElement("div", "color-buttons-gap");
    gradientColorsRow().append(colorButton, colorButtonGap);
}

const setInitialGradientColors = () => {
    addNewColorButton(true);
    addNewColorButton();
};

const initiate = () => {
    setInitialGradientColors();
    setColorPallete();
    setLocalData();
    updatesByActiveColor();
    setUserColors();
    setUserGradients();
    addEventListeners();
    setSliderBackgrounds();
    changeBoxColor();
};

window.onload = initiate;