import { setlocationobject, gethomelocation } from "./datafunction.js";
import { addspinner, displayError } from "./domfunction.js";
import currentlocation from "./currentlocation.js";
const currentloc = new currentlocation();


const initApp = () => {
    const geobutton = document.getElementById("getlocation");
    geobutton.addEventListener("click", getgeoweather); 
    const homebutton = document.getElementById("home");
    homebutton.addEventListener("click", loadweather);
    loadweather();
};

document.addEventListener ("DOMContentLoaded", initApp);

const getgeoweather = (event) => {
    if(event) {
        if(event.type === "click") {
            const mapicon = document.querySelector(".fa-map-marker-alt");
            addspinner(mapicon);
        };
    };
    if(!navigator.geolocation) return geoError();
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

const geoError = (errobj) => {
    const errmsg = errobj ? errobj.message : "Geolocation not supported";
    displayError(errmsg);
}

const geoSuccess = (position) => {
    const mycoords = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
        name : `lat ${position.coords.latitude} lon ${position.coords.longitude}`
    }
    setlocationobject(currentloc,mycoords);
    updatedataAnddisplay(currentloc);
};

const loadweather = (event) => {
    const savedlocation = gethomelocation();
    if(!savedlocation && !event) return getgeoweather();
    if(!savedlocation && event.type === "click") {
        displayError("You Dumb, first save your location");
    } else if (savedlocation && !event) {
        displayhomelocationweather(savedlocation);
    }else {
        const homeicon = document.querySelector(".fa-home");
        addspinner(homeicon);
        displayhomelocationweather(savedlocation);
    }
};

 const updatedataAnddisplay = async (locationobj) => {
    const weatherJson = await getweatherfromcoords(locationobj);
    if (weatherJson) updatedisplay(weatherJson, locationobj);
 };