const catchAsync = require("../utils/catchAsync");
const User = require("../model/User");
const Booking = require("../model/Booking");
const Enquiry = require("../model/Enquiry");
const Package = require("../model/Package");
const payment = require("../model/payment");
const logger = require("../utils/Logger");


exports.getCount = catchAsync(async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const bookingCount = await Booking.countDocuments();
        const RecentCount = await Enquiry.countDocuments();
        const packages = await Package.find({}).limit(3);
        const EnquiryData = await Enquiry.find({}).limit(3);
        return res.status(200).json({
            status: true,
            message: " Data retrieved successfully",
            userCount: userCount,
            bookingCount: bookingCount,
            EnquiryCount: RecentCount,
            packages: packages,
            EnquiryData: EnquiryData
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "An error occurred while fetching the user count.",
            error: error.message,
        });
    }
});


exports.GarphApi = catchAsync(async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const results = await payment.aggregate([
            {
                $project: {
                    payment_status: 1,
                    year: { $year: '$created_at' },
                    month: { $month: '$created_at' }
                }
            },
            {
                $match: {
                    year: currentYear
                }
            },
            {
                $group: {
                    _id: {
                        year: '$year',
                        month: '$month',
                        payment_status: '$payment_status'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    payment_status: '$_id.payment_status',
                    count: 1
                }
            }
        ]);

        // Format the results into the desired data structure
        const months = [
            'Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        let formattedData = months.map((month, index) => {
            const monthData = results.filter(row => row.month === index + 1);
            const paymentStatusCount = {
                Failed: 0,
                Successful: 0,
                Pending: 0
            };

            monthData.forEach(data => {
                if (data.payment_status === 'canceled') paymentStatusCount.Failed += data.count;
                if (data.payment_status === 'success') paymentStatusCount.Successful += data.count;
                if (data.payment_status === 'pending') paymentStatusCount.Pending += data.count;
            });

            return {
                name: month,
                Failed: paymentStatusCount.Failed,
                Successful: paymentStatusCount.Successful,
                Pending: paymentStatusCount.Pending
            };
        });

        res.status(200).json(formattedData);
    } catch (err) {
        console.error('Error fetching payment data:', err);
        logger.error('Error fetching payment data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);


exports.search = catchAsync(async (req, res, next) => {
    try {
        const { type, _id } = req.body;
        if (!type) {
            return res.status(400).json({
                status: false,
                message: "Both 'type'  are required.",
            });
        }
        const models = {
            payment: payment,
            booking: Booking,
            package: Package
        };

        if (!models[type]) {
            return res.status(400).json({
                status: false,
                message: "Invalid type. Valid types are 'user', 'payment', and 'booking'.",
            });
        }

        // Fetch data from the respective model
        const data = await models[type].findById(_id);

        if (!data) {
            return res.status(404).json({
                status: false,
                message: `No data found for type '${type}' with the given ID.`,
            });
        }

        // Return the response
        return res.status(200).json({
            status: true,
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} data retrieved successfully.`,
            data: data ? data : userData,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        logger.error("Error fetching data:", error);
        return res.status(500).json({
            status: false,
            message: "An error occurred while fetching data.",
            error: error.message,
        });
    }
});
