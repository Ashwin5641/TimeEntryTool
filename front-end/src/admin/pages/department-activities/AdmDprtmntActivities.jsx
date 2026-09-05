import { useEffect, useState } from "react";
import './admDprtmntActivities.css'

import DprtmntActivitiesForm from "../../components/department-activities/DprtmentActivitiesForm";
import { getAllDprtmntActivities } from "../../api/admDprtmntActivitiesApi";

export default function AdmDprtmntActivities() {

    const [dprtmntActivities, setDprtmntActivities] = useState([]);

    const [editDprtmntActivity, setEditDprtmntActivity] = useState(null);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState('newest');
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAllDprtmntActivities();
        }, 400);

        return () => clearTimeout(timer)
    }, [search, page, limit, sort])

    const fetchAllDprtmntActivities = async () => {
        try {
            const res = await getAllDprtmntActivities(search, Number(page), Number(limit), sort);
            setDprtmntActivities(res.data);
            setTotalPages(res.pagination.totalPages);
            setTotalRecords(res.pagination.totalRecords)
        } catch (err) { 
            console.error(err)
        }
    }

    return (
        <div className="dprtmnt-activities-dash">
            <div className="dprtmnt-activities-dash-header">
                <h4>Department Activities Management</h4>
            </div>
            <div className="dprtmnt-activities-dash-form">
                <DprtmntActivitiesForm
                    onSuccess={fetchAllDprtmntActivities} 
                    editDprtmntActivity={editDprtmntActivity}
                    setEditDprtmntActivity={setEditDprtmntActivity}
                />
            </div>
            <div className="dprtmnt-activities-dash-search">
                <input 
                    type="text" 
                    placeholder="Search department name or activity name"
                    value={search}
                    onChange={(e) => {setSearch(e.target.value); setPage(1)}}
                />
            </div>
            <div className="dprtmnt-activities-list-controls">
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
                        <option value="activity_asc">Activity A-Z</option>
                        <option value="activity_desc">Activity Z-A</option>
                    </select>
                </div>
            </div>
            <div className="dprtmnt-activities-dash-table">
                <table>
                    <thead>
                        <tr>
                            <th>Sl No</th>
                            <th>Depertment Name</th>
                            <th>Activity Name</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dprtmntActivities.map((dprtmntActivity, index) => (
                            <tr key={dprtmntActivity.id}>
                                <td>{(page - 1) * limit + index + 1}</td>
                                <td>{dprtmntActivity.department_name}</td>
                                <td>{dprtmntActivity.activity_name}</td>
                                <td>{dprtmntActivity.status}</td>
                                <td>{new Date(dprtmntActivity.created_at).toLocaleDateString('en-In')}</td>
                                <td>
                                    <button type="button" onClick={() => setEditDprtmntActivity(dprtmntActivity)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br />
            <div className="dprtmnt-activities-list-pagination">
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