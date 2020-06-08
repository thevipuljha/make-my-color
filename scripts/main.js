const elementById = (id) => document.getElementById(id);
const elementsByclass = (className) => document.getElementsByClassName(className);
const transaprentImage = "url(/images/transaprent-image.png)";

const changeBoxColor = (colorSliders) => {
    const red = colorSliders[0].value;
    const green = colorSliders[1].value;
    const blue = colorSliders[2].value;
    const alpha = colorSliders[3].value;
    const currentColor = `rgba(${red},${green},${blue},${alpha/100})`;
    elementById("alphaSlider").style.backgroundImage = `linear-gradient(90deg, #FFFFFF00,rgb(${red},${green},${blue})),${transaprentImage}`;
    elementById("colorWindow").style.backgroundImage = `linear-gradient(90deg, ${currentColor}, ${currentColor}),${transaprentImage}`;
    elementById("gradient").style.backgroundImage = `linear-gradient(90deg, #FF0000, ${currentColor}),${transaprentImage}`;
}

const addEventListeners = (colorSliders, colorInputs) => {
    for (let index = 0; index < 4; index++) {
        colorSliders[index].addEventListener('input', () => {
            colorInputs[index].value = colorSliders[index].value;
            changeBoxColor(colorSliders);
        });
        colorInputs[index].addEventListener('change', () => {
            colorSliders[index].value = colorInputs[index].value;
            changeBoxColor(colorSliders);
        });
    }
}

const initiate = () => {
    const colorSliders = elementsByclass("color-slider");
    const colorInputs = elementsByclass("color-input");
    addEventListeners(colorSliders, colorInputs);
};
window.onload = initiate;