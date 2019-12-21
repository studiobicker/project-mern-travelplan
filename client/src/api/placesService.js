import axios from "axios";

export default class PlacesService {
  constructor() {
    this.service = axios.create({
      baseURL: process.env.REACT_APP_PROXY_URL
    });
  }

  nearbyPlaces = async (location, radius, type, keyword) => {
    debugger;
    const mapKey = process.env.REACT_APP_MAP_KEY;
    const { data } = await this.service.get("nearbySearch", {
      params: {
        location,
        radius,
        type,
        keyword,
        key: mapKey
      }
    });
    return data;
  };
}
