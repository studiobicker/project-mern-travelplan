import axios from "axios";

export default class authService {
  constructor() {
    this.service = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      withCredentials: true
    });
  }

  login = async payload => {
    const { email, password } = payload;
    const { data } = await this.service.post("auth/login", {
      email,
      password
    });
    return data;
  };

  register = async payload => {
    const { name, email, password } = payload;
    const { data } = await this.service.post("auth/register", {
      name,
      email,
      password
    });
    return data;
  };

  isLoggedIn = async () => {
    const { data } = await this.service.get("/auth/isLoggedIn");
    return data;
  };

  logout = async () => {
    const { data } = await this.service.get("/auth/logout");
  };
}
