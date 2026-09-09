import { useEffect, useState } from "react";
import './admWorkLog.css'

import { getAllWorkLogs, downloadWorkLogs } from "../../api/admWorkLogApi";

export default function AdmWorkLog() {

    const [worklogs, setWorklogs] = useState([]);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState('newest');
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [workDate, setWorkDate] = useState('');
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAllWorklogs()
        }, 400);

        return () => clearTimeout(timer)
    }, [search, page, limit, sort, workDate])

    const fetchAllWorklogs = async () => {
        try {
            const res = await getAllWorkLogs(search, page, limit, sort, workDate);
            setWorklogs(res.data);
            setTotalPages(res.pagination.totalPages);
            setTotalRecords(res.pagination.totalRecords)
        } catch (err) {
            console.error(err)
        }
    }

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
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="worklogs-dash">
            <div className="worklogs-dash-header">
                <h4>Work Logs Management</h4>
            </div>
            <div className="worklogs-dash-search">
                <input 
                    type="text"
                    placeholder="Search Employee or department or activity"
                    value={search}
                    onChange={(e) => {setSearch(e.target.value); setPage(1)}}
                />
            </div>
            <div className="worklogs-controls">
                <div>
                    <label>Show: </label>
                    <select
                        value={limit}
                        onChange={(e) => {setLimit(Number(e.target.value)); setPage(1);}}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
                <div>
                    <label>Sort By: </label>
                    <select
                        value={sort}
                        onChange={(e) => {setSort(e.target.value); setPage(1)}}
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="employee_asc">Employee A-Z</option>
                        <option value="employee_desc">Employee Z-A</option>
                        <option value="department_asc">Department A-Z</option>
                        <option value="department_desc">Department Z-A</option>
                        <option value="project_asc">Project A-Z</option>
                        <option value="project_desc">Project Z-A</option>
                    </select>
                </div>
                <button
                    type="button"
                    onClick={handleDownload}
                    disabled={downloading}
                >
                    {downloading ? 'Downloading...' : 'Download'}
                </button>
            </div>
            <div className="worklogs-date-filter">
                <label>Date: </label>

                <input
                    type="date"
                    value={workDate}
                    onChange={(e) => {
                        setWorkDate(e.target.value);
                        setPage(1);
                    }}
                />

                {workDate && (
                    <button
                        type="button"
                        onClick={() => {
                            setWorkDate('');
                            setPage(1);
                        }}
                    >
                        Clear Date
                    </button>
                )}
            </div>
            <div className="worklogs-dash-table">
                <table>
                    <thead>
                        <tr>
                            <th>Sl No</th>
                            <th>Date</th>
                            <th>Employee</th>
                            <th>Entered By Employee</th>
                            <th>Department</th>
                            <th>Project</th>
                            <th>Activity</th>
                            <th>Sub Activity</th>
                            <th>Work Type</th>
                            <th>Duration</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {worklogs.map((worklog, index) => (
                            <tr key={worklog.id}>
                                <td>{(page - 1) * limit + index + 1}</td>
                                <td>{new Date(worklog.work_date).toLocaleDateString('en-In')}</td>
                                <td>{worklog.employee_name}</td>
                                <td>{worklog.entered_by_employee_name}</td>
                                <td>{worklog.department_name}</td>
                                <td>{worklog.project_name}</td>
                                <td>{worklog.activity_name}</td>
                                <td>{worklog.sub_activity_name}</td>
                                <td>{worklog.work_type_name}</td>
                                <td>
                                    {Math.floor(worklog.duration_minutes / 60)}h{" "}
                                    {worklog.duration_minutes % 60}m
                                </td>
                                <td>{worklog.remarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br />
            <div className="worklogs-pagination">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>
                <span>
                    <p>
                        Showing Page {page} of {totalPages} ({totalRecords} records)
                    </p>
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    )
}