import { addspinner } from "./domfunction.js";
import currentlocation from "./currentlocation.js";
const currentloc = new currentlocation();


const initApp = () => {
    const geobutton = document.getElementById("getlocation");
    geobutton.addEventListener("click", getgeoweather); 
};

document.addEventListener ("DOMContentLoaded", initApp);

const getgeoweather = (event) => {
    if(event) {
        if(event.type === "click") {
            const mapicon = document.querySelector(".fa-map-marker-alt");
            addspinner(mapicon);
        }
    }
    if(!navigator.geolocation) return geoError();
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

const geoError = (errobj) => {
    const errmsg = errobj ? errobj.message : "Geolocation not supported";
    displayError(errmsg);
}

