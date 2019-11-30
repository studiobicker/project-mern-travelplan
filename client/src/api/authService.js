import axios from "axios";

export default class authService {
  constructor() {
    this.service = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      withCredentials: true
    });
  }

  login = async payload => {
    const { username, password } = payload;
    const { data } = await this.service.post("auth/login", {
      username,
      password
    });
    return data;
  };

  register = async payload => {
    const { username, password, email } = payload;
    const { data } = await this.service.post("auth/register", {
      username,
      password,
      email
    });
    return data;
  };

  isLoggedIn = async () => {
    const { data } = await this.service.get("/auth/isLoggedIn");
    debugger;
    return data;
  };

  logout = async () => {
    const { data } = await this.service.get("/auth/logout");
  };
}
