const elementById = (id) => document.getElementById(id);
const elementsByClass = (className) => document.getElementsByClassName(className);
const transparentImage = "url(https://vipul1142.github.io/make-my-color/images/transparentImage.png)";
// const transparentImage = "url(../images/transparentImage.png)";
const gradientColorsRow = () => elementById("gradientColors");
const getGradientColors = () => elementsByClass("colorButton");
const getActiveColorButton = () => elementById("activeColor");

const getColorSliders = () => elementsByClass("color-slider");
const getColorInputs = () => elementsByClass("color-input");
const getColorCodeElements = () => elementsByClass("colorCodes");
const getColorCodeCopy = () => elementsByClass("colorCodesCopy");
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
    elementById("gradientCode").innerText = `background : ${getGradientString()};`;
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

function applySavedColor(hexColor) {
    getActiveColorButton().style.backgroundColor = hexColor;
    updatesToActiveColor();
    showToast(`${hexColor} Applied`);
}

function deleteSavedColor(colorID) {
    let userColorList = localStorage.getItem("userColorList").split(",");
    elementById(colorID).remove();
    if (userColorList.length == 1) {
        localStorage.removeItem("userColorList");
        const colorListContainer = elementById("userColors");
        colorListContainer.classList.add("empty-list");
        colorListContainer.innerHTML = "Save Some Colors";
    } else {
        const indexToDelete = userColorList.indexOf(colorID);
        userColorList.splice(indexToDelete, 1);
        localStorage.setItem("userColorList", userColorList);
    }
    showToast(`${colorID} Deleted`);
}

function deleteSavedGradient(gradientId) {
    let userGradList = JSON.parse(localStorage.getItem("userGradList"));
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
                localStorage.setItem("userGradList", JSON.stringify(userGradList));
                return;
            }
        }
    }
}

