import axios from "axios";

export default class tripService {
  constructor() {
    this.service = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      withCredentials: true
    });
  }

  getMyTrips = async () => {
    const { data } = await this.service.get("/trip/getMyTrips");
    return data;
  };

  create = async payload => {
    const { name, description, selectedLatLng } = payload;
    const { data } = await this.service.post("trip/createTrip", {
      name,
      description,
      country: selectedLatLng.label,
      latitude: selectedLatLng.value[0],
      longitude: selectedLatLng.value[1]
    });
    return data;
  };

  setCurrentTrip = async id => {
    debugger;
    const { data } = await this.service.get(`trip/setCurrentTrip/${id}`);
    return data;
  };

  getMyTrip = async id => {
    const { data } = await this.service.get(`trip/getMyTrip/${id}`);
    return data;
  };

  sendInvitation = async (payload, id) => {
    debugger;
    const { email, level } = payload;
    const { data } = await this.service.post(`trip/invitation/send/${id}`, {
      email,
      level: parseInt(level)
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

  compareEmail = async id => {
    const { data } = await this.service.get(`trip/invitation/compare/${id}`);
    return data;
  };

  getMyDestination = async id => {
    const { data } = await this.service.get(`trip/destination/getById/${id}`);
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

  addMessage = async (payload, id) => {
    debugger;
    const msg = payload;
    const { data } = await this.service.post(`trip/message/add/${id}`, {
      msg
    });
    return data;
  };

  deleteMessage = async (payload, id) => {
    const messageId = payload;
    const { data } = await this.service.post(`trip/message/remove/${id}`, {
      messageId
    });
    return data;
  };
}
