const ContactRoute = require("express").Router();

const { ContactPost, ContactGet, ContactReply, Emailcheck } = require("../controller/contactController");

ContactRoute.post("/contact-add", ContactPost)

ContactRoute.get("/contact-get", ContactGet);

ContactRoute.post("/contact-reply", ContactReply)

ContactRoute.get("/email", Emailcheck)

module.exports = ContactRoute;