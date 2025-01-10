const express = require("express");
const Route = express.Router();
const { InvertoryAdd, InvertoryGet, InvertoryGetId, InvertoryUpdateId, InvertoryDeleteId } = require("../controller/InventoryController");

Route.post("/create", InvertoryAdd);

Route.get("/all", InvertoryGet)

Route.get("/get/:Id", InvertoryGetId);

Route.put("/update/:Id", InvertoryUpdateId);

Route.delete("/delete/:Id", InvertoryDeleteId);

module.exports = Route;   