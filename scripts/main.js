const elementById = (id) => document.getElementById(id);
const elementsByClass = (className) => document.getElementsByClassName(className);
const transparentImage = "url(data:image/png;base64,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)";
const gradientColorsRow = () => elementById("gradientColors");
const getGradientColors = () => elementsByClass("colorButton");
const getActiveColorButton = () => elementById("activeColor");

const getColorSliders = () => elementsByClass("color-slider");
const getColorInputs = () => elementsByClass("color-input");
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

const getSliderHslaValue = () => {
    const colorSliders = getColorSliders();
    return {
        hue: colorSliders[0].value,
        sat: colorSliders[1].value,
        light: colorSliders[2].value,
        alpha: colorSliders[3].value / 100
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
    elementById("alphaSlider").style.backgroundImage = `linear-gradient(90deg, transparent,${fullColor}),${transparentImage}`;
    elementById("colorWindow").style.backgroundImage = `linear-gradient(90deg, ${currentColor}, ${currentColor}),${transparentImage}`;
}

const changeActiveButtonColor = () => {
    const hsla = getSliderHslaValue();
    getActiveColorButton().style.backgroundColor = getHslaString(hsla.hue, hsla.sat, hsla.light, hsla.alpha);
};

function updatesToActiveColor(changeSlider = true) {
    const rgba = getBackgroundColor(getActiveColorButton());
    elementById("redInput").value = rgba[0];
    elementById("greenInput").value = rgba[1];
    elementById("blueInput").value = rgba[2];
    const hex = rgbaToHex(rgba[0], rgba[1], rgba[2], rgba[3]);
    elementById("hexInput").value = hex;
    if (changeSlider) {
        const hsla = rgbatohsla(rgba[0], rgba[1], rgba[2], rgba[3]);
        const colorSliders = getColorSliders();
        colorSliders[0].value = hsla.hue;
        colorSliders[1].value = hsla.sat;
        colorSliders[2].value = hsla.light;
        colorSliders[3].value = hsla.alpha * 100;
        const colorInputs = getColorInputs();
        for (let index = 0; index < 4; index++) {
            colorInputs[index].value = colorSliders[index].value;
        }
    }
    elementById("colorWindow").style.backgroundImage = `linear-gradient(90deg, ${getHexString(hex)}, ${getHexString(hex)}),${transparentImage}`;
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
    const colorSliders = getColorSliders();
    const colorInputs = getColorInputs();
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
        colorSliders[index].addEventListener('input', () => {
            colorInputs[index].value = colorSliders[index].value;
            changeBoxColor();
            changeActiveButtonColor();
            updatesToActiveColor(false);
        });

        colorInputs[index].addEventListener('input', () => {
            if (index == 0) {
                setInputLimit(colorInputs[index], 0, 359);
            } else {
                setInputLimit(colorInputs[index], 0, 100);
            }
            if (colorInputs[index].value != "") {
                colorSliders[index].value = colorInputs[index].value;
                changeBoxColor();
                changeActiveButtonColor();
                updatesToActiveColor(false);
            }
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

            let userColor = document.createElement("div");
            userColor.className = "user-color";
            userColor.style.backgroundImage = `linear-gradient(90deg, ${hex}, ${hex}),${transparentImage}`;

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

            colorContainer.append(userColor, userColorInfo);
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

        let userGrad = document.createElement("div");
        userGrad.className = "user-grad";
        userGrad.style.backgroundImage = `${currentGradientCode}, ${transparentImage}`;

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

        gradContainer.append(userGrad, userGradCopy);
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

            let userGrad = document.createElement("div");
            userGrad.className = "user-grad";
            userGrad.style.backgroundImage = `${currentGradientCode}, ${transparentImage}`;

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
    elementById("gradient").style.backgroundImage = `${getGradientString()}, ${transparentImage}`;
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
    gradientColorsRow().appendChild(newColorButton);
}

const setInitialGradientColors = () => {
    getNewColorButton(true);
    getNewColorButton();
};

const setSliderBackgrounds = () => {
    const sliders = getColorSliders();
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