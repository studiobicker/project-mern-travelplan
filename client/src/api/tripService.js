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

  getTripById = async id => {
    const { data } = await this.service.get(`trip/getTripById/${id}`);
    return data;
  };

  getTripDestinations = async id => {
    const { data } = await this.service.get(`trip/getTripDestinations/${id}`);
    return data;
  };

  getTripMembers = async id => {
    const { data } = await this.service.get(`trip/getTripMembers/${id}`);
    return data;
  };

  getTripMessages = async id => {
    const { data } = await this.service.get(`trip/getTripMessages/${id}`);
    return data;
  };

  getInvitations = async id => {
    const { data } = await this.service.get(
      `trip/invitation/getTripInvitations/${id}`
    );
    return data;
  };

  sendInvitation = async (payload, id) => {
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
