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
// BASIC HELPERS
// ============================================================

const safeNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
};

const minutesToHours = (minutes) => {
    return Number((safeNumber(minutes) / 60).toFixed(2));
};

const formatMinutes = (minutes) => {
    const total = Math.max(0, Math.round(safeNumber(minutes)));
    const hours = Math.floor(total / 60);
    const mins = total % 60;

    return `${hours}h ${mins}m`;
};

const cleanText = (value, fallback = 'Unknown') => {
    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ''
    ) {
        return fallback;
    }

    return String(value).trim();
};

const getDateKey = (value) => {
    if (!value) return null;

    if (typeof value === 'string') {
        return value.slice(0, 10);
    }

    const date =
        value instanceof Date
            ? value
            : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date.toISOString().slice(0, 10);
};

/*
 * IMPORTANT:
 * work_date is a MySQL DATE, not a timestamp.
 *
 * Do NOT create:
 *
 * new Date('2026-09-15T00:00:00')
 *
 * because ExcelJS / timezone conversion can turn it into
 * 2026-09-14.
 *
 * We therefore write the calendar date as a string.
 */
const getExcelDate = (value) => {
    const dateKey = getDateKey(value);

    if (!dateKey) {
        return '';
    }

    const match = dateKey.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
    );

    if (!match) {
        return dateKey;
    }

    const [, year, month, day] = match;

    return `${day}-${month}-${year}`;
};

// ============================================================
// SUMMARY
// ============================================================

