const RackModal = require("../model/RackModal");
const catchAsync = require("../utils/catchAsync");
const { errorResponse, successResponse, validationErrorResponse } = require("../utils/ErrorHandling");
const { v4: uuidv4 } = require('uuid');
const Loggers = require('../utils/Logger');
const truck = require("../model/TruckModal");
const uuid = uuidv4()


exports.createrack = catchAsync(async (req, res) => {
    try {
        const { rack_number, truck_id } = req.body;
        const rack_id = uuid;
        if (!rack_number || !truck_id) {
            Loggers.error({
                message: 'All fields are required',
            });
            return validationErrorResponse(res, 'All fields are required');
        }
        const Trucknumber = await truck.findOne({ truck_id}) 
        if (!Trucknumber) {
            Loggers.error({
                message: 'Please choose correct truck',
            });
            return validationErrorResponse(res, 'Please choose correct truck' );
        }
      
        const RackNumber = await RackModal.findOne({ rack_number: rack_number });
        if (RackNumber) {
            return successResponse(res, "Rack already exist ", RackNumber, 200);
        } else {
            const record = new RackModal({
                rack_number,
                TruckId : Trucknumber?._id,
                 rack_id
            });
            const result = await record.save();
            return successResponse(res, "Rack Created ", result, 200);
        }

    } catch (error) {
        console.log("error" ,error)
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});

exports.getallrack = catchAsync(async (req, res) => {
    try {
        const result = await RackModal.find({}).populate("TruckId");
        return successResponse(res, "All Racks ", result, 200);
    } catch (error) {
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});

exports.getrackbyid = catchAsync(async (req, res) => {
    try {
        const { Id } = req.params;
        console.log(`Fetching rack with ID: ${Id}`);

        const result = await RackModal.findOne({ rack_id: Id });
        if (!result) {
            return errorResponse(res, "Rack not found", 404);
        }

        return successResponse(res, "Rack Found", result, 200);
    } catch (error) {
        console.error(`Error fetching rack: ${error.message}`);
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});


exports.updaterack = catchAsync(async (req, res) => {
    try {
        const { rack_id } = req.params;
        const { rack_number, truck_number } = req.body;
        console.log(`Fetching rack with ID: ${rack_id}`);
        const result = await RackModal.findOne({ rack_id });
        if (!result) {
            return errorResponse(res, "Rack not found", 404);
        }
        const rack = await RackModal.findByIdAndUpdate(result?._id, { rack_number, truck_number }, { new: true });
        if (!rack) {
            return errorResponse(res, "Rack not found", 404);
        }
        return successResponse(res, "Rack updated successfully", rack, 200);
    } catch (error) {
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});

exports.deleterack = catchAsync(async (req, res) => {
    try {
        const { rack_id } = req.params;
        const rack = await RackModal.findByIdAndDelete(rack_id);
        if (!rack) {
            return errorResponse(res, "Rack not found", 404);
        }
        return successResponse(res, "Rack deleted successfully", null, 204);
    } catch (error) {
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});


