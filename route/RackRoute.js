const express = require("express");
const Route = express.Router();
const { createrack, getallrack, updaterack, deleterack, getrackbyid, createRackChecklist, updaterackchecklist, getrackbynumber } = require("../controller/RackController");
const { verifyToken } = require("../controller/AuthController");


Route.post("/create", createrack);

Route.get("/all", getallrack);

Route.put("/update/:rack_id", updaterack);

Route.delete("/delete/:rack_id", deleterack);

Route.get(`/get/:Id`, getrackbyid);

Route.post("/create_checklist", verifyToken, createRackChecklist);

Route.put("/update_checklist/:Rack_checklist_id", verifyToken,  updaterackchecklist);

Route.get("/number/:rack_number" , getrackbynumber)

module.exports = Route;   