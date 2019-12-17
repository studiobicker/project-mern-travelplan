import axios from "axios";

export default class VenueService {
  constructor() {
    this.service = axios.create({
      baseURL: process.env.REACT_APP_VENUE_API_URL
    });
  }
}
