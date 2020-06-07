const elementById = (id) => document.getElementById(id);
const elementsByclass = (className) => document.getElementsByClassName(className);

const changeBoxColor = (colorSliders) => {
    const red = colorSliders[0].value;
    const green = colorSliders[1].value;
    const blue = colorSliders[2].value;
    const alpha = colorSliders[3].value;
    const color = `rgba(${red},${green},${blue},${alpha/100})`;
    elementById("colorWindow").style.backgroundColor = color;
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