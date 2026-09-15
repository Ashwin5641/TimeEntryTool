const ExcelJS = require('exceljs');
const workLogsModel = require('../../models/admin/worklogsModel');

// ============================================================
// OPTIONAL CHART SUPPORT
// ============================================================

let ChartJSNodeCanvas = null;

try {
    ({ ChartJSNodeCanvas } = require('chartjs-node-canvas'));
} catch (err) {
    console.warn(
        'chartjs-node-canvas is not installed. Excel report will be generated without charts.'
    );
}


// ============================================================
// GET ALL WORK LOGS
// ============================================================

exports.getAllWorkLogs = async (req, res) => {

    const {
        search = '',
        page = 1,
        limit = 10,
        sort = 'newest',
        workDate = ''
    } = req.query;

    try {

        const worklog =
            await workLogsModel.getAllWorkLogs(
                search,
                Number(page),
                Number(limit),
                sort,
                workDate
            );

        return res.status(200).json({

            success: true,

            data: worklog.rows,

            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalPages:
                    Math.ceil(
                        worklog.total / Number(limit)
                    ),
                totalRecords: worklog.total
            }

        });

    } catch (err) {

        console.error(
            'Get All Work Logs Error:',
            err
        );

        return res.status(500).json({
            success: false,
            message: 'Please try again later'
        });

    }

};


// ============================================================
// TODAY SUMMARY
// ============================================================

exports.getTodaySummary = async (req, res) => {

    const { employee_id } = req.params;

    if (!employee_id) {

        return res.status(400).json({
            success: false,
            message: 'Employee ID is required'
        });

    }

    try {

        const summary =
            await workLogsModel.getTodaySummary(
                employee_id
            );

        return res.status(200).json({

            success: true,

            data: summary

        });

    } catch (err) {

        console.error(
            'Today Summary Error:',
            err
        );

        return res.status(500).json({

            success: false,

            message: 'Please try again later!'

        });

    }

};


// ============================================================
// GET EMPLOYEES WHO HAVE NOT LOGGED
// ============================================================
//
// Example:
// GET /admin/work-logs/not-logged?workDate=2026-09-15
//
// Only ACTIVE employees are considered.
//
// An employee is considered logged when at least one
// work_logs record exists for the selected date.
//
// ============================================================

exports.getEmployeesNotLogged = async (req, res) => {

    const {
        workDate = ''
    } = req.query;

    if (!workDate) {

        return res.status(400).json({

            success: false,

            message: 'Work date is required'

        });

    }

    try {

        const employees =
            await workLogsModel.getEmployeesNotLogged(
                workDate
            );

        const result =
            Array.isArray(employees)
                ? employees
                : [];

        return res.status(200).json({

            success: true,

            data: result,

            count: result.length,

            workDate

        });

    } catch (err) {

        console.error(
            'Get Employees Not Logged Error:',
            err
        );

        return res.status(500).json({

            success: false,

            message:
                'Failed to get employees who have not logged'

        });

    }

};


// ============================================================
// BASIC HELPERS
// ============================================================

const safeNumber = (value) => {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;

};


const minutesToHours = (minutes) => {

    return Number(
        (
            safeNumber(minutes) / 60
        ).toFixed(2)
    );

};


const formatMinutes = (minutes) => {

    const total =
        Math.max(
            0,
            Math.round(
                safeNumber(minutes)
            )
        );

    const hours =
        Math.floor(total / 60);

    const mins =
        total % 60;

    return `${hours}h ${mins}m`;

};


const cleanText = (
    value,
    fallback = 'Unknown'
) => {

    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ''
    ) {

        return fallback;

    }

    return String(value).trim();

};


// ============================================================
// DATE HELPER
// ============================================================

const getDateKey = (value) => {

    if (!value) {
        return null;
    }

    if (typeof value === 'string') {

        return value.slice(0, 10);

    }

    const date =
        value instanceof Date
            ? value
            : new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return null;

    }

    return date
        .toISOString()
        .slice(0, 10);

};


// ============================================================
// CREATE SUMMARY
// ============================================================

const createSummary = (
    worklogs,
    field,
    totalMinutes
) => {

    const map = {};

    worklogs.forEach(row => {

        const name =
            cleanText(
                row[field]
            );

        if (!map[name]) {

            map[name] = {

                name,

                logs: 0,

                minutes: 0

            };

        }

        map[name].logs += 1;

        map[name].minutes +=
            safeNumber(
                row.duration_minutes
            );

    });


    return Object.values(map)

        .map(item => {

            const hours =
                minutesToHours(
                    item.minutes
                );

            const percentage =
                totalMinutes > 0
                    ? Number(
                        (
                            item.minutes /
                            totalMinutes *
                            100
                        ).toFixed(2)
                    )
                    : 0;

            const avgHours =
                item.logs > 0
                    ? Number(
                        (
                            hours /
                            item.logs
                        ).toFixed(2)
                    )
                    : 0;

            return {

                name: item.name,

                logs: item.logs,

                minutes: item.minutes,

                hours,

                percentage,

                avgHours

            };

        })

        .sort(
            (a, b) =>
                b.minutes - a.minutes
        );

};


// ============================================================
// UNIQUE WORK DATES
// ============================================================

const getUniqueWorkDates = (
    worklogs
) => {

    const dates = new Set();

    worklogs.forEach(row => {

        const dateKey =
            getDateKey(
                row.work_date
            );

        if (dateKey) {

            dates.add(
                dateKey
            );

        }

    });

    return dates;

};


