import axios from "axios";

export default class tripService {
  constructor() {
    this.service = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      withCredentials: true
    });
  }

  getMyTrips = async () => {
    const { data } = await this.service.get("/trip/getTripsByUser");
    return data;
  };

  create = async payload => {
    const { name, description } = payload;
    const { data } = await this.service.post("trip/createTrip", {
      name,
      description
    });
    return data;
  };

  getTripById = async id => {
    const { data } = await this.service.get(`trip/getTripById/${id}`);
    return data;
  };

  getInvitations = async id => {
    const { data } = await this.service.get(
      `trip/invitation/getTripInvitations/${id}`
    );
    return data;
  };

  sendInvitation = async (payload, id) => {
    const email = payload;
    const { data } = await this.service.post(`trip/invitation/send/${id}`, {
      email
    });
    return data;
  };

  deleteInvitation = async (payload, id) => {
    const invitationId = payload;
    const { data } = await this.service.post(`trip/invitation/remove/${id}`, {
      invitationId
    });
    return data;
  };

  getInvitation = async id => {
    const { data } = await this.service.get(`public/getInvitation/${id}`);
    return data;
  };

  acceptInvitation = async id => {
    const { data } = await this.service.get(`trip/invitation/accept/${id}`);
    return data;
  };

  addDestination = async (payload, id) => {
    const { name, latitude, longitude } = payload;
    const { data } = await this.service.post(`trip/destination/add/${id}`, {
      name,
      latitude,
      longitude
    });
    return data;
  };

  deleteDestination = async (payload, id) => {
    const destinationId = payload;
    const { data } = await this.service.post(`trip/destination/remove/${id}`, {
      destinationId
    });
    return data;
  };

  changeOrderDestination = async (payload, id) => {
    debugger;
    const { destId, secondDestSeq, secondDestId, destSeq } = payload;
    const { data } = await this.service.post(`trip/destination/change/${id}`, {
      destId,
      secondDestSeq,
      secondDestId,
      destSeq
    });
    return data;
  };
}
