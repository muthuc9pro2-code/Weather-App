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
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return properwords.join(" ");
};

export const updatedisplay = (weatherJson, locationobj) => {
    console.log(weatherJson);
    fadedisplay();
    cleardisplay();
    const weatherclass = getweatherclass(weatherJson.list[0].weather[0].icon);
    setBGimg(weatherclass);
    displayError(locationobj.getname());
    const ccArray = createCurrentConditionDiv(weatherJson.list[0], locationobj.getunit());
    displaycurrentcondition(ccArray);
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
        content.removeChild(deleteitem);
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
    const Icon = createCurrentImageDiv (weatherobj.weather[0].icon, weatherobj.weather[0].description);
    const Temp = createElem("div", "temp", `${Math.round(Number(weatherobj.main.temp))}° ${tempunit}`);
    const properdesc = topropercase(weatherobj.weather[0].description);
    const Desc = createElem("div", "desc", properdesc);
    const Feels = createElem("div", "feels", `${Math.round(Number(weatherobj.main.feels_like))}°`);
    const maxTemp = createElem("div", "maxtemp", `High ${Math.round(Number(weatherobj.main.temp_max))}° ${tempunit}`);
    const minTemp = createElem("div", "mintemp", `Low ${Math.round(Number(weatherobj.main.temp_min))}° ${tempunit}`);
    const Humidity = createElem("div", "humidity", `Humidity ${weatherobj.main.humidity}%`);
    const Wind = createElem("div", "wind", `wind ${Math.round(Number(weatherobj.wind.speed))} ${windunit}`);
    return [Icon, Temp, Desc, Feels, maxTemp, minTemp, Humidity, Wind];
};

const createCurrentImageDiv = (icon, altText) => {
    const icondiv = createElem("div", "icon");
    icondiv.id = "icon";
    const faIcon = iconToFontAwesome(icon);
    faIcon.textContent = altText;
    icondiv.appendChild(faIcon);
    return icondiv;
};

const createElem = (elemtype, divClassName, divText, unit) => {
    const div = document.createElement(elemtype);
    div.className = divClassName;
    if(divText) {
        div.textContent = divText;
    } if (divClassName === "temp") {
        const unitdiv = document.createElement("div");
        unitdiv.className = "unit";
        unitdiv.textContent = unit;
        div.appendChild(unitdiv);
    }
    return div;
};

const iconToFontAwesome = (icon) => {
    const i = document.createElement("i");
    const firstTwochar = icon.slice(0,2);
    const lastchar = icon.slice(2);
    switch (firstTwochar) {
        case "01": 
            if (lastchar === "d") {
                i.classList.add("far", "fa-sun");
            } else {
                i.classList.add("far", "fa-moon");
            }
            break;
        case "02":
            if (lastchar === "d") {
                i.classList.add("fas", "fa-cloud-sun");
            } else {
                i.classList.add("fas", "fa-cloud-moon");
            }
            break;
        case "03": 
            i.classList.add("fas", "fa-cloud");
            break;
        case "04":
            i.classList.add("fas", "fa-cloud-meatball");
            break;
        case "09":
            i.classList.add("fas", "fa-cloud-rain");
            break;
        case "10":
             if (lastchar === "d") {
                i.classList.add("fas", "fa-cloud-sun-rain");
            } else {
                i.classList.add("fas", "fa-cloud-moon-rain");
            }
            break;
        case "11":
             i.classList.add("fas", "fa-poo-strom");
            break;
        case "13":
            i.classList.add("far", "fa-snowflake");
            break;
        case "50":
            i.classList.add("fas", "fa-smog");
            break;
        default:
            i.classList.add("far", "fa-question-circle");
    }
    return i;
};

const displaycurrentcondition = (currentconditionsArray) => {
    const ccContainer = document.getElementById("currentforecast__condition");
    currentconditionsArray.forEach(cc => {
        ccContainer.appendChild(cc);
    });
};