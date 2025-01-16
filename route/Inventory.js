const express = require("express");
const Route = express.Router();
const { InventoryAdd, InventoryDeleteId, InventoryUpdateId, InventoryGetId, InventoryGet } = require("../controller/InventoryController");

Route.post("/create", InventoryAdd);

Route.get("/all", InventoryGet)

Route.get("/get/:Id", InventoryGetId);

Route.put("/update/:Id", InventoryUpdateId);

Route.delete("/delete/:Id", InventoryDeleteId);

module.exports = Route;   