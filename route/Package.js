const { verifyToken } = require("../controller/AuthController");
const { packageadd, packageget, PackageUpdate, PackageIdDelete, packageStatusget, PackageUpdateStatus, PackagegetId, deleteFileHandler } = require("../controller/PackageController");

const package = require("express").Router();

package.post("/package-add", packageadd)

package.get("/package-get", packageget);

package.post("/package-update", verifyToken, PackageUpdate);

package.post("/package-delete", verifyToken, PackageIdDelete);

package.post("/package-get-id", PackagegetId);

package.get("/package-Status", packageStatusget);

package.post("/package-update-status", verifyToken, PackageUpdateStatus);

package.post("/delete", deleteFileHandler)

module.exports = package;