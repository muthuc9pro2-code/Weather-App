
export const setlocationobject = (locationobj, coordsobj) => {
    const {lat, lon, name, unit} = coordsobj;
    locationobj.setlat(lat);
    locationobj.setlon(lon);
    locationobj.setname(name);
    if(unit) {
        locationobj.setunit(unit);
    };
};

export const gethomelocation = () => {
    return localStorage.getItem("defaultWeatherLocation");
};

export const getweatherfromcoords = async (locationobj) => {
   /* const lat = locationobj.getlat();
    const lon = locationobj.getlon();
    const unit = locationobj.getunit();
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${WEATHER_API_KEY}`;
    try {
        const weatherstream = await fetch(url);
        const jsonweather = weatherstream.json();
        return jsonweather;
    } catch {
        console.error(err);
    } */  

    const urlDataObject = {
     lat: locationobj.getlat(),
     lon: locationobj.getlon(),
     unit: locationobj.getunit()
    };
    try {
       const weatherstream = await fetch('/.netlify/functions/get_weather', {
        method: "POST",
        body: JSON.stringify(urlDataObject)
       }); 
       const jsonweather = await weatherstream.json();
       return jsonweather;
    } catch (err) {
        console.error(err);
    }
};


export const getcoordsfromApi = async(entrytext, units) => {
    /* const regex = /^\d+$/g;
    const flag = regex.test(entrytext) ? "zip" : "q";
    const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entrytext}&units=${units}&appid=${WEATHER_API_KEY}`;
    const encodedurl = encodeURI(url);
    try {
        const datastream = await fetch(encodedurl);
        const jsondata = await datastream.json();
        return jsondata;
    } catch {
        console.error(err.stack);
    } */

    const urldataobject = {
        text: entrytext, 
        units: units
    };
    try {
        const datastream = await fetch('/.netlify/functions/get_coords', {
            method: "POST",
            body: JSON.stringify(urldataobject)
        });
        const jsondata = await datastream.json();
        return jsondata;
    } catch (err) {
        console.error(err);
    }
}; 

export const cleantext = (text) => {
    const regex = / {2,}/g;
    const entrytext = text.replaceAll(regex, " ").trim();
    return entrytext;
};





