const EnquireModal = require("../model/Enquiry");
const catchAsync = require("../utils/catchAsync");
const emailTemplate = require("../emailTemplates/replyMessage");
const sendEmail = require("../utils/EmailMailler");
const { validationErrorResponse, errorResponse, successResponse } = require("../utils/ErrorHandling");
const logger = require("../utils/Logger");

exports.EnquiryPost = catchAsync(async (req, res) => {
    const { email, name, message, eventname, event_type, attendees, phone_code, phone_number } = req.body;

    const record = new EnquireModal({
        email, name, message, phone_code, phone_number, eventname, event_type, attendees, enquire_status: "pending"
    });

    const result = await record.save();
    if (result) {
        res.json({
            status: true,
            message: "You have been Enquiry successfully !!.",
        });
    } else {
        res.json({
            status: false,
            error: result,
            message: "Failed to Enquiry.",
        });
    }
});

exports.EnquiryGet = catchAsync(async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const totalEnquireModal = await EnquireModal.countDocuments();
        const Enquiryget = await EnquireModal.find({}).sort({ created_at: -1 })
            .skip(skip)
            .limit(limit);
        const totalPages = Math.ceil(totalEnquireModal / limit);
        res.status(200).json({
            data: {
                Enquiryget: Enquiryget,
                totalEnquireModal: totalEnquireModal,
                totalPages: totalPages,
                currentPage: page,
                perPage: limit,
                nextPage: page < totalPages ? page + 1 : null,
                previousPage: page > 1 ? page - 1 : null,
            },
            msg: "Enquiryget Get",
        });
    } catch (error) {
        res.status(500).json({
            msg: "Failed to fetch Enquiryget",
            error: error.message,
        });
    }
});


exports.EnquiryGetUser = catchAsync(async (req, res, next) => {
    try {
        const userId = req.User._id;
        const enquiries = await EnquireModal.find({ userId: userId }).populate({
            path: 'userId',
            select: "username email"
            //  model: 'User'
        });
        if (!enquiries || enquiries.length === 0) {
            return res.status(404).json({
                msg: "No enquiries found for this user",
            });
        }

        res.status(200).json({
            data: enquiries,
            msg: "Enquiries with user data fetched successfully",
        });
    } catch (error) {
        res.status(500).json({
            msg: "Failed to fetch enquiries",
            error: error.message,
        });
    }
});


exports.EnquiryUpdateStatus = catchAsync(async (req, res) => {
    try {
        const { _id, enquire_status } = req.body;
        if (!_id || !enquire_status) {
            return res.status(400).json({
                message: "enquire ID and status are required.",
                status: false,
            });
        }

        const Enquire = await EnquireModal.findById(_id);
        if (!Enquire) {
            return res.status(404).json({
                message: "EnquireModal not found",
                status: false,
            });
        }

        Enquire.enquire_status = enquire_status;
        await Enquire.save();

        res.status(200).json({
            message: `Enquiry status updated to ${enquire_status}`,
            status: true,
            data: Enquire,
        });
    } catch (error) {
        console.error(error);
        logger.error(error);
        res.status(500).json({
            message: "Internal Server Error",
            status: false,
        });
    }
});


exports.EnquiryReply = catchAsync(
    async (req, res) => {
        const { _id, reply_message, enquire_status } = req.body;
        if (!_id || !reply_message || !enquire_status) {
            return validationErrorResponse(res, "All fields (Id, reply_message, enquire_status) are required.");
        }
        try {
            const enquiry = await EnquireModal.findById(_id);
            if (!enquiry) {
                return errorResponse(res, 404, "Enquiry not found.");
            }
            const updatedEnquiry = await EnquireModal.findByIdAndUpdate(
                _id,
                {
                    reply_message,
                    enquire_status,
                },
                { new: true }
            );
    
            const subject = "Thank you for your Enquiry";
            // email: 'ankit.jain@futureprofilez.com',
            // message: 'hello  sir ',
            // reply_message: 'Hello',
            // eventname: 'Birthday party',
            // event_type: 'cack food dj',
            // attendees: 100,
            // // enquire_status: 'active',
            if (updatedEnquiry) {
                try {
                    await sendEmail({
                        email: updatedEnquiry.email,
                        name: updatedEnquiry.name?.split(' ')?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase())?.join(' '),
                        message: reply_message,
                        subject: subject,
                        emailTemplate: emailTemplate
                    }
    
                    );
                } catch (emailError) {
                    console.error("Email sending failed:", emailError);
                    logger.error("Email sending failed:", emailError);
                    return errorResponse(res, 500, "Failed to send email notification.");
                }
    
                return successResponse(res, "You have successfully replied to the enquiry!");
            } else {
                return errorResponse(res, 400, "No changes were made to the enquiry.");
            }
        } catch (error) {
            console.error("Error during enquiry reply:", error);
            logger.error("Error during enquiry reply:", error);
            return errorResponse(res, 500, "Failed to update the enquiry.");
        }
    }
);