// ============================================================
// CELL STYLING
// ============================================================

const styleCell = (
    cell,
    options = {}
) => {

    const {

        bold = false,

        size = 11,

        horizontal = 'left',

        fill = null,

        fontColor = '000000',

        borderColor = 'D9D9D9'

    } = options;


    cell.font = {

        name: 'Calibri',

        size,

        bold,

        color: {
            argb: fontColor
        }

    };


    cell.alignment = {

        vertical: 'middle',

        horizontal,

        wrapText: true

    };


    if (fill) {

        cell.fill = {

            type: 'pattern',

            pattern: 'solid',

            fgColor: {
                argb: fill
            }

        };

    }


    cell.border = {

        top: {
            style: 'thin',
            color: {
                argb: borderColor
            }
        },

        bottom: {
            style: 'thin',
            color: {
                argb: borderColor
            }
        },

        left: {
            style: 'thin',
            color: {
                argb: borderColor
            }
        },

        right: {
            style: 'thin',
            color: {
                argb: borderColor
            }
        }

    };

};


// ============================================================
// SECTION TITLE
// ============================================================

const addSectionTitle = (
    sheet,
    row,
    startColumn,
    endColumn,
    title
) => {

    const cell =
        sheet.getCell(
            row,
            startColumn
        );

    cell.value =
        title;

    styleCell(
        cell,
        {

            bold: true,

            size: 13,

            fill: 'D9E2F3',

            fontColor: '1F1F1F'

        }
    );

    cell.alignment = {

        horizontal: 'left',

        vertical: 'middle',

        wrapText: true

    };


    if (endColumn > startColumn) {

        sheet.mergeCells(
            row,
            startColumn,
            row,
            endColumn
        );

    }


    // Increased from 25 to 32 so the title
    // is clearly visible in Excel.

    sheet.getRow(row).height = 32;

};


// ============================================================
// TABLE HEADER
// ============================================================

const addTableHeader = (
    sheet,
    row,
    startColumn,
    headers
) => {

    headers.forEach(
        (header, index) => {

            const cell =
                sheet.getCell(
                    row,
                    startColumn + index
                );

            cell.value =
                header;

            styleCell(
                cell,
                {

                    bold: true,

                    horizontal: 'center',

                    fill: 'EAF0F7',

                    fontColor: '1F1F1F'

                }
            );

        }
    );


    sheet.getRow(row).height = 28;

};


// ============================================================
// EMPTY MESSAGE
// ============================================================

const addEmptyTableMessage = (
    sheet,
    row,
    startColumn,
    endColumn,
    message = 'No data available'
) => {

    const cell =
        sheet.getCell(
            row,
            startColumn
        );

    cell.value =
        message;

    styleCell(
        cell,
        {
            horizontal: 'center'
        }
    );


    if (endColumn > startColumn) {

        sheet.mergeCells(
            row,
            startColumn,
            row,
            endColumn
        );

    }

};


// ============================================================
// SUMMARY TABLE
// ============================================================

const addSummaryTable = (
    sheet,
    startRow,
    startColumn,
    title,
    summary
) => {

    const endColumn =
        startColumn + 5;


    addSectionTitle(
        sheet,
        startRow,
        startColumn,
        endColumn,
        title
    );


    const headerRow =
        startRow + 1;


    addTableHeader(
        sheet,
        headerRow,
        startColumn,
        [
            'Name',
            'Entries',
            'Minutes',
            'Hours',
            'Avg Hours',
            'Share of Hours'
        ]
    );


    if (!summary.length) {

        addEmptyTableMessage(
            sheet,
            headerRow + 1,
            startColumn,
            endColumn
        );

        return headerRow + 1;

    }


    summary.forEach(
        (item, index) => {

            const row =
                headerRow +
                index +
                1;


            const values = [

                item.name,

                item.logs,

                item.minutes,

                item.hours,

                item.avgHours,

                item.percentage / 100

            ];


            values.forEach(
                (value, valueIndex) => {

                    const cell =
                        sheet.getCell(
                            row,
                            startColumn +
                            valueIndex
                        );

                    cell.value =
                        value;

                    styleCell(
                        cell,
                        {

                            horizontal:
                                valueIndex === 0
                                    ? 'left'
                                    : 'center'

                        }
                    );

                }
            );


            sheet.getCell(
                row,
                startColumn + 5
            ).numFmt =
                '0.00%';

        }
    );


    return (
        headerRow +
        summary.length
    );

};


// ============================================================
// KPI CARD
// ============================================================

const addKpiCard = (
    sheet,
    startColumn,
    row,
    label,
    value
) => {

    const labelCell =
        sheet.getCell(
            row,
            startColumn
        );


    labelCell.value =
        label;


    styleCell(
        labelCell,
        {

            bold: true,

            horizontal: 'center',

            fill: 'EAF0F7'

        }
    );


    const valueCell =
        sheet.getCell(
            row + 1,
            startColumn
        );


    valueCell.value =
        value;


    styleCell(
        valueCell,
        {

            bold: true,

            size: 14,

            horizontal: 'center',

            fill: 'F7F9FB'

        }
    );


    sheet.getRow(
        row
    ).height = 26;


    sheet.getRow(
        row + 1
    ).height = 34;

};


// ============================================================
// WORK TYPE CHART
// ============================================================

