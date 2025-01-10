
const express = require("express");
const Route = express.Router();
const { createTruck, getalltruck, gettruckbyid } = require("../controller/TruckController");


Route.post("/create", createTruck);

Route.get("/all", getalltruck);

Route.get(`/get/:Id`, gettruckbyid);

module.exports = Route;   