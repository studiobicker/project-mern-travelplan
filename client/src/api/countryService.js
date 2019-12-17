import axios from "axios";

export default class CountryService {
  constructor() {
    this.service = axios.create({
      baseURL: process.env.REACT_APP_COUNTRY_API_URL
    });
  }

  getAll = async () => {
    const { data } = await this.service.get("all");

    debugger;
    return data;
  };
}
