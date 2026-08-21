import api from "./api";

const authService = {

  login: (payload) =>
    api.post("/players/login", payload)
      .then((response) => response.data),

  getCurrentUser: () =>
    api.get("/players/me")
      .then((response) => response.data),

  logout: () =>
    api.post("/players/logout")
      .then((response) => response.data),

};

export default authService;