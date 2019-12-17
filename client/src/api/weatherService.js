import axios from "axios";

export default class WeatherService {
  constructor() {
    this.service = axios.create({
      baseURL: process.env.REACT_APP_WEATHER_API_URL
    });
  }

  getWeather = async (lat, lng) => {
    debugger;
    const appId = "66578334c5710fdd247d39820c38a8fe";
    const { data } = await this.service.get(
      `weather?lat=${lat}&lon=${lng}&units=metric&APPID=${appId}`
    );

    debugger;
    return data;
  };
}
