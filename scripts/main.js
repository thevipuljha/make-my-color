const elementById = (id) => document.getElementById(id);
const elementsByclass = (className) => document.getElementsByClassName(className);
const changeLinearInput = (slider, input) => input.value = slider.value;
const changeLinearSlider = (input, slider) => slider.value = input.value;
const transparentImage = "url(https://vipul1142.github.io/make-my-color/images/transparentImage.png)";

const gradientTypeSwitch = (wakeButton, sleepButton, wakeDiv, sleepDiv) => {
    wakeButton.style.backgroundColor = "steelblue";
    sleepButton.style.backgroundColor = "white";
    wakeDiv.style.display = "flex";
    sleepDiv.style.display = "none";
};

const changeBoxColor = (colorSliders) => {
    const red = colorSliders[0].value;
    const green = colorSliders[1].value;
    const blue = colorSliders[2].value;
    const alpha = colorSliders[3].value;
    const currentColor = `rgba(${red},${green},${blue},${alpha/100})`;
    elementById("alphaSlider").style.backgroundImage = `linear-gradient(90deg, #FFFFFF00,rgb(${red},${green},${blue})),${transparentImage}`;
    elementById("colorWindow").style.backgroundImage = `linear-gradient(90deg, ${currentColor}, ${currentColor}),${transparentImage}`;
    elementById("gradient").style.backgroundImage = `linear-gradient(90deg, #FF0000, ${currentColor}),${transparentImage}`;
    return {
        red,
        green,
        blue
    }
}

// color code conversions
const colorCodeRgb = (red, green, blue) => {
    elementById("rgb-code").value = `RGB: (${red}, ${green}, ${blue})`;
};


const rgbToCmyk = (red, green, blue) => {
    var redC = red / 255;
    var blueC = blue / 255;
    var greenC = green / 255;
    var k = 1 - Math.max(redC, blueC, greenC);
    var c = ((1 - redC - k) / (1 - k));
    var m = (1 - greenC - k) / (1 - k);
    var y = ((1 - blueC - k) / (1 - k));
    return {
        k,
        c,
        m,
        y
    }
};

const colorCodeCmyk = (c, m, y, k) => {
    elementById("cmyk-code").value = ` CMYK: (${Math.round(c)}, ${Math.round(m)}, ${Math.round(y)}, ${Math.round(k)})`;
};


var rgbToHex = function (rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};

var fullColorHex = function (red, green, blue) {
    var red = rgbToHex(red);
    var green = rgbToHex(green);
    var blue = rgbToHex(blue);
    elementById("hex-code").value = `HEX: (#${red}${green}${blue})`;
};


function rgbtohsl(red, green, blue) {
    red /= 255, green /= 255, blue /= 255;
  
    var max = Math.max(red, green, blue), min = Math.min(red, green, blue);
    var h, s, l = (max + min) / 2;
  
    if (max == min) {
      h = s = 0; 
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
      switch (max) {
        case red: h = (green - blue) / d + (green < blue ? 6 : 0); break;
        case green : h = (blue - red) / d + 2; break;
        case blue: h = (red - green) / d + 4; break;
      }
  
    }
h = Math.round(h * 60); 
s = Math.round(s * 100); 
l = Math.round(l * 100);
    
    return { h, s, l };
  }

const colorCodeHsl = (h,s,l) => {
    elementById("hsl-code").value = ` HSL: (${Math.round(h)}, ${Math.round(s)}, ${Math.round(l)})`;

};
// color code conversions end

const addEventListeners = (colorSliders, colorInputs) => {
    for (let index = 0; index < 4; index++) {
        colorSliders[index].addEventListener('input', () => {
            colorInputs[index].value = colorSliders[index].value;
            changeBoxColor(colorSliders);
            const {
                red,
                green,
                blue
            } = changeBoxColor(colorSliders);
            colorCodeRgb(red, green, blue);
            const {
                c,
                m,
                y,
                k
            } = rgbToCmyk(red, green, blue);
            colorCodeCmyk(c, m, y, k);
            fullColorHex(red, green, blue);
            const {h,s,l
            } =rgbtohsl(red,green,blue);
            colorCodeHsl(h,s,l);
        });


        colorInputs[index].addEventListener('change', () => {
            colorSliders[index].value = colorInputs[index].value;
            colorInputLimit(colorInputs);
            const {
                red,
                green,
                blue
            } = changeBoxColor(colorSliders);
            colorCodeRgb(red, green, blue);
            const {
                c,
                m,
                y,
                k
            } = rgbToCmyk(red, green, blue);
            colorCodeCmyk(c, m, y, k);
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