const express = require("express");
const Route = express.Router();
const { createrack, getallrack, updaterack, deleterack, getrackbyid } = require("../controller/RackController");


Route.post("/create", createrack);

Route.get("/all", getallrack);

Route.put("/update/:rack_id", updaterack);

Route.delete("/delete/:rack_id", deleterack);

Route.get(`/get/:Id`, getrackbyid);


module.exports = Route;   