function applySavedUserGradient(gradientId) {
    const userGradList = JSON.parse(localStorage.getItem("userGradList"));
    let userGradient = {};
    for (let index = 0; index < userGradList.length; index++) {
        if (userGradList[index].gradientID == gradientId) {
            userGradient = userGradList[index];
        }
    }
    gradientColorsRow().innerHTML = userGradient.gradientColors;

    function retrieveLinearSettigs(gradientSetting) {
        toggleActives(gradientSetting, 0, 1, "activeType");
        elementById('linearInput').value = userGradient.linearDegree;
        elementById('linearSlider').value = userGradient.linearDegree;
        elementById('linearDiv').style.display = "flex"
        elementById('radialDiv').style.display = "none"
    }

    function retrieveRadialSettigs(gradientSetting) {
        const radialType = elementsByClass('radialType');
        const radialDirections = getRadialDirections();
        toggleActives(gradientSetting, 1, 0, "activeType");
        if (userGradient.radialShape == "circle")
            toggleActives(radialType, 0, 1, "activeShape");
        else
            toggleActives(radialType, 1, 0, "activeShape");
        elementById('linearDiv').style.display = "none"
        elementById('radialDiv').style.display = "flex"
        for (let index = 0; index < radialDirections.length; index++) {
            if (radialDirections[index].value == userGradient.radialDirection) {
                radialDirections[index].id = "currentDirection";
            } else
                radialDirections[index].removeAttribute('id');
        }
    }

    const gradientType = elementsByClass('gradientType');
    if (userGradient.activeType == 'linear') {
        retrieveLinearSettigs(gradientType);
    } else {
        retrieveRadialSettigs(gradientType);
    }
    elementById("gradient").style.backgroundImage = `${getGradientString()}, ${transparentImage}`;
    elementById("gradientCode").innerText = `background : ${getGradientString()};`;
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

function makeGradientId(gradientCode) {
    let tempArray = gradientCode.split(",");
    let gradientID = tempArray[0].split("(")[1];
    for (let index = 1; index < tempArray.length; index++) {
        gradientID = gradientID + tempArray[index];
    }
    return gradientID.replace(RegExp(`[ #)]`, 'g'), "");
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

    elementById("addUserColor").addEventListener("click", () => {
        const rgba = getBackgroundColor(getActiveColorButton());
        const hex = getHexString(rgbaToHex(rgba[0], rgba[1], rgba[2], rgba[3]));
        let userColorList = localStorage.getItem("userColorList");
        if (userColorList != null) {
            userColorList = userColorList.split(",");
        } else {
            userColorList = [];
        }
        if (userColorList.indexOf(hex) === -1) {
            userColorList.push(hex);
            localStorage.setItem("userColorList", userColorList);
            let colorListContainer = elementById("userColors");
            if (colorListContainer.classList.contains("empty-list")) {
                colorListContainer.innerHTML = "";
                colorListContainer.classList.remove("empty-list");
            }

            let colorContainer = document.createElement("div");
            colorContainer.className = "user-color-container";
            colorContainer.id = hex;

            let userColor = document.createElement("div");
            userColor.className = "user-color";
            userColor.style.backgroundImage = `linear-gradient(90deg, ${hex}, ${hex}),${transparentImage}`;

            userColor.addEventListener("mouseenter", () => {
                const html = `<button class="user-color-apply" value="${hex}" onclick="applySavedColor(this.value)">&check;</button>
                              <button class="user-color-delete" value="${hex}" onclick="deleteSavedColor(this.value)">&cross;</button>`;
                userColor.innerHTML = html;
            });
            userColor.addEventListener("mouseleave", () => {
                userColor.innerHTML = "";
            });

            let userColorInfo = document.createElement("button");
            userColorInfo.className = "user-color-info";
            userColorInfo.title = "Copy Hex";
            userColorInfo.innerText = hex;
            userColorInfo.style.borderColor = hex;
            userColorInfo.addEventListener("click", () => {
                function listener(event) {
                    event.clipboardData.setData("text/plain", hex);
                    event.preventDefault();
                }
                document.addEventListener("copy", listener);
                document.execCommand("copy");
                document.removeEventListener("copy", listener);
                showToast(`${hex} Copied`)
            });

            colorContainer.append(userColor, userColorInfo);
            colorListContainer.appendChild(colorContainer);

        } else {
            showToast("Color already saved");
        }

    });
    elementById("addUserGrad").addEventListener("click", () => {
        let userGradList = localStorage.getItem("userGradList");
        if (userGradList != null) {
            userGradList = JSON.parse(userGradList);
        } else {
            userGradList = [];
        }
        const codeSwitchState = elementById("codeSwitch").checked;
        elementById("codeSwitch").checked = "true";
        const currentGradientCode = getGradientString();
        for (let index = 0; index < userGradList.length; index++) {
            if (userGradList[index].gradientCode == currentGradientCode) {
                showToast("Gradient already saved");
                return;
            }
        }
        const gradientId = makeGradientId(currentGradientCode);
        const gradientData = {
            gradientID: gradientId,
            gradientColors: elementById('gradientColors').innerHTML,
            activeType: getActiveType().value,
            linearDegree: getLinearDegree(),
            radialShape: getRadialShape().value,
            radialDirection: getCurrentRadialDirection().value,
            gradientCode: currentGradientCode
        }
        userGradList.push(gradientData);
        localStorage.setItem("userGradList", JSON.stringify(userGradList));

        let gradListContainer = elementById("userGradients");
        if (gradListContainer.classList.contains("empty-list")) {
            gradListContainer.innerHTML = "";
            gradListContainer.classList.remove("empty-list");
        }

        let gradContainer = document.createElement("div");
        gradContainer.className = "user-grad-container";
        gradContainer.id = gradientId;

        let userGrad = document.createElement("div");
        userGrad.className = "user-grad";
        userGrad.style.backgroundImage = `${currentGradientCode}, ${transparentImage}`;

        userGrad.addEventListener("mouseenter", () => {
            const html = `<button class="user-grad-apply" value="${gradientId}" onclick="applySavedUserGradient(this.value)">&check;</button>
                          <button class="user-grad-delete" value="${gradientId}" onclick="deleteSavedGradient(this.value)">&cross;</button>`;
            userGrad.innerHTML = html;
        });
        userGrad.addEventListener("mouseleave", () => {
            userGrad.innerHTML = "";
        });

        let userGradCopy = document.createElement("button");
        userGradCopy.className = "user-grad-copy";
        userGradCopy.title = "Copy Gradient";
        userGradCopy.innerHTML = `<svg viewBox="0 0 24 24" class="grad-copy" fill-rule="evenodd" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.75 3A1.75 1.75 0 003 4.75v9.5c0 .966.784 1.75 1.75 1.75h1.5a.75.75 0 000-1.5h-1.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.25-.25h9.5a.25.25 0 01.25.25v1.5a.75.75 0 001.5 0v-1.5A1.75 1.75 0 0014.25 3h-9.5zm5 5A1.75 1.75 0 008 9.75v9.5c0 .966.784 1.75 1.75 1.75h9.5A1.75 1.75 0 0021 19.25v-9.5A1.75 1.75 0 0019.25 8h-9.5zM9.5 9.75a.25.25 0 01.25-.25h9.5a.25.25 0 01.25.25v9.5a.25.25 0 01-.25.25h-9.5a.25.25 0 01-.25-.25v-9.5z">
                                    </path></svg>Copy`;
        userGradCopy.addEventListener("click", () => {
            function listener(event) {
                event.clipboardData.setData("text/plain", `background : ${currentGradientCode};`);
                event.preventDefault();
            }
            document.addEventListener("copy", listener);
            document.execCommand("copy");
            document.removeEventListener("copy", listener);
            showToast(`Gradient Code Copied`)
        });

        gradContainer.append(userGrad, userGradCopy);
        gradListContainer.appendChild(gradContainer);

        elementById("codeSwitch").checked = codeSwitchState;
    });
};

function setUserGradients() {
    let userGradList = localStorage.getItem("userGradList");
    let gradListContainer = elementById("userGradients");
    if (userGradList != null) {
        userGradList = JSON.parse(userGradList);
        for (let index = 0; index < userGradList.length; index++) {
            const currentGradientCode = userGradList[index].gradientCode;
            const gradientId = makeGradientId(currentGradientCode);
            let gradContainer = document.createElement("div");
            gradContainer.className = "user-grad-container";
            gradContainer.id = gradientId;

            let userGrad = document.createElement("div");
            userGrad.className = "user-grad";
            userGrad.style.backgroundImage = `${currentGradientCode}, ${transparentImage}`;

            userGrad.addEventListener("mouseenter", () => {
                const html = `<button class="user-grad-apply" value="${gradientId}" onclick="applySavedUserGradient(this.value)">&check;</button>
                          <button class="user-grad-delete" value="${gradientId}" onclick="deleteSavedGradient(this.value)">&cross;</button>`;
                userGrad.innerHTML = html;
            });

            userGrad.addEventListener("mouseleave", () => {
                userGrad.innerHTML = "";
            });

            let userGradCopy = document.createElement("button");
            userGradCopy.className = "user-grad-copy";
            userGradCopy.title = "Copy Gradient";
            userGradCopy.innerHTML = `<svg viewBox="0 0 24 24" class="grad-copy" fill-rule="evenodd" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.75 3A1.75 1.75 0 003 4.75v9.5c0 .966.784 1.75 1.75 1.75h1.5a.75.75 0 000-1.5h-1.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.25-.25h9.5a.25.25 0 01.25.25v1.5a.75.75 0 001.5 0v-1.5A1.75 1.75 0 0014.25 3h-9.5zm5 5A1.75 1.75 0 008 9.75v9.5c0 .966.784 1.75 1.75 1.75h9.5A1.75 1.75 0 0021 19.25v-9.5A1.75 1.75 0 0019.25 8h-9.5zM9.5 9.75a.25.25 0 01.25-.25h9.5a.25.25 0 01.25.25v9.5a.25.25 0 01-.25.25h-9.5a.25.25 0 01-.25-.25v-9.5z">
                                    </path></svg>Copy`;
            userGradCopy.addEventListener("click", () => {
                function listener(event) {
                    event.clipboardData.setData("text/plain", `background : ${currentGradientCode};`);
                    event.preventDefault();
                }
                document.addEventListener("copy", listener);
                document.execCommand("copy");
                document.removeEventListener("copy", listener);
                showToast(`Gradient Code Copied`)
            });
            gradContainer.append(userGrad, userGradCopy);
            gradListContainer.appendChild(gradContainer);
        }
    } else {
        gradListContainer.classList.add("empty-list");
        gradListContainer.innerHTML = "Save Some Gradients";
    }
}

function setUserColors() {
    let userColorList = localStorage.getItem("userColorList");
    let colorListContainer = elementById("userColors");
    if (userColorList != null) {
        userColorList = userColorList.split(",");
        for (let index = 0; index < userColorList.length; index++) {
            const hex = userColorList[index];
            let colorContainer = document.createElement("div");
            colorContainer.className = "user-color-container";
            colorContainer.id = hex;

            let userColor = document.createElement("div");
            userColor.className = "user-color";
            userColor.style.backgroundImage = `linear-gradient(90deg, ${hex}, ${hex}),${transparentImage}`;
            userColor.addEventListener("mouseenter", () => {
                const html = `<button class="user-color-apply" value="${hex}" onclick="applySavedColor(this.value)">&check;</button>
                              <button class="user-color-delete" value="${hex}" onclick="deleteSavedColor(this.value)">&cross;</button>`;
                userColor.innerHTML = html;
            });
            userColor.addEventListener("mouseleave", () => {
                userColor.innerHTML = "";
            });

            let userColorInfo = document.createElement("button");
            userColorInfo.className = "user-color-info";
            userColorInfo.title = "Copy Hex";
            userColorInfo.innerText = hex;
            userColorInfo.style.borderColor = hex;
            userColorInfo.addEventListener("click", () => {
                function listener(event) {
                    event.clipboardData.setData("text/plain", hex);
                    event.preventDefault();
                }
                document.addEventListener("copy", listener);
                document.execCommand("copy");
                document.removeEventListener("copy", listener);
                showToast(`${hex} Copied`)
            });

            colorContainer.append(userColor, userColorInfo);
            colorListContainer.appendChild(colorContainer);
        }
    } else {
        colorListContainer.classList.add("empty-list");
        colorListContainer.innerHTML = "Save Some Colors";
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
        const radialType = elementsByClass('radialType');
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
            } else
                radialDirections[index].removeAttribute('id');
        }
    }

    const gradientType = elementsByClass('gradientType');
    if (gradientData.activeType == 'linear') {
        retrieveLinearSettigs(gradientType);
    } else {
        retrieveRadialSettigs(gradientType);
    }
    elementById("gradient").style.backgroundImage = `${getGradientString()}, ${transparentImage}`;
    elementById("gradientCode").innerText = `background : ${getGradientString()};`;
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
    setUserColors();
    setUserGradients();
    addEventListeners();
};

window.onload = initiate;