import currentlocation from "./currentlocation";
const currentloc = new currentlocation();


const initapp = () => {
    const geobutton = document.getElementById("getlocation");
    geobutton.addEventListener("click", getgeoweather);
}

document.addEventListener("DOMContentLoaded",initapp);

const getgeoweather = (event) => {
    if(event) {
        
    }
}