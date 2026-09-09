const workLogsModel = require('../../models/admin/worklogsModel');

exports.getAllWorkLogs = async (req, res) => {
    const {
        search = '',
        page = 1,
        limit = 10,
        sort = 'newest',
        workDate = ''
    } = req.query;

    try {
        const worklog = await workLogsModel.getAllWorkLogs(search, Number(page), Number(limit), sort, workDate);

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

exports.downloadWorkLogs = async (req, res) => {

    try {

        const search = req.query.search || '';
        const sort = req.query.sort || 'newest';
        const workDate = req.query.workDate || '';

        console.log("========== DOWNLOAD ==========");
        console.log("search:", search);
        console.log("sort:", sort);
        console.log("workDate:", workDate);

        const worklogs = await workLogsModel.downloadWorkLogs(
            search,
            sort,
            workDate
        );

        console.log("WORKLOGS RECEIVED:", worklogs);
        console.log("WORKLOG COUNT:", worklogs.length);

        const headers = [
            'Sl No',
            'Date',
            'Employee',
            'Entered By Employee',
            'Department',
            'Project',
            'Activity',
            'Sub Activity',
            'Work Type',
            'Duration',
            'Remarks'
        ];

        const csvRows = [];

        csvRows.push(headers.join(','));

        worklogs.forEach((worklog, index) => {

            const durationMinutes = Number(
                worklog.duration_minutes ?? 0
            );

            const hours = Math.floor(durationMinutes / 60);
            const minutes = durationMinutes % 60;

            const row = [
                index + 1,
                worklog.work_date
                    ? new Date(worklog.work_date).toLocaleDateString('en-IN')
                    : '',
                worklog.employee_name ?? '',
                worklog.entered_by_employee_name ?? '',
                worklog.department_name ?? '',
                worklog.project_name ?? '',
                worklog.activity_name ?? '',
                worklog.sub_activity_name ?? '',
                worklog.work_type_name ?? '',
                `${hours}h ${minutes}m`,
                worklog.remarks ?? ''
            ];

            csvRows.push(
                row
                    .map(value => {
                        const safeValue = value ?? '';
                        return `"${String(safeValue).replace(/"/g, '""')}"`;
                    })
                    .join(',')
            );
        });

        const csv = csvRows.join('\r\n');

        const filename = workDate
            ? `work_logs_${workDate}.csv`
            : 'work_logs_all.csv';

        res.status(200);

        res.setHeader(
            'Content-Type',
            'text/csv; charset=utf-8'
        );

        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${filename}"`
        );

        return res.send(csv);

    } catch (err) {

        console.error("DOWNLOAD ERROR:", err);

        return res.status(500).json({
            success: false,
            message: 'Failed to download work logs',
            error: err.message
        });
    }
};