const createWorkTypeChart = async (
    summary
) => {

    if (
        !ChartJSNodeCanvas ||
        !summary.length
    ) {

        return null;

    }


    const topItems =
        summary.slice(0, 8);


    const chartCanvas =
        new ChartJSNodeCanvas({

            width: 700,

            height: 380,

            backgroundColour: 'white'

        });


    const configuration = {

        type: 'doughnut',

        data: {

            labels:
                topItems.map(
                    item => item.name
                ),

            datasets: [

                {

                    label: 'Hours',

                    data:
                        topItems.map(
                            item => item.hours
                        ),

                    borderWidth: 1

                }

            ]

        },

        options: {

            responsive: false,

            maintainAspectRatio: false,

            plugins: {

                title: {

                    display: true,

                    text:
                        'Hours by Work Type',

                    font: {
                        size: 18
                    }

                },

                legend: {

                    position: 'right'

                }

            }

        }

    };


    return chartCanvas.renderToBuffer(
        configuration
    );

};


// ============================================================
// PROJECT CHART
// ============================================================

const createProjectChart = async (
    summary
) => {

    if (
        !ChartJSNodeCanvas ||
        !summary.length
    ) {

        return null;

    }


    const topItems =
        summary.slice(0, 8);


    const chartCanvas =
        new ChartJSNodeCanvas({

            width: 760,

            height: 400,

            backgroundColour: 'white'

        });


    const configuration = {

        type: 'bar',

        data: {

            labels:
                topItems.map(
                    item => item.name
                ),

            datasets: [

                {

                    label: 'Hours',

                    data:
                        topItems.map(
                            item => item.hours
                        ),

                    borderWidth: 1

                }

            ]

        },

        options: {

            responsive: false,

            maintainAspectRatio: false,

            indexAxis: 'y',

            plugins: {

                title: {

                    display: true,

                    text:
                        'Hours by Project',

                    font: {
                        size: 18
                    }

                },

                legend: {

                    display: false

                }

            },

            scales: {

                x: {

                    beginAtZero: true,

                    title: {

                        display: true,

                        text: 'Hours'

                    }

                }

            }

        }

    };


    return chartCanvas.renderToBuffer(
        configuration
    );

};


// ============================================================
// DASHBOARD
// ============================================================

