const InvoentryModal = require("../model/Invoentry");
const catchAsync = require("../utils/catchAsync");
const { errorResponse, successResponse, validationErrorResponse } = require("../utils/ErrorHandling");
const { v4: uuidv4 } = require('uuid');
const Loggers = require('../utils/Logger');
const uuid = uuidv4()


exports.InvertoryAdd = catchAsync(async (req, res) => {
    try {
        const { name, quantity, Image, description, categrios } = req.body;
        const inventory_id = uuid;
        if (!name || !quantity || !Image) {
            Loggers.error({
                message: 'All fields are required',
            });
            return validationErrorResponse(res, 'All fields are required');
        }
        const record = new InvoentryModal({
            name,
            quantity,
            description,
            Image,
            categrios,
            inventory_id
        });
        const result = await record.save();
        return successResponse(res, "Invoentry Created ", result, 200);

    } catch (error) {
        console.log("error", error)
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});

exports.InvertoryGet = catchAsync(async (req, res) => {
    try {
        const result = await InvoentryModal.find({}).populate("UserId");
        return successResponse(res, "All Invoentrys ", result, 200);
    } catch (error) {
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});

exports.InvertoryGetId = catchAsync(async (req, res) => {
    try {
        const { Id } = req.params;
        console.log(`Fetching Invoentry with ID: ${Id}`);

        const result = await InvoentryModal.findOne({ inventory_id: Id });
        if (!result) {
            return errorResponse(res, "Invoentry not found", 404);
        }

        return successResponse(res, "Invoentry Found", result, 200);
    } catch (error) {
        console.error(`Error fetching Invoentry: ${error.message}`);
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});


exports.InvertoryUpdateId = catchAsync(async (req, res) => {
    try {
        const { Id } = req.params;
        const { name, quantity, Image, description, categrios } = req.body;
        console.log(`Fetching Invoentry with ID: ${Id}`);
        const result = await InvoentryModal.findOne({ inventory_id: Id });
        if (!result) {
            return errorResponse(res, "Invoentry not found", 500);
        }
        const Invoentry = await InvoentryModal.findByIdAndUpdate(result?._id, { name, quantity, Image, description, categrios }, { new: true });
        if (!Invoentry) {
            return errorResponse(res, "Invoentry not found", 404);
        }
        return successResponse(res, "Invoentry updated successfully", Invoentry, 200);
    } catch (error) {
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});

exports.InvertoryDeleteId = catchAsync(async (req, res) => {
    try {
        const { Id } = req.params;
        const result = await InvoentryModal.findOne({ inventory_id: Id });
        if (!result) {
            return errorResponse(res, "Invoentry not found", 500);
        }
        const Invoentry = await InvoentryModal.findByIdAndDelete(result?._id);
        if (!Invoentry) {
            return errorResponse(res, "Invoentry not found", 404);
        }
        return successResponse(res, "Invoentry deleted successfully", null, 204);
    } catch (error) {
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});

