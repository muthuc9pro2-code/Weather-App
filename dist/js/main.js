import { setlocationobject, gethomelocation, getweatherfromcoords, getcoordsfromApi, cleantext} from "./datafunction.js";
import { setplaceholdertext, addspinner, displayError, displayApierror, updatedisplay } from "./domfunction.js";
import currentlocation from "./currentlocation.js";
const currentloc = new currentlocation();


const initApp = () => {
    const geobutton = document.getElementById("getlocation");
    geobutton.addEventListener("click", getgeoweather); 
    const homebutton = document.getElementById("home");
    homebutton.addEventListener("click", loadweather);
    const savebutton = document.getElementById("savelocation");
    savebutton.addEventListener("click", savelocation);
    const unitbutton = document.getElementById("unit");
    unitbutton.addEventListener("click", changeunit);
    const refreshbutton = document.getElementById("refresh");
    refreshbutton.addEventListener("click", refreshweather);
    const searchlocation = document.getElementById("searchbar__form");
    searchlocation.addEventListener("submit", submitnewlocation);
    setplaceholdertext();
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
};

const geoSuccess = (position) => {
    const mycoords = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
        name : `lat ${position.coords.latitude} lon ${position.coords.longitude}`
    };
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
    };
};

 const displayhomelocationweather = (homelocation) => {
    if(typeof homelocation === "string") {
        const homelocationJson = JSON.parse(homelocation);
        const mycoords = {
            lat : homelocationJson.lat,
            lon : homelocationJson.lon,
            name : homelocationJson.name,
            unit : homelocationJson.unit
        };
         setlocationobject(currentloc,mycoords);
         updatedataAnddisplay(currentloc);
    };
};

const savelocation = () => {
    if(currentloc.getlat() && currentloc.getlon()) {
        const saveicon = document.querySelector(".fa-save");
        addspinner(saveicon);
        const location = {
            name : currentloc.getname(),
            lat : currentloc.getlat(),
            lon : currentloc.getlon(),
            unit : currentloc.getunit()
        };
        localStorage.setItem("defaultWeatherLocation", JSON.stringify(location));  
    };
};

const changeunit = () => {
    const uniticon = document.querySelector(".fa-chart-bar");
    addspinner(uniticon);
    currentloc.toggleunit();
    updatedataAnddisplay(currentloc);
};

const refreshweather = () => {
    const refreshicon = document.querySelector(".fa-sync-alt");
    addspinner(refreshicon);
    updatedataAnddisplay(currentloc);
};

const submitnewlocation = async(event) => {
    event.preventDefault();
    const text = document.getElementById("searchbar__text").value;
    const entrytext = cleantext(text);
    if(!entrytext.length)return;
    const locationicon = document.querySelector(".fa-search");
    addspinner(locationicon);
     const coordsdata = await getcoordsfromApi(entrytext, currentloc.getunit());
     if (coordsdata) {
        if (coordsdata.cod === 200) {
           const mycoords ={
            lat : coordsdata.coord.lat,
            lon : coordsdata.coord.lon,
            name : coordsdata.sys.country ? `${coordsdata.name}, ${coordsdata.sys.country}` : coordsdata.name
           };
           setlocationobject(currentloc,mycoords);
           updatedataAnddisplay(currentloc);
        } else {
           displayApierror(coordsdata);
        }
    } else {
        displayError(coordsdata);
    }
    document.getElementById("searchbar__text").value = ""
};

 const updatedataAnddisplay = async (locationobj) => {
    const weatherJson = await getweatherfromcoords(locationobj);
    if (weatherJson) updatedisplay(weatherJson, locationobj);
 };

