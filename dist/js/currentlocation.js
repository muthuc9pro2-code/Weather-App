export default class currentlocation {
    constructor() {
        this._name = "current location";
        this._lat = null;
        this._lon = null;
        this._unit = "metric"
    }
    getname () {
        return this._name;
    }
    setname (name) {
        this._name = name;
    }
    getlat () {
        return this._lat;
    }
    setlat (lat) {
        this._lat = lat;
    }
    getlon () {
        return this._lon;
    }
    setlon (lon) {
         this._lon = lon;
    }
    getunit () {
        return this._unit;
    }
    setunit (unit) {
        this._unit = unit;
    }
    toggleunit() {
        this._unit = this._unit === "metric" ? "imperial": "metric";
    }
}