const buildDashboard = async (
    dashboard,
    data,
    workbook
) => {

    const {

        search,

        sort,

        workDate,

        totalLogs,

        totalHours,

        projectSet,

        workDatesSet,

        projectSummary,

        activitySummary,

        workTypeSummary,

        capacityMinutes,

        remainingMinutes,

        overtimeMinutes,

        utilization,

        activeEmployeeCount,

        loggedEmployeeCount,

        notLoggedEmployeeCount

    } = data;


    // ========================================================
    // COLUMN LAYOUT
    // ========================================================
    //
    // A-E = left content
    // F   = spacer
    // G-K = right content
    //
    // F increased from 6 to 8.
    // ========================================================

    dashboard.getColumn(1).width = 25;
    dashboard.getColumn(2).width = 18;
    dashboard.getColumn(3).width = 18;
    dashboard.getColumn(4).width = 18;
    dashboard.getColumn(5).width = 18;

    dashboard.getColumn(6).width = 8;

    dashboard.getColumn(7).width = 25;
    dashboard.getColumn(8).width = 18;
    dashboard.getColumn(9).width = 18;
    dashboard.getColumn(10).width = 18;
    dashboard.getColumn(11).width = 18;


    // ========================================================
    // TITLE
    // ========================================================

    dashboard.mergeCells(
        'A1:K1'
    );


    const title =
        dashboard.getCell('A1');


    title.value =
        'WORK LOG DASHBOARD';


    styleCell(
        title,
        {

            bold: true,

            size: 20,

            horizontal: 'center',

            fill: '1F4E78',

            fontColor: 'FFFFFF'

        }
    );


    dashboard.getRow(1).height = 40;


    dashboard.mergeCells(
        'A2:K2'
    );


    const subtitle =
        dashboard.getCell('A2');


    subtitle.value =
        workDate
            ? `Report Date: ${workDate}`
            : 'Report Period: All Available Work Logs';


    styleCell(
        subtitle,
        {

            horizontal: 'center',

            fill: 'D9EAF7'

        }
    );


    dashboard.getRow(2).height = 26;


    // ========================================================
    // REPORT DETAILS
    // ========================================================

    addSectionTitle(
        dashboard,
        4,
        1,
        11,
        'Report Details'
    );


    addTableHeader(
        dashboard,
        5,
        1,
        [
            'Date',
            'Search',
            'Sort Order'
        ]
    );


    dashboard.getCell(
        6,
        1
    ).value =
        workDate || 'All Dates';


    dashboard.getCell(
        6,
        2
    ).value =
        search || 'All Records';


    dashboard.getCell(
        6,
        3
    ).value =
        sort === 'oldest'
            ? 'Oldest First'
            : 'Newest First';


    styleCell(
        dashboard.getCell(6, 1),
        {
            horizontal: 'center'
        }
    );


    styleCell(
        dashboard.getCell(6, 2),
        {
            horizontal: 'center'
        }
    );


    styleCell(
        dashboard.getCell(6, 3),
        {
            horizontal: 'center'
        }
    );


    dashboard.getRow(6).height = 28;


    // ========================================================
    // AT A GLANCE
    // ========================================================

    addSectionTitle(
        dashboard,
        9,
        1,
        11,
        'At a Glance'
    );


    addKpiCard(
        dashboard,
        1,
        10,
        'Work Entries',
        totalLogs
    );


    addKpiCard(
        dashboard,
        3,
        10,
        'Hours Logged',
        totalHours
    );


    addKpiCard(
        dashboard,
        5,
        10,
        'Employees Logged',
        loggedEmployeeCount
    );


    addKpiCard(
        dashboard,
        7,
        10,
        'Employees Not Logged',
        notLoggedEmployeeCount
    );


    addKpiCard(
        dashboard,
        9,
        10,
        'Projects',
        projectSet.size
    );


    // ========================================================
    // EMPLOYEE LOGGING STATUS
    // ========================================================

    addSectionTitle(
        dashboard,
        14,
        1,
        11,
        'Employee Logging Status'
    );


    // Extra height specifically for this section title.
    dashboard.getRow(14).height = 34;


    addTableHeader(
        dashboard,
        15,
        1,
        [
            'Active Employees',
            'Employees Logged',
            'Employees Not Logged',
            'Logging Rate'
        ]
    );


    dashboard.getRow(15).height = 30;


    const loggingRate =
        activeEmployeeCount > 0
            ? Number(
                (
                    loggedEmployeeCount /
                    activeEmployeeCount *
                    100
                ).toFixed(2)
            )
            : 0;


    const employeeStatusValues = [

        activeEmployeeCount,

        loggedEmployeeCount,

        notLoggedEmployeeCount,

        `${loggingRate}%`

    ];


    employeeStatusValues.forEach(
        (value, index) => {

            const cell =
                dashboard.getCell(
                    16,
                    index + 1
                );


            cell.value =
                value;


            styleCell(
                cell,
                {

                    bold: true,

                    size: 12,

                    horizontal: 'center',

                    fill: 'F7F9FB'

                }
            );

        }
    );


    dashboard.getRow(16).height = 32;


    // ========================================================
    // EMPLOYEE STATUS NOTE
    // ========================================================

    dashboard.mergeCells(
        'A17:K17'
    );


    const employeeNote =
        dashboard.getCell(
            'A17'
        );


    employeeNote.value =
        workDate
            ? `Only active employees are checked. An employee is considered logged if at least one work log exists for ${workDate}.`
            : 'Select a report date to determine exactly which active employees have not logged.';


    styleCell(
        employeeNote,
        {

            size: 10,

            fontColor: '666666',

            fill: 'F8FAFC'

        }
    );


    dashboard.getRow(17).height = 34;


    // ========================================================
    // SPACING ROW
    // ========================================================

    dashboard.getRow(18).height = 12;


    // ========================================================
    // WORKING HOURS
    // ========================================================

    addSectionTitle(
        dashboard,
        19,
        1,
        11,
        'Working Hours'
    );


    addTableHeader(
        dashboard,
        20,
        1,
        [
            'Expected Hours',
            'Hours Logged',
            'Hours Remaining',
            'Extra Hours',
            'Completion'
        ]
    );


    const expectedHours =
        minutesToHours(
            capacityMinutes
        );


    const remainingHours =
        minutesToHours(
            remainingMinutes
        );


    const extraHours =
        minutesToHours(
            overtimeMinutes
        );


    const workHoursValues = [

        `${expectedHours} hrs`,

        `${totalHours} hrs`,

        `${remainingHours} hrs`,

        `${extraHours} hrs`,

        `${utilization}%`

    ];


    workHoursValues.forEach(
        (value, index) => {

            const cell =
                dashboard.getCell(
                    21,
                    index + 1
                );


            cell.value =
                value;


            styleCell(
                cell,
                {

                    bold: true,

                    size: 12,

                    horizontal: 'center',

                    fill: 'F7F9FB'

                }
            );

        }
    );


    dashboard.getRow(21).height = 32;


    dashboard.mergeCells(
        'A22:K22'
    );


    const hoursNote =
        dashboard.getCell(
            'A22'
        );


    hoursNote.value =
        `Expected hours are based on 8 hours per workday (${workDatesSet.size} workday(s) in the report).`;


    styleCell(
        hoursNote,
        {

            size: 10,

            fontColor: '666666',

            fill: 'F8FAFC'

        }
    );


    dashboard.getRow(22).height = 30;


    dashboard.getRow(23).height = 12;


    // ========================================================
    // CHART SECTION
    // ========================================================

    addSectionTitle(
        dashboard,
        24,
        1,
        11,
        'Where the Time Was Spent'
    );


    let workTypeChartBuffer = null;
    let projectChartBuffer = null;


    try {

        workTypeChartBuffer =
            await createWorkTypeChart(
                workTypeSummary
            );


        projectChartBuffer =
            await createProjectChart(
                projectSummary
            );

    } catch (chartError) {

        console.error(
            'Chart generation error:',
            chartError
        );

    }


    // ========================================================
    // LEFT CHART
    // A-E
    // ========================================================

    if (workTypeChartBuffer) {

        const imageId =
            workbook.addImage({

                buffer:
                    workTypeChartBuffer,

                extension:
                    'png'

            });


        dashboard.addImage(
            imageId,
            {

                tl: {
                    col: 0,
                    row: 24
                },

                ext: {
                    width: 500,
                    height: 280
                }

            }
        );

    } else {

        dashboard.mergeCells(
            'A26:E26'
        );


        const cell =
            dashboard.getCell(
                'A26'
            );


        cell.value =
            workTypeSummary.length
                ? 'Work Type chart unavailable'
                : 'No work type data available';


        styleCell(
            cell,
            {
                horizontal: 'center'
            }
        );

    }


    // ========================================================
    // RIGHT CHART
    // G-K
    // ========================================================

    if (projectChartBuffer) {

        const imageId =
            workbook.addImage({

                buffer:
                    projectChartBuffer,

                extension:
                    'png'

            });


        dashboard.addImage(
            imageId,
            {

                tl: {
                    col: 6,
                    row: 24
                },

                ext: {
                    width: 470,
                    height: 280
                }

            }
        );

    } else {

        dashboard.mergeCells(
            'G26:K26'
        );


        const cell =
            dashboard.getCell(
                'G26'
            );


        cell.value =
            projectSummary.length
                ? 'Project chart unavailable'
                : 'No project data available';


        styleCell(
            cell,
            {
                horizontal: 'center'
            }
        );

    }


    // Reserve enough visual space for charts.

    for (
        let row = 25;
        row <= 38;
        row++
    ) {

        dashboard.getRow(
            row
        ).height = 22;

    }


    dashboard.getRow(39).height = 12;


    // ========================================================
    // KEY INSIGHTS
    // ========================================================

    addSectionTitle(
        dashboard,
        40,
        1,
        11,
        'Key Insights'
    );


    addTableHeader(
        dashboard,
        41,
        1,
        [
            'Item',
            'Result',
            'Value'
        ]
    );


    const topProject =
        projectSummary[0];


    const topWorkType =
        workTypeSummary[0];


    const topActivity =
        activitySummary[0];


    let hoursStatus =
        'No hours logged';


    if (totalHours > expectedHours) {

        hoursStatus =
            'Above expected hours';

    } else if (
        totalHours === expectedHours &&
        expectedHours > 0
    ) {

        hoursStatus =
            'Expected hours completed';

    } else if (totalHours > 0) {

        hoursStatus =
            'Below expected hours';

    }


    const findings = [

        [
            'Project with Most Hours',

            topProject
                ? topProject.name
                : 'No data',

            topProject
                ? `${topProject.hours} hrs`
                : '0 hrs'
        ],


        [
            'Work Type Used Most',

            topWorkType
                ? topWorkType.name
                : 'No data',

            topWorkType
                ? `${topWorkType.hours} hrs`
                : '0 hrs'
        ],


        [
            'Most Logged Activity',

            topActivity
                ? topActivity.name
                : 'No data',

            topActivity
                ? `${topActivity.logs} entries`
                : '0 entries'
        ],


        [
            'Working Hours Status',

            hoursStatus,

            `${totalHours} / ${expectedHours} hrs`
        ]

    ];


    findings.forEach(
        (values, index) => {

            const row =
                42 + index;


            values.forEach(
                (value, columnIndex) => {

                    const cell =
                        dashboard.getCell(
                            row,
                            columnIndex + 1
                        );


                    cell.value =
                        value;


                    styleCell(
                        cell,
                        {

                            bold:
                                columnIndex === 0,

                            horizontal:
                                columnIndex === 2
                                    ? 'center'
                                    : 'left'

                        }
                    );

                }
            );

            dashboard.getRow(row).height = 27;

        }
    );


    // ========================================================
    // DASHBOARD SETTINGS
    // ========================================================

    dashboard.views = [

        {
            state: 'frozen',
            ySplit: 2
        }

    ];


    dashboard.pageSetup = {

        orientation: 'landscape',

        fitToPage: true,

        fitToWidth: 1,

        fitToHeight: 0

    };


    dashboard.pageMargins = {

        left: 0.25,

        right: 0.25,

        top: 0.5,

        bottom: 0.5,

        header: 0.2,

        footer: 0.2

    };

};


