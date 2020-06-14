const elementById = (id) => document.getElementById(id);
const elementsByclass = (className) => document.getElementsByClassName(className);
const changeLinearInput = (slider, input) => input.value = slider.value;
const changeLinearSlider = (input, slider) => slider.value = input.value;
const transparentImage = "url(https://vipul1142.github.io/make-my-color/images/transparentImage.png)";

const getRgbaValue = () => {
        var red =  elementById("redSlider").value;
        var green =elementById("greenSlider").value;
        var blue =elementById("blueSlider").value;
        var alpha =elementById("alphaSlider").value;
        return { red, green, blue, alpha}
    }

var rgbToHex = function (red, green, blue) {
    var hex = Number(red, green, blue).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};

var fullColorHex = function (red, green, blue) {
    var red = rgbToHex(red);
    var green = rgbToHex(green);
    var blue = rgbToHex(blue);
    elementById("hex-code").value = `hex(#${red}${green}${blue})`;
};




var rgbToCmyk = function(red,green, blue, normalized){
    var c = 1 - (red / 255);
    var m = 1 - (green / 255);
    var y = 1 - (blue / 255);
    var k = Math.min(c, Math.min(m, y));
    
    c = (c - k) / (1 - k);
    m = (m - k) / (1 - k);
    y = (y - k) / (1 - k);
    
    if(!normalized){
        c = Math.round(c * 10000) / 100;
        m = Math.round(m * 10000) / 100;
        y = Math.round(y * 10000) / 100;
        k = Math.round(k * 10000) / 100;
    }
    
    c = isNaN(c) ? 0 : c;
    m = isNaN(m) ? 0 : m;
    y = isNaN(y) ? 0 : y;
    k = isNaN(k) ? 0 : k;
    
    return {
        c: c,
        m: m,
        y: y,
        k: k
    }
}

// interconversion
const cmyk2rgb = (c,m,y,k) => {
    c = (c / 100);
    m = (m / 100);
    y = (y / 100);
    k = (k / 100);
    
    c = c * (1 - k) + k;
    m = m * (1 - k) + k;
    y = y * (1 - k) + k;
    
    var red = 1 - c;
    var green = 1 - m;
    var blue = 1 - y;
    return {
        red, green, blue
    }
}
//    interconversion // 


function rgbtohsl(red, green, blue) {
    red /= 255, green /= 255, blue /= 255;

    var max = Math.max(red, green, blue),
        min = Math.min(red, green, blue);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0;
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case red:
                h = (green - blue) / d + (green < blue ? 6 : 0);
                break;
            case green:
                h = (blue - red) / d + 2;
                break;
            case blue:
                h = (red - green) / d + 4;
                break;
        }

    }
    h = Math.round(h * 60);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return {
        h,
        s,
        l
    };
}

function colorcodes(){
        const {red, green, blue, alpha} = getRgbaValue();
        elementById("rgb-code").value = `rgb(${red}, ${green}, ${blue} , ${alpha})`;
        const {c,y,m,k} = rgbToCmyk(red, green, blue);
        elementById("cmyk-code").value = `cmyk(${Math.round(c)}, ${Math.round(m)}, ${Math.round(y)}, ${Math.round(k)})`;
        const {h,s,l} = rgbtohsl(red, green, blue);
        elementById("hsl-code").value = `hsl(${Math.round(h)}, ${Math.round(s)}, ${Math.round(l)})`;
        const hex = fullColorHex(red, green, blue);
        

    }

const gradientTypeSwitch = (wakeButton, sleepButton, wakeDiv, sleepDiv) => {
    wakeButton.style.backgroundColor = "steelblue";
    sleepButton.style.backgroundColor = "white";
    wakeDiv.style.display = "flex";
    sleepDiv.style.display = "none";
};

const changeBoxColor = (colorSliders) => {
    const rgba = getRgbaValue();
    const red = rgba.red;
    const green = rgba.green;
    const blue = rgba.blue;
    const alpha = rgba.alpha;
    const currentColor = `rgba(${red},${green},${blue},${alpha/100})`;
    elementById("alphaSlider").style.backgroundImage = `linear-gradient(90deg, #FFFFFF00,rgb(${red},${green},${blue})),${transparentImage}`;
    elementById("colorWindow").style.backgroundImage = `linear-gradient(90deg, ${currentColor}, ${currentColor}),${transparentImage}`;
    elementById("gradient").style.backgroundImage = `linear-gradient(90deg, #FF0000, ${currentColor}),${transparentImage}`;
}

// rgbtohsl
// rgbToHex
// rgbToCmyk

// cmyktorgb
// hextorgb
// hsltorgb

const addEventListeners = (colorSliders, colorInputs) => {
    for (let index = 0; index < 4; index++) {
        colorInputs[index].addEventListener('input', () => {
            colorSliders[index].value = colorInputs[index].value;
            changeBoxColor(colorSliders);
            colorInputLimit(colorInputs);
            colorcodes();
        });
    
        colorSliders[index].addEventListener('input', () => {
            colorInputs[index].value = colorSliders[index].value;
            changeBoxColor(colorSliders);
            colorcodes();
        
        });
}
}



const colorInputLimit = (colorInputs) => {
    for (let index = 0; index < 3; index++) {
        if (colorInputs[index].value > 255) {
            colorInputs[index].value = 255;
        }
    }
    for (let index = 3; index <= 3; index++) {
        if (colorInputs[index].value > 100) {
            colorInputs[index].value = 100;
        }
    }
};

const initiate = () => {
    const colorSliders = elementsByclass("color-slider");
    const colorInputs = elementsByclass("color-input");
    addEventListeners(colorSliders, colorInputs);
    return colorInputs;
};

window.onload = initiate;