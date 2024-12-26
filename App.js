const dotenv = require("dotenv");
dotenv.config();

const fs = require('fs');
const B2 = require('backblaze-b2');
require("./dbconfigration");
const express = require("express");
const app = express();
const cors = require("cors");
const StripeRoute = require("./route/StripeRoute");
const multer = require("multer");
const { verifyToken } = require("./controller/AuthController");
const Files = require("./model/Files");
const cron = require('node-cron');

const UserRoute = require("./route/UserRoute")
const enauiryroute = require("./route/Enquiry")
const packageroute = require("./route/Package")
const bookingroute = require("./route/Booking")
const Contactroute = require("./route/Contact")
const placeRoutes = require("./route/placeRoute")
const currencyRoutes = require("./route/CurrencyRoute")
const commonRoutes = require("./route/Dashboard");
const { UpdateCurrencyRates } = require("./controller/CurrencyController");
const logger = require("./utils/Logger");
const corsOptions = {
  origin: "*", // Allowed origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: '*', // Allow all headers
  credentials: true,
  optionsSuccessStatus: 200, // for legacy browsers
}
const upload = multer({ dest: 'uploads/' });

app.use(cors(corsOptions));
app.use(express.json({ limit: '2000mb' }));
app.use(express.urlencoded({ extended: true }));

app.use("/user", UserRoute)
app.use("/common", commonRoutes)
app.use("/stripe", StripeRoute)
app.use("/enquiry", enauiryroute)
app.use("/package", packageroute)
app.use("/booking", bookingroute)
app.use("/contact", Contactroute)
app.use('/place', placeRoutes);
app.use('/currency', currencyRoutes);

const bucket_name = process.env.BUCKET_NAME;
const bucket_id = process.env.BUCKET_ID;
const APP_ID = process.env.CLOUD_APPLICATION_ID;
const APP_KEY = process.env.CLOUD_APPLICATION_KEY;

const b2 = new B2({
  applicationKeyId: APP_ID,
  applicationKey: APP_KEY
});
async function authorizeB2() {
  try {
    await b2.authorize();
    // console.log('B2 authorization successful');
    logger.info("B2 authorization successful");
  } catch (error) {
    console.error('Error authorizing B2:', error);
    logger.error('Error authorizing B2:', error);
  }
}
const checkUploadLimit = (req, res, next) => {
  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

  if (req.file && req.file.size > MAX_SIZE) {
    return res.status(400).json({
      status: false,
      message: 'File size exceeds limit',
    });
  }

  next(); // Proceed to the next middleware or route handler
};

app.post('/cloud/upload', cors(corsOptions), verifyToken, upload.single('file'), checkUploadLimit, async (req, res) => {
  await authorizeB2();
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ status: false, message: 'No file found to upload.' });
    }
    const sanitizedFileName = file.originalname.trim().replace(/\s+/g, '-');
    const uploadUrlResponse = await b2.getUploadUrl({
      bucketId: bucket_id
    });
    const fileData = fs.readFileSync(file.path);

    const uploadResponse = await b2.uploadFile({
      uploadUrl: uploadUrlResponse.data.uploadUrl,
      uploadAuthToken: uploadUrlResponse.data.authorizationToken,
      fileName: sanitizedFileName,
      data: fileData
    });

    fs.unlinkSync(file.path);
    const fileUrl = `https://f003.backblazeb2.com/file/${bucket_name}/${sanitizedFileName}`;

    if (uploadResponse) {
      const uploadedfile = new Files({
        name: file.originalname,
        mime: uploadResponse.data.contentType,
        filename: uploadResponse.data.fileName,
        fileId: uploadResponse.data.fileId,
        url: fileUrl,
        user: req.User?._id,
        size: uploadResponse.data.contentLength,
      });

      const fileUploaded = await uploadedfile.save();
      res.status(201).json({
        status: true,
        message: "File uploaded to storage.",
        file_data: fileUploaded,
        fileUrl: fileUrl,
      });
    } else {
      res.status(500).json({
        status: false,
        message: "File failed to upload on cloud.",
        error: uploadResponse.data
      });
    }
  } catch (error) {
    logger.error("B2 authorization successful");
    // console.log("error", error)
    res.status(500).json({
      status: false,
      message: "File failed to upload on cloud.",
      error: error
    });
  }
});


cron.schedule("0 9 * * *", UpdateCurrencyRates);


const PORT = process.env.REACT_APP_SERVER_DOMIN;

app.get("/", (req, res) => {
  res.json({
    msg: 'Okay',
    status: 200,
  });
});

app.listen(PORT, () => console.log("Server is running at port : " + PORT));
