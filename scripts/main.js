const elementById = (id) => document.getElementById(id);
const elementsByClass = (className) => document.getElementsByClassName(className);
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

function updatesToActiveColor(changeSlider = true) {
    const rgba = getBackgroundColor(getActiveColorButton());
    const rgbInputs = getRgbInputs();
    for (let index = 0; index < rgbInputs.length; index++) {
        rgbInputs[index].value = rgba[index];
    }
    const hex = rgbaToHex(rgba[0], rgba[1], rgba[2], rgba[3]);
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
    elementById("gradient").style.background = getGradientString();
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
        hslaSliders[index].addEventListener('input', () => {
            hslaInputs[index].value = hslaSliders[index].value;
            changeBoxColor();
            changeActiveButtonColor();
            updatesToActiveColor(false);
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
            updatesToActiveColor(false);
        });
        if (index != 3) {
            rgbInputs[index].addEventListener('input', () => {
                setInputLimit(rgbInputs[index], 0, 255);
                const red = rgbInputs[0].value;
                const green = rgbInputs[1].value;
                const blue = rgbInputs[2].value;
                const alpha = hslaSliders[3].value;
                getActiveColorButton().style.backgroundColor = getRgbaString(red, green, blue, alpha);
                updatesToActiveColor();
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
            updatesToActiveColor();
            gradientColorsSpacing();
        }
    });

    elementById("addColorButton").addEventListener("click", () => {
        getNewColorButton(true);
        gradientColorsSpacing();
        updatesToActiveColor();
        elementById("gradientBlock").scrollLeft = elementById("gradientBlock").scrollWidth;
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

            let userColorBg = document.createElement("div");
            userColorBg.className = "user-div-bg";

            let userColor = document.createElement("div");
            userColor.className = "user-color";
            userColor.style.backgroundColor = hex;

            userColor.addEventListener("mouseenter", () => {
                const html = `<button class="user-color-apply" value="${hex}" onclick="applySavedColor(this.value)"><i class="gi gi-apply"></i></button>
                              <button class="user-color-delete" value="${hex}" onclick="deleteSavedColor(this.value)"><i class="gi gi-remove"></i></button>`;
                userColor.innerHTML = html;
            });
            userColor.addEventListener("mouseleave", () => {
                userColor.innerHTML = "";
            });

            let userColorInfo = document.createElement("button");
            userColorInfo.className = "user-color-info";
            userColorInfo.title = "Copy Hex";
            userColorInfo.innerText = hex;
            userColorInfo.style.border = `3px solid ${hex}`;
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
            userColorBg.append(userColor);
            colorContainer.append(userColorBg, userColorInfo);
            colorListContainer.appendChild(colorContainer);
            elementById("userColors").scrollTop = elementById("userColors").scrollHeight;
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

        let userGradBg = document.createElement("div");
        userGradBg.className = "user-div-bg";

        let userGrad = document.createElement("div");
        userGrad.className = "user-grad";
        userGrad.style.background = currentGradientCode;

        userGrad.addEventListener("mouseenter", () => {
            const html = `<button class="user-grad-apply" value="${gradientId}" onclick="applySavedUserGradient(this.value)"><i class="gi gi-apply"></i></button>
                          <button class="user-grad-delete" value="${gradientId}" onclick="deleteSavedGradient(this.value)"><i class="gi gi-remove"></i></button>`;
            userGrad.innerHTML = html;
        });
        userGrad.addEventListener("mouseleave", () => {
            userGrad.innerHTML = "";
        });

        let userGradCopy = document.createElement("button");
        userGradCopy.className = "user-grad-copy";
        userGradCopy.title = "Copy Gradient";
        userGradCopy.innerHTML = `<i class="gi gi-copy"></i>Copy`;
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
        userGradBg.appendChild(userGrad);
        gradContainer.append(userGradBg, userGradCopy);
        gradListContainer.appendChild(gradContainer);
        elementById("userGradients").scrollTop = elementById("userGradients").scrollHeight;
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

            let userGradBg = document.createElement("div");
            userGradBg.className = "user-div-bg";

            let userGrad = document.createElement("div");
            userGrad.className = "user-grad";
            userGrad.style.background = currentGradientCode;

            userGrad.addEventListener("mouseenter", () => {
                const html = `<button class="user-grad-apply" value="${gradientId}" onclick="applySavedUserGradient(this.value)"><i class="gi gi-apply"></i></button>
                          <button class="user-grad-delete" value="${gradientId}" onclick="deleteSavedGradient(this.value)"><i class="gi gi-remove"></i></button>`;
                userGrad.innerHTML = html;
            });

            userGrad.addEventListener("mouseleave", () => {
                userGrad.innerHTML = "";
            });

            let userGradCopy = document.createElement("button");
            userGradCopy.className = "user-grad-copy";
            userGradCopy.title = "Copy Gradient";
            userGradCopy.innerHTML = `<i class="gi gi-copy"></i>Copy`;
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
            userGradBg.appendChild(userGrad);
            gradContainer.append(userGradBg, userGradCopy);
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

            let userColorBg = document.createElement("div");
            userColorBg.className = "user-div-bg";

            let userColor = document.createElement("div");
            userColor.className = "user-color";
            userColor.style.backgroundColor = hex;
            userColor.addEventListener("mouseenter", () => {
                const html = `<button class="user-color-apply" value="${hex}" onclick="applySavedColor(this.value)"><i class="gi gi-apply"></i></button>
                              <button class="user-color-delete" value="${hex}" onclick="deleteSavedColor(this.value)"><i class="gi gi-remove"></i></button>`;
                userColor.innerHTML = html;
            });
            userColor.addEventListener("mouseleave", () => {
                userColor.innerHTML = "";
            });

            let userColorInfo = document.createElement("button");
            userColorInfo.className = "user-color-info";
            userColorInfo.title = "Copy Hex";
            userColorInfo.innerText = hex;
            userColorInfo.style.border = `3px solid ${hex}`;
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
            userColorBg.append(userColor);
            colorContainer.append(userColorBg, userColorInfo);
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
    if (element.value >= upperLimit) {
        element.value = upperLimit;
    }
    if (element.value <= lowerLimit) {
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
    newColor.className = "preset-color gi gi-random";
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
    elementById("gradient").style.background = getGradientString();
    elementById("gradientCode").innerText = `background : ${getGradientString()};`;
};

const setLocalData = () => {
    if (localStorage.getItem('autosave') != null) {
        if (localStorage.getItem('autosave') == 'true') {
            applySavedGradient();
            elementById('autosave').checked = true;
        } else {
            elementById('autosave').checked = false;
        }
    } else {
        elementById('autosave').checked = true;
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
    let newColorButtonGap = document.createElement("div");
    newColorButtonGap.className = "color-buttons-gap";
    gradientColorsRow().append(newColorButton, newColorButtonGap);
}

const setInitialGradientColors = () => {
    getNewColorButton(true);
    getNewColorButton();
};

const setSliderBackgrounds = () => {
    const sliders = getHslaSliders();
    const hsla = getSliderHslaValue();
    sliders[0].style.backgroundImage = `linear-gradient(90deg, #F00 0%, #FF0 16.66%, #0F0 33.33%, #0FF 50%, #00F 66.66%, #F0F 83.33%, #F00 100%)`;
    sliders[1].style.backgroundImage = `linear-gradient(90deg, ${getHslaString(hsla.hue,0,hsla.light,100)}, ${getHslaString(hsla.hue,100,hsla.light,100)})`;
    sliders[2].style.backgroundImage = `linear-gradient(90deg, black, white)`;
};

const initiate = () => {
    setInitialGradientColors();
    setColorPallete();
    setLocalData();
    updatesToActiveColor();
    setUserColors();
    setUserGradients();
    addEventListeners();
    setSliderBackgrounds();
    changeBoxColor();
};

window.onload = initiate;