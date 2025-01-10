const TruckModal = require("../model/TruckModal");
const catchAsync = require("../utils/catchAsync");
const { errorResponse, successResponse, validationErrorResponse } = require("../utils/ErrorHandling");
const { v4: uuidv4 } = require('uuid');
const Loggers = require('../utils/Logger');
const uuid = uuidv4()


exports.createTruck = catchAsync(async (req, res) => {
    try {
        const { truck_number } = req.body;
        const truck_id = uuid;
        if (!truck_number) {
            Loggers.error({
                message: 'All fields are required',
            });
            return validationErrorResponse(res, 'All fields are required');
        }
        const TruckNumber = await TruckModal.findOne({ truck_number: truck_number });

        if (TruckNumber) {
            return successResponse(res, "Truck already exist ", result, 200);
        } else {
            const record = new TruckModal({
                truck_number, truck_id
            });
            const result = await record.save();
            return successResponse(res, "Truck Created ", result, 200);
        }

    } catch (error) {
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});

exports.getalltruck = catchAsync(async (req, res) => {
    try {
        const result = await TruckModal.find({});
        return successResponse(res, "All Truck ", result, 200);
    } catch (error) {
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});

exports.gettruckbyid = catchAsync(async (req, res) => {
    try {
        const { Id } = req.params;
        const result = await TruckModal.findOne({ truck_id: Id });
        if (!result) {
            return errorResponse(res, "Truck not found", 404);
        }
        return successResponse(res, "Truck Found", result, 200);
    } catch (error) {
        console.error(`Error fetching Truck: ${error.message}`);
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});





