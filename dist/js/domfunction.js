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
    if (Errormessage.indexOf("lat") !== -1 && Errormessage.indexOf("lon") !== -1) {
        const msgarray = Errormessage.split(" ");
        const lat = msgarray[1].indexOf("-") !== -1 ? msgarray[1].slice(0, 7) : msgarray[1].slice(0, 6);
        const lon = msgarray[3].indexOf("-") !== -1 ? msgarray[3].slice(0, 7) : msgarray[3].slice(0, 6);
        h1.textContent = `Lat: ${lat} • Lon: ${lon}`;    
    } else {
        h1.textContent = Errormessage;
    }
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
    fadedisplay();
    cleardisplay();
    const weatherclass = getweatherclass(weatherJson.list[0].weather[0].icon);
    setBGimg(weatherclass);
    displayError(locationobj.getname());
    const ccArray = createCurrentConditionDiv(weatherJson.list[0], locationobj.getunit());
    displaycurrentcondition(ccArray);
    displayFiveDayForecast(weatherJson, locationobj.getunit());
    setfocusOnSearch();
    fadedisplay();
};

const fadedisplay = () => {
    const cc = document.getElementById("currentforecast");
    const fiveday = document.getElementById("dailyforecast");

    cc.classList.remove("fade-in");
    cc.classList.add("zero-vis");

    fiveday.classList.remove("fade-in");
    fiveday.classList.add("zero-vis");

    setTimeout(() => {
        cc.classList.remove("zero-vis");
        cc.classList.add("fade-in");

        fiveday.classList.remove("zero-vis");
        fiveday.classList.add("fade-in");
    }, 50);
};


const cleardisplay = () => {
    const currentcondition = document.getElementById("currentforecast__condition");
    deleteall(currentcondition);
    const dailycontents = document.getElementById("dailyforecast__contents");
    deleteall(dailycontents);
};

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
    } else {
        weatherclass = lastchar === "d" ? "clouds" : "night";
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
    const icon = createCurrentImageDiv (weatherobj.weather[0].icon);
    const temp = createElem("div", "temp", `${Math.round(Number(weatherobj.main.temp))}° ${tempunit}`);
    const properdesc = topropercase(weatherobj.weather[0].description);
    const desc = createElem("div", "desc", properdesc);
    const feels = createElem("div", "feels", `Feels Like ${Math.round(Number(weatherobj.main.feels_like))}° ${tempunit}`);
    const maxTemp = createElem("div", "maxtemp", `High ${Math.round(Number(weatherobj.main.temp_max))}° ${tempunit}`);
    const minTemp = createElem("div", "mintemp", `Low ${Math.round(Number(weatherobj.main.temp_min))}° ${tempunit}`);
    const humidity = createElem("div", "humidity", `Humidity ${weatherobj.main.humidity}%`);
    const wind = createElem("div", "wind", `wind ${Math.round(Number(weatherobj.wind.speed))} ${windunit}`);
    return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind]; 
}; 

const createCurrentImageDiv = (icon) => {
    const icondiv = createElem("div", "icon");
    icondiv.id = "icon";
    const faIcon = iconToFontAwesome(icon);
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

const displayFiveDayForecast = (weatherJson, unit) => {
    const container = document.getElementById("dailyforecast__contents");
    const tempunit = unit === "metric" ? "C" : "F";

    for (let i = 8; i < weatherJson.list.length; i += 8) {

    const day = weatherJson.list[i];
    const date = new Date(day.dt * 1000);

    const dayName = date.toLocaleDateString("en-US", { weekday : "short"});
    const dayElem = createElem("div", "forecastDay");
    const Name = createElem("p", "day", dayName);

    const icondiv = createElem("div", "icon");
    const icon = iconToFontAwesome(day.weather[0].icon);
    icondiv.appendChild(icon);

    const temp = createElem("p", "temp", `${Math.round(day.main.temp)}° ${tempunit}`);

    dayElem.appendChild(Name);
    dayElem.appendChild(icondiv);
    dayElem.appendChild(temp);

    container.appendChild(dayElem);
    };
};