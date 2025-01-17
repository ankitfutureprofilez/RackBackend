const express = require("express");
const Route = express.Router();
const { InventoryAdd, InventoryDeleteId, InventoryUpdateId, InventoryGetId, InventoryGet } = require("../controller/InventoryController");
const { verifyToken } = require("../controller/AuthController");

Route.post("/create", verifyToken, InventoryAdd);
Route.get("/all", InventoryGet)
Route.get("/get/:Id", InventoryGetId);
Route.put("/update/:Id",  verifyToken, InventoryUpdateId);
Route.delete("/delete/:Id",  verifyToken, InventoryDeleteId);

module.exports = Route;   