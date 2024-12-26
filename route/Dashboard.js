const ContactRoute = require("express").Router();

const { GarphApi, getCount, search } = require("../controller/DashboardController");

ContactRoute.get("/dashboard", getCount);
ContactRoute.get("/graph", GarphApi);
ContactRoute.post("/search", search);

module.exports = ContactRoute;