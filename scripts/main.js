const element = (id) => document.getElementById(id);

const changeColorsOnBox = () => {
    const red = element("redSlider").value;
    const green = element("greenSlider").value;
    const blue = element("blueSlider").value;
    const alpha = element("alphaSlider").value;
    const color = `rgba(${red},${green},${blue},${alpha/100})`;
    element("colorWindow").style.backgroundColor = color;
    element("color1").style.backgroundColor = color;
}
const setColorSliderValue = () => {
    element("redSlider").value = element("redInput").value;
    element("greenSlider").value = element("greenInput").value;
    element("blueSlider").value = element("blueInput").value;
    element("alphaSlider").value = element("alphaInput").value;
};
const setColorInputValue = () => {
    element("redInput").value = element("redSlider").value;
    element("greenInput").value = element("greenSlider").value;
    element("blueInput").value = element("blueSlider").value;
    element("alphaInput").value = element("alphaSlider").value;
};
const addEventListeners = () => {
    const colorSliders = ["redSlider", "greenSlider", "blueSlider", "alphaSlider"];
    const colorInputs = ["redInput", "greenInput", "blueInput", "alphaInput"];
    colorSliders.forEach(id => {
        element(id).addEventListener('input', event => {
            setColorInputValue();
            changeColorsOnBox();
        });
    });
    colorInputs.forEach(id => {
        element(id).addEventListener('change', event => {
            setColorSliderValue();
            changeColorsOnBox();
        });
    });
}
const initiate = () => {
    addEventListeners();
};
window.onload = initiate;