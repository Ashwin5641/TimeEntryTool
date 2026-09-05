import { useEffect, useState } from "react";
import './admSubActivities.css';

import SubActivitiesForm from "../../components/sub-activties/SubActivitiesForm";

import { getAllSubActivities } from "../../api/admSubActivitiesApi";

export default function AdmSubActivities() {

    const [subActivities, setSubActivities] = useState([]);

    const [editSubActivity, setEditSubActivity] = useState(null);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState('newest');
    const [totalPages, setTotalPages] = useState(1)
    const [totalRecords, setTotalRecords] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAllSubActivities()
        }, 400);

        return () => clearTimeout(timer)
    }, [search, page, limit, sort])

    const fetchAllSubActivities = async () => {
        try {
            const res = await getAllSubActivities(search, Number(page), Number(limit), sort);
            setSubActivities(res.data)
            setTotalPages(res.pagination.totalPages)
            setTotalRecords(res.pagination.totalRecords)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="subActivities-dash">
            <div className="subActivities-dash-header">
                <h4>Sub Activities Management</h4>
            </div>
            <div className="subActivities-dash-form">
                <SubActivitiesForm 
                    onSuccess={fetchAllSubActivities}
                    editSubActivity={editSubActivity}
                    setEditSubActivity={setEditSubActivity}
                />
            </div>
            <div className="subActivities-dash-search">
                <input 
                    type="text"
                    value={search}
                    placeholder="Search department name or activity name or sub activity name"
                    onChange={(e) => {setSearch(e.target.value); setPage(1)}}
                />
            </div>
            <div className="subActivities-list-controls">
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
                        <option value="workType_asc">Work Type A-Z</option>
                        <option value="workType_desc">Work Type Z-A</option>
                    </select>
                </div>
            </div>
            <div className="subActivities-dash-table">
                <table>
                    <thead>
                        <tr>
                            <th>Sl No</th>
                            <th>Department Name</th>
                            <th>Activity Name</th>
                            <th>Sub Activity Name</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subActivities.map((subActivity, index) => (
                            <tr key={subActivity.id}>
                                <td>{(page - 1) * limit + index + 1}</td>
                                <td>{subActivity.department_name}</td>
                                <td>{subActivity.activity_name}</td>
                                <td>{subActivity.sub_activity_name}</td>
                                <td>{subActivity.status}</td>
                                <td>{new Date(subActivity.created_at).toLocaleDateString('en-In')}</td>
                                <td>
                                    <button type="button" onClick={() => setEditSubActivity(subActivity)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br />
            <div className="subActivities-list-pagination">
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