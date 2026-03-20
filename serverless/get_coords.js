const fetch = require("node-fetch");

const  { WEATHER_API_KEY } = process.env;

exports.handler =async (event, context) => {
    const params = JSON.parse(event.body);
    const { text, units } = params;
    const regex = /^\d+$/g;
    const flag = regex.test(text) ? "zip" : "q";
    const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${text}&units=${units}&appid=${WEATHER_API_KEY}`;
    const encodedurl = encodeURI(url);
    try {
        const datastream = await fetch(encodedurl);
        const jsondata = await datastream.json();
        return {
            statusCode: 200,
            body: JSON.stringify(jsondata)
        }
    } catch (err) {
        return {
            statusCode: 422, 
            body: err.stack }
        }
    }