// ============================================================
// NOT LOGGED SHEET
// ============================================================

const buildNotLoggedSheet = (
    sheet,
    employees,
    workDate
) => {

    // ========================================================
    // COLUMN WIDTHS
    // ========================================================

    sheet.getColumn(1).width = 10;
    sheet.getColumn(2).width = 20;
    sheet.getColumn(3).width = 32;
    sheet.getColumn(4).width = 28;


    // ========================================================
    // TITLE
    // ========================================================

    sheet.mergeCells(
        'A1:D1'
    );


    const title =
        sheet.getCell('A1');


    title.value =
        'EMPLOYEES NOT LOGGED';


    styleCell(
        title,
        {

            bold: true,

            size: 18,

            horizontal: 'center',

            fill: '1F4E78',

            fontColor: 'FFFFFF'

        }
    );


    sheet.getRow(1).height = 38;


    // ========================================================
    // DATE
    // ========================================================

    sheet.mergeCells(
        'A2:D2'
    );


    const dateCell =
        sheet.getCell('A2');


    dateCell.value =
        `Work Date: ${workDate}`;


    styleCell(
        dateCell,
        {

            horizontal: 'center',

            fill: 'D9EAF7'

        }
    );


    sheet.getRow(2).height = 26;


    // ========================================================
    // SPACING
    // ========================================================

    sheet.getRow(3).height = 10;


    // ========================================================
    // COUNT
    // ========================================================

    sheet.mergeCells(
        'A4:D4'
    );


    const countCell =
        sheet.getCell('A4');


    countCell.value =
        `Active employees who have not logged: ${employees.length}`;


    styleCell(
        countCell,
        {

            bold: true,

            size: 12,

            horizontal: 'left',

            fill: 'F7F9FB'

        }
    );


    sheet.getRow(4).height = 30;


    sheet.getRow(5).height = 10;


    // ========================================================
    // HEADER
    // ========================================================

    addTableHeader(
        sheet,
        6,
        1,
        [
            'Sl No',
            'Employee ID',
            'Employee',
            'Department'
        ]
    );


    // ========================================================
    // EMPTY STATE
    // ========================================================

    if (!employees.length) {

        addEmptyTableMessage(
            sheet,
            7,
            1,
            4,
            'All active employees have logged for this date'
        );

    } else {

        // ====================================================
        // ROWS
        // ====================================================

        employees.forEach(
            (employee, index) => {

                const row =
                    7 + index;


                const values = [

                    index + 1,

                    employee.employee_id || '',

                    employee.employee_name || '',

                    employee.department_name || ''

                ];


                values.forEach(
                    (value, columnIndex) => {

                        const cell =
                            sheet.getCell(
                                row,
                                columnIndex + 1
                            );


                        cell.value =
                            value;


                        styleCell(
                            cell,
                            {

                                horizontal:
                                    columnIndex === 0
                                        ? 'center'
                                        : 'left'

                            }
                        );

                    }
                );


                if (row % 2 === 1) {

                    for (
                        let col = 1;
                        col <= 4;
                        col++
                    ) {

                        sheet.getCell(
                            row,
                            col
                        ).fill = {

                            type: 'pattern',

                            pattern: 'solid',

                            fgColor: 'F8FAFC'

                        };

                    }

                }

            }
        );

    }


    // ========================================================
    // SETTINGS
    // ========================================================

    sheet.views = [

        {
            state: 'frozen',
            ySplit: 6
        }

    ];


    sheet.autoFilter = {

        from: 'A6',

        to: 'D6'

    };


    sheet.pageSetup = {

        orientation: 'landscape',

        fitToPage: true,

        fitToWidth: 1,

        fitToHeight: 0

    };


    sheet.pageMargins = {

        left: 0.25,

        right: 0.25,

        top: 0.5,

        bottom: 0.5,

        header: 0.2,

        footer: 0.2

    };

};


