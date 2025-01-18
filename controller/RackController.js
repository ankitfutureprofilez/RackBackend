const RackModal = require("../model/RackModal");
const catchAsync = require("../utils/catchAsync");
const { errorResponse, successResponse, validationErrorResponse, successDataResponse } = require("../utils/ErrorHandling");
const { v4: uuidv4 } = require('uuid');
const Loggers = require('../utils/Logger');
const truck = require("../model/TruckModal");
const Rackchecklistmodal = require("../model/RackCheckModal");
const User = require("../model/AuthModal");
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
        const Trucknumber = await truck.findOne({ truck_id })
        if (!Trucknumber) {
            Loggers.error({
                message: 'Please choose correct truck',
            });
            return validationErrorResponse(res, 'Please choose correct truck');
        }

        const RackNumber = await RackModal.findOne({ rack_number: rack_number });
        if (RackNumber) {
            return successResponse(res, "Rack already exist ", RackNumber, 200);
        } else {
            const record = new RackModal({
                rack_number,
                TruckId: Trucknumber?._id,
                rack_id
            });
            const result = await record.save();
            return successResponse(res, "Rack Created ", result, 200);
        }

    } catch (error) {
        console.log("error", error)
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});

exports.getallrack = catchAsync(async (req, res) => {
    try {
        const result = await RackModal.find({}).populate("TruckId");
        return successResponse(res, "All Racks with Checklist", result, 200);
    } catch (error) {
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});

exports.getrackbyid = catchAsync(async (req, res) => {
    try {
        const { Id } = req.params;
        const result = await RackModal.findOne({ rack_id: Id });
        if (!result) {
            return errorResponse(res, "Rack not found", 404);
        }
        const Rack_data = await Rackchecklistmodal.findOne({ Rack_id: result._id })
        // .populate({
        //     path :"user_roles.user_id" ,
        //     select :"-password"
        // });
        return successDataResponse(res, "Rack Found", result, Rack_data, 200);
    } catch (error) {
        console.error(`Error fetching rack: ${error.message}`);
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});

exports.updaterack = catchAsync(async (req, res) => {
    try {
        const { rack_id } = req.params;
        const { rack_number, truck_number } = req.body;
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
        const rack = await RackModal.findOne({ rack_id });
        if (!rack) {
            return errorResponse(res, "Rack not found", 404);
        }
        const rackChecklist = await Rackchecklistmodal.findOneAndDelete({ Rack_id: rack._id });
        if (!rackChecklist) {
            return errorResponse(res, "Associated rack checklist not found", 404);
        }
        const record = await RackModal.findByIdAndDelete(rack?._id);
        if (!record) {
            return errorResponse(res, "Rack not found", 404);
        }
        return successResponse(res, "Rack and its associated checklist deleted successfully", null, 204);
    } catch (error) {
        console.error(`Error deleting rack: ${error.message}`);
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});

exports.createRackChecklist = catchAsync(async (req, res) => {
    try {
        const userId = req?.User?._id;
        if (!userId) {
            Loggers.warn("User is not authorized or Token is missing")
            return validationErrorResponse(res, "User is not authorized or Token is missing")
        }
        const userprofile = await User.findById(userId).select('-password');
        if (!userprofile) {
            Loggers.error("User profile not found")
            return errorResponse(res, "User profile not found")
        }
        const {
            inspected,
            Arm_replace,
            Breact_replace,
            Breack_replair,
            cable_replace,
            cable_replair,
            caster_rig_replace,
            caster_rig_repair,
            curtain_replace,
            curtain_repair,
            dumange_replace,
            dumange_repair,
            fork_guide_replace,
            fork_guide_repair,
            gate_replace,
            gate_repair,
            hitch_replace,
            hitch_repair,
            kickplate_replace,
            kickplate_repair,
            latch_repair,
            latch_replace,
            latch_ramp,
            lid_replace,
            lid_repair,
            lock_all,
            scrap,
            other,
            placeApp,
            repaint,
            Rifdcomm,
            Rifdrasn,
            rifdtgrp,
            Sewrpr,
            shlfrpr,
            shlfrpl,
            shockinp,
            shockrpl,
            shockrpr,
            Stcapapp,
            stcptgap,
            stnclrst,
            straprpr,
            strfrme,
            tchpaint,
            tongrpl,
            tongrpr,
            welding,
            wheelrpl,
            wheelrpr,
            wheelsha,
            matrials_add = [],
            Rack_id,
        } = req.body;

        const rackExists = await RackModal.findOne(Rack_id);
        if (!rackExists) {
            Loggers.warn("Rack not found")
            return validationErrorResponse(res, 'Rack not found');
        }
        const checklistExists = await Rackchecklistmodal.findOne(Rack_id);
        if (checklistExists) {
            Loggers.warn("Rack checklist already exists");
            return validationErrorResponse(res, 'Rack checklist already exists');
        }
        const Rack_checklist_id = uuid;
        if (!Rack_checklist_id) {
            Loggers.warn("Rack Checklist ID are required")
            return validationErrorResponse(res, 'Rack Checklist ID are required');
        }
        const newRackChecklist = new Rackchecklistmodal({
            Rack_checklist_id,
            inspected,
            Arm_replace,
            Breact_replace,
            Breack_replair,
            cable_replace,
            cable_replair,
            caster_rig_replace,
            caster_rig_repair,
            curtain_replace,
            curtain_repair,
            dumange_replace,
            dumange_repair,
            fork_guide_replace,
            fork_guide_repair,
            gate_replace,
            gate_repair,
            hitch_replace,
            hitch_repair,
            kickplate_replace,
            kickplate_repair,
            latch_repair,
            latch_replace,
            latch_ramp,
            lid_replace,
            lid_repair,
            lock_all,
            scrap,
            other,
            placeApp,
            repaint,
            Rifdcomm,
            Rifdrasn,
            rifdtgrp,
            Sewrpr,
            shlfrpr,
            shlfrpl,
            shockinp,
            shockrpl,
            shockrpr,
            Stcapapp,
            stcptgap,
            stnclrst,
            straprpr,
            strfrme,
            tchpaint, tongrpl, tongrpr, welding, wheelrpl, wheelrpr, wheelsha, matrials_add, Rack_id: rackExists?._id,
            user_roles: [{
                user_id: userprofile._id,
                role: userprofile?.role,
            }],
        });
        const savedRackChecklist = await newRackChecklist.save();
        return successResponse(res, 'Rack Checklist created successfully', savedRackChecklist, 201);

    } catch (error) {
        Loggers.error('Error creating Rack Checklist:', error);
        return errorResponse(res, error.message || 'Internal Server Error', 500);
    }
});

exports.updaterackchecklist = catchAsync(async (req, res) => {
    const userId = req?.User?._id;
    if (!userId) {
        Loggers.warn("User is not authorized or Token is missing")
        return validationErrorResponse(res, "User is not authorized or Token is missing")
    }
    const userprofile = await User.findById(userId).select('-password');
    if (!userprofile) {
        Loggers.error("User profile not found")
        return errorResponse(res, "User profile not found")
    }
    try {
        const { Rack_checklist_id } = req.params;
        const {
            inspected,
            Arm_replace,
            Breact_replace,
            Breack_replair,
            cable_replace,
            cable_replair,
            caster_rig_replace,
            caster_rig_repair,
            curtain_replace,
            curtain_repair,
            dumange_replace,
            dumange_repair,
            fork_guide_replace,
            fork_guide_repair,
            gate_replace,
            gate_repair,
            hitch_replace,
            hitch_repair,
            kickplate_replace,
            kickplate_repair,
            latch_repair,
            latch_replace,
            latch_ramp,
            lid_replace,
            lid_repair,
            lock_all,
            scrap,
            other,
            placeApp,
            repaint,
            Rifdcomm,
            Rifdrasn,
            rifdtgrp,
            Sewrpr,
            shlfrpr,
            shlfrpl,
            shockinp,
            shockrpl,
            shockrpr,
            Stcapapp,
            stcptgap,
            stnclrst,
            straprpr,
            strfrme,
            tchpaint,
            tongrpl,
            tongrpr,
            welding,
            wheelrpl,
            wheelrpr,
            wheelsha,
            matrials_add,
        } = req.body;
        const rack = await Rackchecklistmodal.findOneAndUpdate({ Rack_checklist_id }, {
            inspected,
            Arm_replace,
            Breact_replace,
            Breack_replair,
            cable_replace,
            cable_replair,
            caster_rig_replace,
            caster_rig_repair,
            curtain_replace,
            curtain_repair,
            dumange_replace,
            dumange_repair,
            fork_guide_replace,
            fork_guide_repair,
            gate_replace,
            gate_repair,
            hitch_replace,
            hitch_repair,
            kickplate_replace,
            kickplate_repair,
            latch_repair,
            latch_replace,
            latch_ramp,
            lid_replace,
            lid_repair,
            lock_all,
            scrap,
            other,
            placeApp,
            repaint,
            Rifdcomm,
            Rifdrasn,
            rifdtgrp,
            Sewrpr,
            shlfrpr,
            shlfrpl,
            shockinp,
            shockrpl,
            shockrpr,
            Stcapapp,
            stcptgap,
            stnclrst,
            straprpr,
            strfrme,
            tchpaint,
            tongrpl,
            tongrpr,
            welding,
            wheelrpl,
            wheelrpr,
            wheelsha,
            matrials_add,
        }, { new: true });
        const existingUserRole = rack.user_roles.find(role => role.user_id.equals(userprofile._id));
        if (!existingUserRole) {
            // Add new user role
            rack.user_roles.push({
                user_id: userprofile._id,
                role: userprofile?.role,
            });
        }

        await rack.save();
        if (!rack) {
            return errorResponse(res, "Rack not found", 404);
        }
        return successResponse(res, "Rack updated successfully", rack, 200);
    } catch (error) {
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});

exports.getrackbynumber = catchAsync(async (req, res) => {
    try {
        const { rack_number } = req.params;
        const result = await RackModal.findOne({ rack_number: rack_number });
        if (!result) {
            return errorResponse(res, "Rack not found", 404);
        }
        const Rack_data = await Rackchecklistmodal.findOne({ Rack_id: result._id })
            // .populate("user_roles.user_id")
            ;
        return successDataResponse(res, "Rack Found", result, Rack_data, 200);
    } catch (error) {
        console.error(`Error fetching rack: ${error.message}`);
        return errorResponse(res, error.message || "Internal Server Error", 500);
    }
});