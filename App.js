const dotenv = require("dotenv");
dotenv.config();

require("./dbconfigration");
const express = require("express");
const app = express();
const cors = require("cors");
const UserRoute = require("./route/AuthRoute");
const RackRoute = require("./route/RackRoute");
const TruckRoute = require("./route/TruckRoute");
const InvoentryRoute = require("./route/Inventory")
const logger = require("./utils/Logger");

const corsOptions = {
  origin: "*", // Allowed origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: '*', // Allow all headers
  credentials: true,
  optionsSuccessStatus: 200, // for legacy browsers
}

app.use(cors(corsOptions));
app.use(express.json({ limit: '2000mb' }));
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.REACT_APP_SERVER_DOMIN;

app.get("/", (req, res) => {
  res.json({
    msg: 'Okay',
    status: 200,
  });
});

// Routing 
app.use("/auth", UserRoute);
app.use("/rack", RackRoute);
app.use("/truck", TruckRoute);
app.use("/inventory", InvoentryRoute);


app.listen(PORT, () => (logger.http("Server is running at port : " + PORT)));