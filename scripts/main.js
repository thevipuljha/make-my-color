const element = (id) => document.getElementById(id);
const setColorOnColorWindow = () => {
    const red = element("redValueSlider").value;
    const green = element("greenValueSlider").value;
    const blue = element("blueValueSlider").value;
    const alpha = element("alphaValueSlider").value;
    // const color = "rgba("+red+","+blue+","+green+","+alpha+")";
    const color = `rgba(${red},${green},${blue},${alpha/100})`;
    element("colorWindow").style.backgroundColor = color;
    element("redValueInput").value = red;
    element("greenValueInput").value = green;
    element("blueValueInput").value = blue;
    element("alphaValueInput").value = alpha;
};
const initiate = () => {
    element("redValueSlider").oninput = setColorOnColorWindow;
    element("greenValueSlider").oninput = setColorOnColorWindow;
    element("blueValueSlider").oninput = setColorOnColorWindow;
    element("alphaValueSlider").oninput = setColorOnColorWindow;
    console.log();
};
window.onload = initiate;