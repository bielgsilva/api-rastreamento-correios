const express = require("express");
const routes = express();

routes.get("/", (request, response) => {
  return response.json({ message: "Server is Running" });
});

module.exports = routes;