const createSummary = (
    worklogs,
    field,
    totalMinutes
) => {
    const map = {};

    worklogs.forEach((row) => {
        const name = cleanText(row[field]);

        if (!map[name]) {
            map[name] = {
                name,
                logs: 0,
                minutes: 0
            };
        }

        map[name].logs += 1;

        map[name].minutes += safeNumber(
            row.duration_minutes
        );
    });

    return Object.values(map)
        .map((item) => {
            const hours =
                minutesToHours(item.minutes);

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

const getUniqueWorkDates = (worklogs) => {
    const dates = new Set();

    worklogs.forEach((row) => {
        const date = getDateKey(row.work_date);

        if (date) {
            dates.add(date);
        }
    });

    return dates;
};

// ============================================================
// EXCEL STYLING
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
        wrapText = true,
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
        wrapText
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

const addSectionTitle = (
    sheet,
    row,
    startColumn,
    endColumn,
    title
) => {
    const cell = sheet.getCell(
        row,
        startColumn
    );

    cell.value = title;

    styleCell(cell, {
        bold: true,
        size: 13,
        fill: 'D9E2F3',
        fontColor: '1F1F1F'
    });

    cell.alignment = {
        vertical: 'middle',
        horizontal: 'left',
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

    sheet.getRow(row).height = 32;
};

const addTableHeader = (
    sheet,
    row,
    startColumn,
    headers
) => {
    headers.forEach((header, index) => {
        const cell = sheet.getCell(
            row,
            startColumn + index
        );

        cell.value = header;

        styleCell(cell, {
            bold: true,
            horizontal: 'center',
            fill: 'EAF0F7',
            fontColor: '1F1F1F'
        });
    });

    sheet.getRow(row).height = 28;
};

const addEmptyTableMessage = (
    sheet,
    row,
    startColumn,
    endColumn,
    message = 'No data available'
) => {
    const cell = sheet.getCell(
        row,
        startColumn
    );

    cell.value = message;

    styleCell(cell, {
        horizontal: 'center'
    });

    if (endColumn > startColumn) {
        sheet.mergeCells(
            row,
            startColumn,
            row,
            endColumn
        );
    }
};

const addKpiCard = (
    sheet,
    column,
    row,
    label,
    value
) => {
    const labelCell =
        sheet.getCell(row, column);

    labelCell.value = label;

    styleCell(labelCell, {
        bold: true,
        horizontal: 'center',
        fill: 'EAF0F7'
    });

    const valueCell =
        sheet.getCell(row + 1, column);

    valueCell.value = value;

    styleCell(valueCell, {
        bold: true,
        size: 14,
        horizontal: 'center',
        fill: 'F7F9FB'
    });

    sheet.getRow(row).height = 26;
    sheet.getRow(row + 1).height = 34;
};

// ============================================================
// SUMMARY SHEET
// ============================================================

const addSummaryTable = (
    sheet,
    title,
    summary
) => {
    addSectionTitle(
        sheet,
        1,
        1,
        6,
        title
    );

    addTableHeader(
        sheet,
        2,
        1,
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
            3,
            1,
            6
        );

        return;
    }

    summary.forEach((item, index) => {
        const row = index + 3;

        const values = [
            item.name,
            item.logs,
            item.minutes,
            item.hours,
            item.avgHours,
            item.percentage / 100
        ];

        values.forEach(
            (value, columnIndex) => {
                const cell =
                    sheet.getCell(
                        row,
                        columnIndex + 1
                    );

                cell.value = value;

                styleCell(cell, {
                    horizontal:
                        columnIndex === 0
                            ? 'left'
                            : 'center',
                    wrapText:
                        columnIndex === 0
                });
            }
        );

        sheet.getCell(
            row,
            6
        ).numFmt = '0.00%';

        if (row % 2 === 1) {
            for (
                let col = 1;
                col <= 6;
                col++
            ) {
                sheet.getCell(
                    row,
                    col
                ).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {
                        argb: 'F8FAFC'
                    }
                };
            }
        }

        sheet.getRow(row).height = 24;
    });
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

    const items = summary.slice(0, 8);

    const canvas =
        new ChartJSNodeCanvas({
            width: 700,
            height: 380,
            backgroundColour: 'white'
        });

    return canvas.renderToBuffer({
        type: 'doughnut',

        data: {
            labels: items.map(
                item => item.name
            ),

            datasets: [
                {
                    label: 'Hours',

                    data: items.map(
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
                    text: 'Hours by Work Type',
                    font: {
                        size: 18
                    }
                },

                legend: {
                    position: 'right'
                }
            }
        }
    });
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

    const items = summary.slice(0, 8);

    const canvas =
        new ChartJSNodeCanvas({
            width: 760,
            height: 400,
            backgroundColour: 'white'
        });

    return canvas.renderToBuffer({
        type: 'bar',

        data: {
            labels: items.map(
                item => item.name
            ),

            datasets: [
                {
                    label: 'Hours',

                    data: items.map(
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
                    text: 'Hours by Project',
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
    });
};

// ============================================================
// DASHBOARD
// ============================================================

const buildDashboard = async (
    sheet,
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

    // --------------------------------------------------------
    // COLUMN WIDTHS
    // --------------------------------------------------------

    sheet.getColumn(1).width = 25;
    sheet.getColumn(2).width = 18;
    sheet.getColumn(3).width = 18;
    sheet.getColumn(4).width = 18;
    sheet.getColumn(5).width = 18;

    // F is intentionally a spacer.
    sheet.getColumn(6).width = 8;

    sheet.getColumn(7).width = 25;
    sheet.getColumn(8).width = 18;
    sheet.getColumn(9).width = 18;
    sheet.getColumn(10).width = 18;
    sheet.getColumn(11).width = 18;

    // --------------------------------------------------------
    // TITLE
    // --------------------------------------------------------

    sheet.mergeCells('A1:K1');

    const title = sheet.getCell('A1');

    title.value = 'WORK LOG DASHBOARD';

    styleCell(title, {
        bold: true,
        size: 20,
        horizontal: 'center',
        fill: '1F4E78',
        fontColor: 'FFFFFF'
    });

    sheet.getRow(1).height = 40;

    sheet.mergeCells('A2:K2');

    const subtitle = sheet.getCell('A2');

    subtitle.value = workDate
        ? `Report Date: ${workDate}`
        : 'Report Period: All Available Work Logs';

    styleCell(subtitle, {
        horizontal: 'center',
        fill: 'D9EAF7'
    });

    sheet.getRow(2).height = 26;

    // --------------------------------------------------------
    // REPORT DETAILS
    // --------------------------------------------------------

    addSectionTitle(
        sheet,
        4,
        1,
        11,
        'Report Details'
    );

    addTableHeader(
        sheet,
        5,
        1,
        [
            'Date',
            'Search',
            'Sort Order'
        ]
    );

    const details = [
        workDate || 'All Dates',
        search || 'All Records',
        sort === 'oldest'
            ? 'Oldest First'
            : 'Newest First'
    ];

    details.forEach((value, index) => {
        const cell =
            sheet.getCell(
                6,
                index + 1
            );

        cell.value = value;

        styleCell(cell, {
            horizontal: 'center'
        });
    });

    sheet.getRow(6).height = 28;

    // --------------------------------------------------------
    // AT A GLANCE
    // --------------------------------------------------------

    addSectionTitle(
        sheet,
        9,
        1,
        11,
        'At a Glance'
    );

    addKpiCard(
        sheet,
        1,
        10,
        'Work Entries',
        totalLogs
    );

    addKpiCard(
        sheet,
        3,
        10,
        'Hours Logged',
        totalHours
    );

    addKpiCard(
        sheet,
        5,
        10,
        'Employees Logged',
        loggedEmployeeCount
    );

    addKpiCard(
        sheet,
        7,
        10,
        'Employees Not Logged',
        notLoggedEmployeeCount
    );

    addKpiCard(
        sheet,
        9,
        10,
        'Projects',
        projectSet.size
    );

    // --------------------------------------------------------
    // EMPLOYEE LOGGING STATUS
    // --------------------------------------------------------

    addSectionTitle(
        sheet,
        14,
        1,
        11,
        'Employee Logging Status'
    );

    sheet.getRow(14).height = 34;

    addTableHeader(
        sheet,
        15,
        1,
        [
            'Active Employees',
            'Employees Logged',
            'Employees Not Logged',
            'Logging Rate'
        ]
    );

    sheet.getRow(15).height = 30;

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

    [
        activeEmployeeCount,
        loggedEmployeeCount,
        notLoggedEmployeeCount,
        `${loggingRate}%`
    ].forEach((value, index) => {
        const cell =
            sheet.getCell(
                16,
                index + 1
            );

        cell.value = value;

        styleCell(cell, {
            bold: true,
            size: 12,
            horizontal: 'center',
            fill: 'F7F9FB'
        });
    });

    sheet.getRow(16).height = 32;

    sheet.mergeCells('A17:K17');

    const employeeNote =
        sheet.getCell('A17');

    employeeNote.value = workDate
        ? `Only active employees are checked. An employee is considered logged if at least one work log exists for ${workDate}.`
        : 'Select a report date to determine exactly which active employees have not logged.';

    styleCell(employeeNote, {
        size: 10,
        fontColor: '666666',
        fill: 'F8FAFC'
    });

    sheet.getRow(17).height = 34;
    sheet.getRow(18).height = 12;

    // --------------------------------------------------------
    // WORKING HOURS
    // --------------------------------------------------------

    addSectionTitle(
        sheet,
        19,
        1,
        11,
        'Working Hours'
    );

    addTableHeader(
        sheet,
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

    [
        `${expectedHours} hrs`,
        `${totalHours} hrs`,
        `${remainingHours} hrs`,
        `${extraHours} hrs`,
        `${utilization}%`
    ].forEach((value, index) => {
        const cell =
            sheet.getCell(
                21,
                index + 1
            );

        cell.value = value;

        styleCell(cell, {
            bold: true,
            size: 12,
            horizontal: 'center',
            fill: 'F7F9FB'
        });
    });

    sheet.getRow(21).height = 32;

    sheet.mergeCells('A22:K22');

    const hoursNote =
        sheet.getCell('A22');

    hoursNote.value =
        `Expected hours are based on 8 hours per workday (${workDatesSet.size} workday(s) in the report).`;

    styleCell(hoursNote, {
        size: 10,
        fontColor: '666666',
        fill: 'F8FAFC'
    });

    sheet.getRow(22).height = 30;
    sheet.getRow(23).height = 12;

    // --------------------------------------------------------
    // CHARTS
    // --------------------------------------------------------

    addSectionTitle(
        sheet,
        24,
        1,
        11,
        'Where the Time Was Spent'
    );

    let workTypeChart = null;
    let projectChart = null;

    try {
        workTypeChart =
            await createWorkTypeChart(
                workTypeSummary
            );

        projectChart =
            await createProjectChart(
                projectSummary
            );
    } catch (err) {
        console.error(
            'Chart generation error:',
            err
        );
    }

    if (workTypeChart) {
        const imageId =
            workbook.addImage({
                buffer: workTypeChart,
                extension: 'png'
            });

        sheet.addImage(
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
        sheet.mergeCells('A26:E26');

        const cell =
            sheet.getCell('A26');

        cell.value =
            workTypeSummary.length
                ? 'Work Type chart unavailable'
                : 'No work type data available';

        styleCell(cell, {
            horizontal: 'center'
        });
    }

    if (projectChart) {
        const imageId =
            workbook.addImage({
                buffer: projectChart,
                extension: 'png'
            });

        sheet.addImage(
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
        sheet.mergeCells('G26:K26');

        const cell =
            sheet.getCell('G26');

        cell.value =
            projectSummary.length
                ? 'Project chart unavailable'
                : 'No project data available';

        styleCell(cell, {
            horizontal: 'center'
        });
    }

    for (
        let row = 25;
        row <= 38;
        row++
    ) {
        sheet.getRow(row).height = 22;
    }

    sheet.getRow(39).height = 12;

    // --------------------------------------------------------
    // KEY INSIGHTS
    // --------------------------------------------------------

    addSectionTitle(
        sheet,
        40,
        1,
        11,
        'Key Insights'
    );

    addTableHeader(
        sheet,
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
            const row = 42 + index;

            values.forEach(
                (value, columnIndex) => {
                    const cell =
                        sheet.getCell(
                            row,
                            columnIndex + 1
                        );

                    cell.value = value;

                    styleCell(cell, {
                        bold:
                            columnIndex === 0,
                        horizontal:
                            columnIndex === 2
                                ? 'center'
                                : 'left'
                    });
                }
            );

            sheet.getRow(row).height = 27;
        }
    );

    // --------------------------------------------------------
    // DASHBOARD PRINT SETTINGS
    // --------------------------------------------------------

    sheet.views = [
        {
            state: 'frozen',
            ySplit: 2
        }
    ];

    sheet.pageSetup = {
        orientation: 'landscape',
        paperSize: 9,
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
// NOT LOGGED SHEET
// ============================================================

const buildNotLoggedSheet = (
    sheet,
    employees,
    workDate
) => {
    sheet.getColumn(1).width = 10;
    sheet.getColumn(2).width = 20;
    sheet.getColumn(3).width = 32;
    sheet.getColumn(4).width = 28;

    sheet.mergeCells('A1:D1');

    const title =
        sheet.getCell('A1');

    title.value =
        'EMPLOYEES NOT LOGGED';

    styleCell(title, {
        bold: true,
        size: 18,
        horizontal: 'center',
        fill: '1F4E78',
        fontColor: 'FFFFFF'
    });

    sheet.getRow(1).height = 38;

    sheet.mergeCells('A2:D2');

    const dateCell =
        sheet.getCell('A2');

    dateCell.value =
        `Work Date: ${workDate}`;

    styleCell(dateCell, {
        horizontal: 'center',
        fill: 'D9EAF7'
    });

    sheet.getRow(2).height = 26;
    sheet.getRow(3).height = 10;

    sheet.mergeCells('A4:D4');

    const countCell =
        sheet.getCell('A4');

    countCell.value =
        `Active employees who have not logged: ${employees.length}`;

    styleCell(countCell, {
        bold: true,
        size: 12,
        fill: 'F7F9FB'
    });

    sheet.getRow(4).height = 30;
    sheet.getRow(5).height = 10;

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

    if (!employees.length) {
        addEmptyTableMessage(
            sheet,
            7,
            1,
            4,
            'All active employees have logged for this date'
        );
    } else {
        employees.forEach(
            (employee, index) => {
                const row = 7 + index;

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

                        cell.value = value;

                        styleCell(cell, {
                            horizontal:
                                columnIndex === 0
                                    ? 'center'
                                    : 'left'
                        });
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
                            fgColor: {
                                argb: 'F8FAFC'
                            }
                        };
                    }
                }

                sheet.getRow(row).height = 24;
            }
        );
    }

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
        paperSize: 9,
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
// GET ALL WORK LOGS
// ============================================================

exports.getAllWorkLogs = async (
    req,
    res
) => {
    const {
        search = '',
        page = 1,
        limit = 10,
        sort = 'newest',
        workDate = ''
    } = req.query;

    try {
        const result =
            await workLogsModel.getAllWorkLogs(
                search,
                Number(page),
                Number(limit),
                sort,
                workDate
            );

        return res.status(200).json({
            success: true,

            data:
                Array.isArray(result.rows)
                    ? result.rows
                    : [],

            pagination: {
                page: Number(page),
                limit: Number(limit),

                totalPages:
                    Math.ceil(
                        result.total /
                        Number(limit)
                    ),

                totalRecords:
                    result.total
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

exports.getTodaySummary = async (
    req,
    res
) => {
    const { employee_id } =
        req.params;

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
// GET EMPLOYEES NOT LOGGED
// ============================================================

exports.getEmployeesNotLogged = async (
    req,
    res
) => {
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

        // ----------------------------------------------------
        // GET WORK LOGS
        // ----------------------------------------------------

        const worklogsResult =
            await workLogsModel.downloadWorkLogs(
                search,
                sort,
                workDate
            );

        /*
         * IMPORTANT:
         * Your model returns rows directly.
         *
         * Keep support for both array and { rows } just in
         * case, but do not change the model API.
         */
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

        // ----------------------------------------------------
        // NOT LOGGED EMPLOYEES
        // ----------------------------------------------------

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

        // ----------------------------------------------------
        // TOTALS
        // ----------------------------------------------------

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

        // ----------------------------------------------------
        // UNIQUE EMPLOYEES
        // ----------------------------------------------------

        const employeeSet =
            new Set(
                worklogs
                    .map((row) =>
                        row.employee_id
                            ? String(
                                row.employee_id
                            )
                            : row.employee_name
                    )
                    .filter(Boolean)
            );

        // ----------------------------------------------------
        // UNIQUE PROJECTS
        // ----------------------------------------------------

        const projectSet =
            new Set(
                worklogs
                    .map(
                        row =>
                            row.project_name
                    )
                    .filter(Boolean)
            );

        // ----------------------------------------------------
        // UNIQUE WORK TYPES
        // ----------------------------------------------------

        const workTypeSet =
            new Set(
                worklogs
                    .map(
                        row =>
                            row.work_type_name
                    )
                    .filter(Boolean)
            );

        // ----------------------------------------------------
        // WORK DATES
        // ----------------------------------------------------

        const workDatesSet =
            getUniqueWorkDates(
                worklogs
            );

        /*
         * If a work date was explicitly selected but there are
         * no rows, still treat that selected date as one
         * workday for capacity calculations.
         */
        if (
            workDate &&
            worklogs.length === 0
        ) {
            workDatesSet.add(workDate);
        }

        // ----------------------------------------------------
        // EMPLOYEE LOGGING STATUS
        // ----------------------------------------------------

        const loggedEmployeeCount =
            employeeSet.size;

        const notLoggedEmployeeCount =
            notLoggedEmployees.length;

        let activeEmployeeCount = 0;

        if (workDate) {
            activeEmployeeCount =
                loggedEmployeeCount +
                notLoggedEmployeeCount;
        }

        // ----------------------------------------------------
        // CAPACITY
        // ----------------------------------------------------

        const standardMinutes =
            8 * 60;

        const capacityMinutes =
            workDatesSet.size *
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

        // ----------------------------------------------------
        // SUMMARIES
        // ----------------------------------------------------

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

        // ----------------------------------------------------
        // WORKBOOK
        // ----------------------------------------------------

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

        // ----------------------------------------------------
        // SHEETS
        // ----------------------------------------------------

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

        // ----------------------------------------------------
        // DASHBOARD
        // ----------------------------------------------------

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

        // ----------------------------------------------------
        // NOT LOGGED
        // ----------------------------------------------------

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
                notLoggedSheet.getCell(
                    'A1'
                );

            cell.value =
                'NOT LOGGED EMPLOYEES';

            styleCell(cell, {
                bold: true,
                size: 18,
                horizontal: 'center',
                fill: '1F4E78',
                fontColor: 'FFFFFF'
            });

            notLoggedSheet.getRow(1).height = 38;

            notLoggedSheet.mergeCells(
                'A3:B3'
            );

            const message =
                notLoggedSheet.getCell(
                    'A3'
                );

            message.value =
                'Please select a Work Date to determine which active employees have not logged.';

            styleCell(message, {
                horizontal: 'center',
                fill: 'F7F9FB'
            });

            notLoggedSheet.getRow(3).height = 30;
        }

        // ====================================================
        // WORK LOGS SHEET
        // ====================================================

        logsSheet.columns = [
            {
                header: 'Sl No',
                key: 'slNo',
                width: 8
            },
            {
                header: 'Date',
                key: 'date',
                width: 14
            },
            {
                header: 'Employee',
                key: 'employee',
                width: 24
            },
            {
                header: 'Entered By Employee',
                key: 'enteredBy',
                width: 24
            },
            {
                header: 'Department',
                key: 'department',
                width: 20
            },
            {
                header: 'Project',
                key: 'project',
                width: 25
            },
            {
                header: 'Activity',
                key: 'activity',
                width: 25
            },
            {
                header: 'Sub Activity',
                key: 'subActivity',
                width: 25
            },
            {
                header: 'Work Type',
                key: 'workType',
                width: 20
            },
            {
                header: 'Duration',
                key: 'duration',
                width: 13
            },
            {
                header: 'Duration Hours',
                key: 'durationHours',
                width: 16
            },
            {
                header: 'Remarks',
                key: 'remarks',
                width: 35
            }
        ];

        // ----------------------------------------------------
        // ADD LOG ROWS
        // ----------------------------------------------------

        worklogs.forEach(
            (worklog, index) => {
                logsSheet.addRow({
                    slNo: index + 1,

                    /*
                     * IMPORTANT:
                     * This is now a string such as 15-09-2026.
                     * It cannot be shifted by timezone conversion.
                     */
                    date:
                        getExcelDate(
                            worklog.work_date
                        ),

                    employee:
                        worklog.employee_name || '',

                    enteredBy:
                        worklog.entered_by_employee_name || '',

                    department:
                        worklog.department_name || '',

                    project:
                        worklog.project_name || '',

                    activity:
                        worklog.activity_name || '',

                    subActivity:
                        worklog.sub_activity_name || '',

                    workType:
                        worklog.work_type_name || '',

                    duration:
                        formatMinutes(
                            worklog.duration_minutes
                        ),

                    durationHours:
                        minutesToHours(
                            worklog.duration_minutes
                        ),

                    remarks:
                        worklog.remarks || ''
                });
            }
        );

        // ----------------------------------------------------
        // HEADER
        // ----------------------------------------------------

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
                    fill: 'D9E2F3',
                    wrapText: true
                }
            );
        }

        logsSheet.getRow(1).height = 30;

        // ----------------------------------------------------
        // BODY
        // ----------------------------------------------------

        for (
            let rowNumber = 2;
            rowNumber <= logsSheet.rowCount;
            rowNumber++
        ) {
            for (
                let col = 1;
                col <= 12;
                col++
            ) {
                const cell =
                    logsSheet.getCell(
                        rowNumber,
                        col
                    );

                const centered =
                    col === 1 ||
                    col === 2 ||
                    col === 10 ||
                    col === 11;

                styleCell(cell, {
                    horizontal:
                        centered
                            ? 'center'
                            : 'left',

                    wrapText:
                        col === 12
                });
            }

            /*
             * Do NOT apply Excel date numFmt here.
             * Column 2 is intentionally a string date.
             */

            if (rowNumber % 2 === 0) {
                for (
                    let col = 1;
                    col <= 12;
                    col++
                ) {
                    logsSheet.getCell(
                        rowNumber,
                        col
                    ).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {
                            argb: 'F8FAFC'
                        }
                    };
                }
            }

            logsSheet.getRow(
                rowNumber
            ).height = 24;
        }

        // ----------------------------------------------------
        // WORK LOG PRINT SETTINGS
        // ----------------------------------------------------

        logsSheet.views = [
            {
                state: 'frozen',
                ySplit: 1
            }
        ];

        logsSheet.properties.defaultRowHeight = 22;

        logsSheet.autoFilter = {
            from: 'A1',
            to: 'L1'
        };

        logsSheet.pageSetup = {
            orientation: 'landscape',
            paperSize: 9,

            fitToPage: false,
            fitToWidth: 0,
            fitToHeight: 0,

            horizontalDpi: 300,
            verticalDpi: 300
        };

        logsSheet.pageMargins = {
            left: 0.25,
            right: 0.25,
            top: 0.5,
            bottom: 0.5,
            header: 0.2,
            footer: 0.2
        };

        logsSheet.printTitlesRow =
            '1:1';

        if (logsSheet.rowCount > 1) {
            logsSheet.printArea =
                `A1:L${logsSheet.rowCount}`;
        }

        // ====================================================
        // SUMMARY SHEETS
        // ====================================================

        addSummaryTable(
            employeeSheet,
            'Employee Summary',
            employeeSummary
        );

        addSummaryTable(
            departmentSheet,
            'Department Summary',
            departmentSummary
        );

        addSummaryTable(
            projectSheet,
            'Project Summary',
            projectSummary
        );

        addSummaryTable(
            activitySheet,
            'Activity Summary',
            activitySummary
        );

        addSummaryTable(
            workTypeSheet,
            'Work Type Summary',
            workTypeSummary
        );

        // ----------------------------------------------------
        // SUMMARY SETTINGS
        // ----------------------------------------------------

        const summarySheets = [
            employeeSheet,
            departmentSheet,
            projectSheet,
            activitySheet,
            workTypeSheet
        ];

        summarySheets.forEach(
            (sheet) => {
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
                    paperSize: 9,
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
        // WRITE FILE
        // ====================================================

        /*
         * Requested filename:
         *
         * work_logs_report_15-09-2026.xlsx
         *
         * Frontend can also use its own filename, but this header
         * is the correct backend filename.
         */
        const filename = (() => {
            if (!workDate) {
                return 'work_logs_report.xlsx';
            }

            const match =
                String(workDate).match(
                    /^(\d{4})-(\d{2})-(\d{2})$/
                );

            if (match) {
                const [
                    ,
                    year,
                    month,
                    day
                ] = match;

                return `work_logs_report_${day}-${month}-${year}.xlsx`;
            }

            const safeDate =
                String(workDate)
                    .replace(
                        /[^0-9A-Za-z_-]/g,
                        '-'
                    );

            return `work_logs_report_${safeDate}.xlsx`;
        })();

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

        console.log(
            'Filename:',
            filename
        );

        return res.end(buffer);

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