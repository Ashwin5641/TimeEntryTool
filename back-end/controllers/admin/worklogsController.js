const workLogsModel = require('../../models/admin/worklogsModel');

exports.getAllWorkLogs = async (req, res) => {
    const {
        search = '',
        page = 1,
        limit = 10,
        sort = 'newest'
    } = req.query;

    try {
        const worklog = await workLogsModel.getAllWorkLogs(search, Number(page), Number(limit), sort);

        return res.status(200).json({
            success: true,
            data: worklog.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(worklog.total / limit),
                totalRecords: worklog.total
            }
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later'
        })
    }
}

exports.getTodaySummary = async (req, res) => {
    const { employee_id } = req.params;

    if (!employee_id) {
        return res.status(400).json({
            success: false,
            message: 'Employee ID is required'
        });
    }

    try {
        const summary = await workLogsModel.getTodaySummary(employee_id);

        return res.status(200).json({
            success: true,
            data: summary
        });

    } catch (err) {
        console.error("Today Summary Error:", err);

        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        });
    }
};