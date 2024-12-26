const CurrencyRoute = require("express").Router();

const { UpdateCurrencyRates, GetRate } = require("../controller/CurrencyController");

CurrencyRoute.get("/update", UpdateCurrencyRates);
CurrencyRoute.get("/get-rate/:currency", GetRate);

module.exports = CurrencyRoute;