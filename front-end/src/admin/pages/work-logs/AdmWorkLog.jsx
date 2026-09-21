import { useEffect, useState } from "react";
import "./admWorkLog.css";

import {
    getAllWorkLogs,
    downloadWorkLogs
} from "../../api/admWorkLogApi";


export default function AdmWorkLog() {

    const [worklogs, setWorklogs] =
        useState([]);

    const [search, setSearch] =
        useState('');

    const [page, setPage] =
        useState(1);

    const [limit, setLimit] =
        useState(10);

    const [sort, setSort] =
        useState('newest');

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalRecords, setTotalRecords] =
        useState(0);

    const [workDate, setWorkDate] =
        useState('');

    const [downloading, setDownloading] =
        useState(false);


    // ========================================================
    // FETCH WORK LOGS
    // ========================================================

    useEffect(() => {

        const timer =
            setTimeout(() => {

                fetchAllWorklogs();

            }, 400);


        return () =>
            clearTimeout(timer);

    }, [
        search,
        page,
        limit,
        sort,
        workDate
    ]);


    // ========================================================
    // GET WORK LOGS
    // ========================================================

    const fetchAllWorklogs =
        async () => {

            try {

                const res =
                    await getAllWorkLogs(
                        search,
                        page,
                        limit,
                        sort,
                        workDate
                    );


                setWorklogs(
                    res.data || []
                );


                setTotalPages(
                    res.pagination?.totalPages || 1
                );


                setTotalRecords(
                    res.pagination?.totalRecords || 0
                );


            } catch (err) {

                console.error(
                    'Fetch work logs error:',
                    err
                );

            }

        };


    // ========================================================
    // DOWNLOAD
    // ========================================================

    const handleDownload = async () => {

        try {

            setDownloading(true);

            await downloadWorkLogs(
                search,
                sort,
                workDate
            );

        } catch (err) {

            console.error('Download error:', err);

            alert(
                err?.message ||
                'Failed to download work log report'
            );

        } finally {

            setDownloading(false);

        }
    };

    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate =
        (date) => {

            if (!date) {
                return '';
            }


            const d =
                new Date(date);


            if (Number.isNaN(
                d.getTime()
            )) {

                return date;

            }


            return d.toLocaleDateString(
                'en-IN'
            );

        };


    // ========================================================
    // FORMAT DURATION
    // ========================================================

    const formatDuration =
        (minutes) => {

            const total =
                Number(minutes || 0);


            const hours =
                Math.floor(
                    total / 60
                );


            const mins =
                total % 60;


            return `${hours}h ${mins}m`;

        };


    // ========================================================
    // JSX
    // ========================================================

    return (

        <div className="worklogs-dash">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="worklogs-dash-header">

                <h4>
                    Work Logs Management
                </h4>

            </div>


            {/* ==================================================
                SEARCH
            ================================================== */}

            <div className="worklogs-dash-search">

                <input

                    type="text"

                    placeholder={
                        "Search Employee or department or activity"
                    }

                    value={
                        search
                    }

                    onChange={
                        (e) => {

                            setSearch(
                                e.target.value
                            );

                            setPage(1);

                        }
                    }

                />

            </div>


            {/* ==================================================
                CONTROLS
            ================================================== */}

            <div className="worklogs-controls">


                <div>

                    <label>
                        Show:
                    </label>


                    <select

                        value={
                            limit
                        }

                        onChange={
                            (e) => {

                                setLimit(
                                    Number(
                                        e.target.value
                                    )
                                );

                                setPage(1);

                            }
                        }

                    >

                        <option value={10}>
                            10
                        </option>

                        <option value={25}>
                            25
                        </option>

                        <option value={50}>
                            50
                        </option>

                        <option value={100}>
                            100
                        </option>

                    </select>

                </div>


                <div>

                    <label>
                        Sort By:
                    </label>


                    <select

                        value={
                            sort
                        }

                        onChange={
                            (e) => {

                                setSort(
                                    e.target.value
                                );

                                setPage(1);

                            }
                        }

                    >

                        <option value="newest">
                            Newest
                        </option>

                        <option value="oldest">
                            Oldest
                        </option>

                        <option value="employee_asc">
                            Employee A-Z
                        </option>

                        <option value="employee_desc">
                            Employee Z-A
                        </option>

                        <option value="department_asc">
                            Department A-Z
                        </option>

                        <option value="department_desc">
                            Department Z-A
                        </option>

                        <option value="project_asc">
                            Project A-Z
                        </option>

                        <option value="project_desc">
                            Project Z-A
                        </option>

                    </select>

                </div>


                <button

                    type="button"

                    onClick={
                        handleDownload
                    }

                    disabled={
                        downloading
                    }

                >

                    {
                        downloading
                            ? 'Generating Excel...'
                            : 'Download Excel'
                    }

                </button>

            </div>


            {/* ==================================================
                DATE FILTER
            ================================================== */}

            <div className="worklogs-date-filter">

                <label>
                    Date:
                </label>


                <input

                    type="date"

                    value={
                        workDate
                    }

                    onChange={
                        (e) => {

                            setWorkDate(
                                e.target.value
                            );

                            setPage(1);

                        }
                    }

                />


                {
                    workDate && (

                        <button

                            type="button"

                            onClick={
                                () => {

                                    setWorkDate(
                                        ''
                                    );

                                    setPage(1);

                                }
                            }

                        >

                            Clear Date

                        </button>

                    )
                }

            </div>


            {/* ==================================================
                TABLE
            ================================================== */}

            <div className="worklogs-dash-table">

                <table>

                    <thead>

                        <tr>

                            <th>
                                Sl No
                            </th>

                            <th>
                                Date
                            </th>

                            <th>
                                Employee
                            </th>

                            <th>
                                Entered By Employee
                            </th>

                            <th>
                                Department
                            </th>

                            <th>
                                Project
                            </th>

                            <th>
                                Activity
                            </th>

                            <th>
                                Sub Activity
                            </th>

                            <th>
                                Work Type
                            </th>

                            <th>
                                Duration
                            </th>

                            <th>
                                Remarks
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {
                            worklogs.length === 0
                                ? (

                                    <tr>

                                        <td
                                            colSpan="11"
                                            style={{
                                                textAlign:
                                                    'center'
                                            }}
                                        >

                                            No work logs found

                                        </td>

                                    </tr>

                                )
                                : (

                                    worklogs.map(
                                        (
                                            worklog,
                                            index
                                        ) => (

                                            <tr
                                                key={
                                                    worklog.id
                                                }
                                            >

                                                <td>

                                                    {
                                                        (
                                                            page -
                                                            1
                                                        ) *
                                                        limit +
                                                        index +
                                                        1
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        formatDate(
                                                            worklog.work_date
                                                        )
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        worklog.employee_name ||
                                                        '-'
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        worklog.entered_by_employee_name ||
                                                        '-'
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        worklog.department_name ||
                                                        '-'
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        worklog.project_name ||
                                                        '-'
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        worklog.activity_name ||
                                                        '-'
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        worklog.sub_activity_name ||
                                                        '-'
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        worklog.work_type_name ||
                                                        '-'
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        formatDuration(
                                                            worklog.duration_minutes
                                                        )
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        worklog.remarks ||
                                                        '-'
                                                    }

                                                </td>

                                            </tr>

                                        )
                                    )

                                )
                        }

                    </tbody>

                </table>

            </div>
            <br />

            {/* ==================================================
                PAGINATION
            ================================================== */}

            <div className="worklogs-pagination">


                <button

                    disabled={
                        page === 1
                    }

                    onClick={
                        () =>
                            setPage(
                                page - 1
                            )
                    }

                >

                    Previous

                </button>


                <span>

                    Showing Page
                    {' '}
                    {page}
                    {' '}
                    of
                    {' '}
                    {totalPages}
                    {' '}
                    (
                    {totalRecords}
                    {' '}
                    records)

                </span>


                <button

                    disabled={
                        page >= totalPages
                    }

                    onClick={
                        () =>
                            setPage(
                                page + 1
                            )
                    }

                >

                    Next

                </button>


            </div>

        </div>

    );

}