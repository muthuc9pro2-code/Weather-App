export const WEATHER_API_KEY = 'adee358651f18ec1c872e5ccff6ad921';

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
    const lat = locationobj.getlat();
    const lon = locationobj.getlon();
    const unit = locationobj.getunit();
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${WEATHER_API_KEY}`;
    try {
        const weatherstream = await fetch(url);
        const jsonweather = weatherstream.json();
        return jsonweather;
    } catch {
        console.error(err);
    }
    
}

export const getcoordsfromApi = async(entrytext, units) => {
    const regex = /^\d+$/g;
    const flag = regex.test(entrytext) ? "zip" : "q";
    const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entrytext}&units=${units}&appid=${WEATHER_API_KEY}`;
    const encodedurl = encodeURI(url);
    try {
        const datastream = await fetch(encodedurl);
        const jsondata = await datastream.json();
        return jsondata;
    } catch {
        console.error(err.stack);
    }
};

export const cleantext = (text) => {
    const regex = / {2,}/g;
    const entrytext = text.replaceAll(regex, " ").trim();
    return entrytext;
};


