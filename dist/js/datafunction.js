export const setlocationobject = (locationobj, coordsobj) => {
    const {lat, lon, name, unit} = coordsobj;
    locationobj.setlat(lat);
    locationobj.setlon(lon);
    locationobj.setname(name);
    if(unit) {
        locationobj.setunit(unit);
    };
}

export const gethomelocation = () => {
    return localStorage.getItem("defaultWeatherLocation");
}