// ============================================================
// DOWNLOAD WORK LOGS
// ============================================================

exports.downloadWorkLogs = async (
    req,
    res
) => {

    try {

        const search =
            req.query.search || '';


        const sort =
            req.query.sort || 'newest';


        const workDate =
            req.query.workDate || '';


        console.log(
            '========== EXCEL DOWNLOAD =========='
        );


        console.log(
            'search:',
            search
        );


        console.log(
            'sort:',
            sort
        );


        console.log(
            'workDate:',
            workDate
        );


        // ====================================================
        // GET WORK LOGS
        // ====================================================

        const worklogsResult =
            await workLogsModel.downloadWorkLogs(
                search,
                sort,
                workDate
            );


        const worklogs =
            Array.isArray(worklogsResult)
                ? worklogsResult
                : Array.isArray(
                    worklogsResult?.rows
                )
                    ? worklogsResult.rows
                    : [];


        console.log(
            'WORKLOG COUNT:',
            worklogs.length
        );


        // ====================================================
        // GET NOT LOGGED EMPLOYEES
        // ====================================================

        let notLoggedEmployees = [];


        if (workDate) {

            const result =
                await workLogsModel.getEmployeesNotLogged(
                    workDate
                );


            notLoggedEmployees =
                Array.isArray(result)
                    ? result
                    : [];

        }


        console.log(
            'NOT LOGGED COUNT:',
            notLoggedEmployees.length
        );


        // ====================================================
        // TOTAL HOURS
        // ====================================================

        const totalLogs =
            worklogs.length;


        const totalMinutes =
            worklogs.reduce(
                (sum, row) =>
                    sum +
                    safeNumber(
                        row.duration_minutes
                    ),
                0
            );


        const totalHours =
            minutesToHours(
                totalMinutes
            );


        // ====================================================
        // UNIQUE EMPLOYEES
        // ====================================================

        const employeeSet =
            new Set(
                worklogs
                    .map(
                        row =>
                            row.employee_id
                                ? String(
                                    row.employee_id
                                )
                                : row.employee_name
                    )
                    .filter(Boolean)
            );


        // ====================================================
        // OTHER UNIQUE COUNTS
        // ====================================================

        const projectSet =
            new Set(
                worklogs
                    .map(
                        row =>
                            row.project_name
                    )
                    .filter(Boolean)
            );


        const workTypeSet =
            new Set(
                worklogs
                    .map(
                        row =>
                            row.work_type_name
                    )
                    .filter(Boolean)
            );


        // ====================================================
        // WORK DATES
        // ====================================================

        const workDatesSet =
            getUniqueWorkDates(
                worklogs
            );


        // ====================================================
        // EMPLOYEE LOGGING STATUS
        // ====================================================

        let activeEmployeeCount = 0;

        let loggedEmployeeCount =
            employeeSet.size;

        let notLoggedEmployeeCount =
            notLoggedEmployees.length;


        if (workDate) {

            activeEmployeeCount =
                loggedEmployeeCount +
                notLoggedEmployeeCount;

        } else {

            // Without a selected date, there is no
            // meaningful "not logged" comparison.

            activeEmployeeCount = 0;

            loggedEmployeeCount =
                employeeSet.size;

            notLoggedEmployeeCount = 0;

        }


        // ====================================================
        // CAPACITY
        // ====================================================

        const standardMinutes =
            8 * 60;


        const numberOfWorkdays =
            workDatesSet.size;


        const capacityMinutes =
            numberOfWorkdays *
            standardMinutes;


        const remainingMinutes =
            Math.max(
                capacityMinutes -
                totalMinutes,
                0
            );


        const overtimeMinutes =
            Math.max(
                totalMinutes -
                capacityMinutes,
                0
            );


        const utilization =
            capacityMinutes > 0
                ? Number(
                    (
                        totalMinutes /
                        capacityMinutes *
                        100
                    ).toFixed(2)
                )
                : 0;


        // ====================================================
        // SUMMARIES
        // ====================================================

        const employeeSummary =
            createSummary(
                worklogs,
                'employee_name',
                totalMinutes
            );


        const departmentSummary =
            createSummary(
                worklogs,
                'department_name',
                totalMinutes
            );


        const projectSummary =
            createSummary(
                worklogs,
                'project_name',
                totalMinutes
            );


        const activitySummary =
            createSummary(
                worklogs,
                'activity_name',
                totalMinutes
            );


        const workTypeSummary =
            createSummary(
                worklogs,
                'work_type_name',
                totalMinutes
            );


        // ====================================================
        // WORKBOOK
        // ====================================================

        const workbook =
            new ExcelJS.Workbook();


        workbook.creator =
            'Work Log Management';


        workbook.lastModifiedBy =
            'Work Log Management';


        workbook.createdAt =
            new Date();


        workbook.modifiedAt =
            new Date();


        // ====================================================
        // WORKSHEETS
        // ====================================================

        const dashboard =
            workbook.addWorksheet(
                'Dashboard'
            );


        const logsSheet =
            workbook.addWorksheet(
                'Work Logs'
            );


        const notLoggedSheet =
            workbook.addWorksheet(
                'Not Logged'
            );


        const employeeSheet =
            workbook.addWorksheet(
                'Employee Summary'
            );


        const departmentSheet =
            workbook.addWorksheet(
                'Department Summary'
            );


        const projectSheet =
            workbook.addWorksheet(
                'Project Summary'
            );


        const activitySheet =
            workbook.addWorksheet(
                'Activity Summary'
            );


        const workTypeSheet =
            workbook.addWorksheet(
                'Work Type Summary'
            );


        // ====================================================
        // BUILD DASHBOARD
        // ====================================================

        await buildDashboard(
            dashboard,
            {

                search,

                sort,

                workDate,

                totalLogs,

                totalMinutes,

                totalHours,

                employeeSet,

                projectSet,

                workTypeSet,

                workDatesSet,

                departmentSummary,

                projectSummary,

                activitySummary,

                workTypeSummary,

                capacityMinutes,

                remainingMinutes,

                overtimeMinutes,

                utilization,

                activeEmployeeCount,

                loggedEmployeeCount,

                notLoggedEmployeeCount

            },
            workbook
        );


        // ====================================================
        // BUILD NOT LOGGED SHEET
        // ====================================================

        if (workDate) {

            buildNotLoggedSheet(
                notLoggedSheet,
                notLoggedEmployees,
                workDate
            );

        } else {

            notLoggedSheet.getColumn(1).width = 20;
            notLoggedSheet.getColumn(2).width = 60;


            notLoggedSheet.mergeCells(
                'A1:B1'
            );


            const cell =
                notLoggedSheet.getCell('A1');


            cell.value =
                'NOT LOGGED EMPLOYEES';


            styleCell(
                cell,
                {

                    bold: true,

                    size: 18,

                    horizontal: 'center',

                    fill: '1F4E78',

                    fontColor: 'FFFFFF'

                }
            );


            notLoggedSheet.getRow(1).height = 38;


            notLoggedSheet.mergeCells(
                'A3:B3'
            );


            const message =
                notLoggedSheet.getCell('A3');


            message.value =
                'Please select a Work Date to determine which active employees have not logged.';


            styleCell(
                message,
                {

                    horizontal: 'center',

                    fill: 'F7F9FB'

                }
            );


            notLoggedSheet.getRow(3).height = 30;

        }


        // ====================================================
        // WORK LOG SHEET
        // ====================================================

        logsSheet.columns = [

            {
                header: 'Sl No',
                key: 'slNo',
                width: 10
            },

            {
                header: 'Date',
                key: 'date',
                width: 15
            },

            {
                header: 'Employee',
                key: 'employee',
                width: 25
            },

            {
                header: 'Entered By Employee',
                key: 'enteredBy',
                width: 25
            },

            {
                header: 'Department',
                key: 'department',
                width: 22
            },

            {
                header: 'Project',
                key: 'project',
                width: 28
            },

            {
                header: 'Activity',
                key: 'activity',
                width: 28
            },

            {
                header: 'Sub Activity',
                key: 'subActivity',
                width: 28
            },

            {
                header: 'Work Type',
                key: 'workType',
                width: 22
            },

            {
                header: 'Duration',
                key: 'duration',
                width: 15
            },

            {
                header: 'Duration Hours',
                key: 'durationHours',
                width: 18
            },

            {
                header: 'Remarks',
                key: 'remarks',
                width: 40
            }

        ];


        // ====================================================
        // ADD WORK LOG ROWS
        // ====================================================

        worklogs.forEach(
            (worklog, index) => {

                let workDateValue = '';


                if (
                    worklog.work_date
                ) {

                    const dateKey =
                        getDateKey(
                            worklog.work_date
                        );


                    if (dateKey) {

                        const parsedDate =
                            new Date(
                                `${dateKey}T00:00:00`
                            );


                        if (
                            !Number.isNaN(
                                parsedDate.getTime()
                            )
                        ) {

                            workDateValue =
                                parsedDate;

                        }

                    }

                }


                logsSheet.addRow({

                    slNo:
                        index + 1,

                    date:
                        workDateValue,

                    employee:
                        worklog.employee_name ||
                        '',

                    enteredBy:
                        worklog.entered_by_employee_name ||
                        '',

                    department:
                        worklog.department_name ||
                        '',

                    project:
                        worklog.project_name ||
                        '',

                    activity:
                        worklog.activity_name ||
                        '',

                    subActivity:
                        worklog.sub_activity_name ||
                        '',

                    workType:
                        worklog.work_type_name ||
                        '',

                    duration:
                        formatMinutes(
                            worklog.duration_minutes
                        ),

                    durationHours:
                        minutesToHours(
                            worklog.duration_minutes
                        ),

                    remarks:
                        worklog.remarks ||
                        ''

                });

            }
        );


        // ====================================================
        // WORK LOG HEADER
        // ====================================================

        for (
            let col = 1;
            col <= 12;
            col++
        ) {

            styleCell(
                logsSheet.getCell(
                    1,
                    col
                ),
                {

                    bold: true,

                    horizontal: 'center',

                    fill: 'D9E2F3'

                }
            );

        }


        logsSheet.getRow(1).height = 28;


        logsSheet.getColumn(2).numFmt =
            'dd-mm-yyyy';


        // ====================================================
        // WORK LOG BODY
        // ====================================================

        for (
            let row = 2;
            row <= logsSheet.rowCount;
            row++
        ) {

            for (
                let col = 1;
                col <= 12;
                col++
            ) {

                styleCell(
                    logsSheet.getCell(
                        row,
                        col
                    )
                );

            }


            if (
                row % 2 === 0
            ) {

                for (
                    let col = 1;
                    col <= 12;
                    col++
                ) {

                    logsSheet.getCell(
                        row,
                        col
                    ).fill = {

                        type: 'pattern',

                        pattern: 'solid',

                        fgColor: 'F8FAFC'

                    };

                }

            }

        }


        // ====================================================
        // WORK LOG SETTINGS
        // ====================================================

        logsSheet.views = [

            {
                state: 'frozen',
                ySplit: 1
            }

        ];


        logsSheet.autoFilter = {

            from: 'A1',

            to: 'L1'

        };


        logsSheet.pageSetup = {

            orientation: 'landscape',

            fitToPage: true,

            fitToWidth: 1,

            fitToHeight: 0

        };


        logsSheet.pageMargins = {

            left: 0.25,

            right: 0.25,

            top: 0.5,

            bottom: 0.5,

            header: 0.2,

            footer: 0.2

        };


        // ====================================================
        // SUMMARY SHEETS
        // ====================================================

        addSummaryTable(
            employeeSheet,
            1,
            1,
            'Employee Summary',
            employeeSummary
        );


        addSummaryTable(
            departmentSheet,
            1,
            1,
            'Department Summary',
            departmentSummary
        );


        addSummaryTable(
            projectSheet,
            1,
            1,
            'Project Summary',
            projectSummary
        );


        addSummaryTable(
            activitySheet,
            1,
            1,
            'Activity Summary',
            activitySummary
        );


        addSummaryTable(
            workTypeSheet,
            1,
            1,
            'Work Type Summary',
            workTypeSummary
        );


        // ====================================================
        // SUMMARY SHEET SETTINGS
        // ====================================================

        const summarySheets = [

            employeeSheet,

            departmentSheet,

            projectSheet,

            activitySheet,

            workTypeSheet

        ];


        summarySheets.forEach(
            sheet => {

                sheet.views = [

                    {
                        state: 'frozen',
                        ySplit: 2
                    }

                ];


                sheet.autoFilter = {

                    from: 'A2',

                    to: 'F2'

                };


                sheet.getColumn(1).width = 30;

                sheet.getColumn(2).width = 12;

                sheet.getColumn(3).width = 15;

                sheet.getColumn(4).width = 15;

                sheet.getColumn(5).width = 15;

                sheet.getColumn(6).width = 18;


                sheet.pageSetup = {

                    orientation: 'landscape',

                    fitToPage: true,

                    fitToWidth: 1,

                    fitToHeight: 0

                };


                sheet.pageMargins = {

                    left: 0.25,

                    right: 0.25,

                    top: 0.5,

                    bottom: 0.5,

                    header: 0.2,

                    footer: 0.2

                };

            }
        );


        // ====================================================
        // RESPONSE
        // ====================================================

        const filename =
            workDate
                ? `work_logs_report_${workDate}.xlsx`
                : 'work_logs_report.xlsx';


        const buffer =
            await workbook.xlsx.writeBuffer();


        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );


        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${filename}"`
        );


        res.setHeader(
            'Content-Length',
            buffer.length
        );


        console.log(
            'Excel generated successfully:',
            buffer.length,
            'bytes'
        );


        return res.end(
            buffer
        );


    } catch (err) {

        console.error(
            'EXCEL DOWNLOAD ERROR:',
            err
        );


        if (!res.headersSent) {

            return res.status(500).json({

                success: false,

                message:
                    'Failed to generate work log report',

                error:
                    err.message

            });

        }

    }

};