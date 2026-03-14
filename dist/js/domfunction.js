export const setplaceholdertext = () => {
    const input = document.getElementById("searchbar__text");
    window.innerWidth < 400 ? (input.placeholder = "City, State, Country") : (input.placeholder = "City, State, Country or Zipcode");
}
export const addspinner = (element) => {
    animateButton(element);
    setTimeout(animateButton, 1000, element);
}

const animateButton = (element) => {
    element.classList.toggle("none");
    element.nextElementSibling.classList.toggle("block");
    element.nextElementSibling.classList.toggle("none");
};

export const displayError = (Errormessage) => {
    const h1 = document.getElementById("currentforecast__location");
    h1.textContent = Errormessage;
}

export const displayApierror = (statuscode) => {
    const propermsg = topropercase(statuscode.message);
    displayError(propermsg);
    console.error("weather api error : ",statuscode);
};

const topropercase = (text) => {
    const words = text.split(" ");
    const properwords =words.map(word => {
        return word.charAt(0).toUpperCase + word.slice(1);
    });
    return properwords.join(" ");
};

export const updatedisplay = (weatherJson, locationobj) => {
    fadedisplay();
    cleardisplay();
    const weatherclass = getweatherclass(weatherJson.current.weather[0].icon);
    setBGimg(weatherclass);
    displayError(locationobj.getname());
    const ccArray = createCurrentConditionDiv(weatherJson, locationobj.getuint());
    setfocusOnSearch();
    fadedisplay();
};

const fadedisplay = () => {
    const cc = document.getElementById("currentforecast");
    cc.classList.toggle("zero-vis");
    cc.classList.toggle("fade-in");
    const fiveday =  document.getElementById("dailyforecast");
    fiveday.classList.toggle("zero-vis");
    fiveday.classList.toggle("fade-in");
};

const cleardisplay = () => {
    const currentcondition = document.getElementById("currentforecast__condition");
    deleteall(currentcondition);
    const dailycontents = document.getElementById("dailyforecast__contents");
    deleteall(dailycontents);
}

const deleteall = (content) => {
    let deleteitem = content.lastElementChild;
    while(deleteitem) {
        content.deleteitem(deleteitem);
        deleteitem = content.lastElementChild;
    }
};

const getweatherclass = (icon) => {
    const firstTwochar = icon.slice(0,2);
    const lastchar = icon.slice(2);
    const match = {
        "09" : "snow",
        "10" : "rain",
        "11" : "rain",
        "13" : "snow",
        "50" : "fog"
    };
    let weatherclass;
    if(match[firstTwochar]) {
        weatherclass = match[firstTwochar];
    } else if (lastchar === "d") {
        weatherclass = "clouds";
    } else {
        weatherclass = "night"
    } 
    return weatherclass;
};

const setBGimg = (weatherclass) => {
    document.documentElement.classList.add(weatherclass);
    document.documentElement.classList.forEach(img => {
        if(img !== weatherclass) document.documentElement.classList.remove(img);
    })
};

const setfocusOnSearch = () => {
    const cc = document.getElementById("searchbar__text").focus();
};

const createCurrentConditionDiv = (weatherobj, unit) => {
    const tempunit = unit === "metric" ? "C" : "F";
    const windunit = unit === "metric" ? "m/s" : "mph";
    const icon = createCurrentImageDiv (weatherobj.current.weather[0].icon, weatherobj.current.weather[0].description);
    const temp = createElem("div", "temp", `${Math.round(Number(weatherobj.current.temp))}°`);
    const properdesc = topropercase(weatherobj.current.weather[0].description);
    const desc = createElem("div", "desc", properdesc);
    // const feel = 
};

const createCurrentImageDiv = (icon, altText) => {
    const icondiv = createElem("div", "icon");
    icondiv.id = "icon";
    const faIcon = iconToFontAwesome(icon);
    faIcon.text = altText;
    icondiv.appendchild(faIcon);
    return icondiv;
};

createElem = (elemtype, divClassName, divText, unit) => {
    const div = document.createElement(elemtype);
    div.ClassName = divClassName;
    if(divText) {
        div.textContent = divText;
    } if (divClassName === "temp") {
        const unitdiv = document.createElement("div");
        unitdiv.className = "unit";
        unitdiv.textContent = unit;
    }
    return unitdiv;
}