import axios from "axios";

export default class WeatherService {
  constructor() {
    this.service = axios.create({
      baseURL: process.env.REACT_APP_WEATHER_API_URL
    });
  }

  getWeather = async (lat, lng) => {
    const appId = process.env.REACT_APP_WEATHER_API_KEY;
    const { data } = await this.service.get(
      `weather?lat=${lat}&lon=${lng}&units=metric&APPID=${appId}`
    );
    return data;
  };
}
