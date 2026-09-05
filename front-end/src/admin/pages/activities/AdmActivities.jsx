import { useEffect, useState } from "react";
import './admActivities.css'

import ActivitiesForm from "../../components/activities/ActivitiesForm";

import { getAllActivities } from "../../api/admActivitiesApi";

export default function AdmActivities() {

    const [activities, setActivities] = useState([]);

    const [editActivity, setEditActivity] = useState(null);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState('newest');
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAllActivities()
        }, 400);

        return () => clearTimeout(timer)
    }, [search, page, limit, sort])

    const fetchAllActivities = async () => {
        try {
            const res = await getAllActivities(search, Number(page), Number(limit), sort);
            setActivities(res.data)
            setTotalPages(res.pagination.totalPages);
            setTotalRecords(res.pagination.totalRecords)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="activities-dash">
            <div className="activities-dash-header">
                <h4>Activities Management</h4>
            </div>
            <div className="activities-dash-form">
                <ActivitiesForm 
                    onSuccess={fetchAllActivities} 
                    editActivity={editActivity} 
                    setEditActivity={setEditActivity}
                />
            </div>
            <div className="activities-dash-search">
                <input 
                    value={search}
                    onChange={(e) => {setSearch(e.target.value); setPage(1)}}
                    type="text" 
                    placeholder="Search Activity Name..."
                />
            </div>
            <div className="activities-list-controls">
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
                        <option value="activityName_asc">Activity A-Z</option>
                        <option value="activityName_desc">Activity Z-A</option>
                    </select>
                </div>
            </div>
            <div className="activities-dash-table">
                <table>
                    <thead>
                        <tr>
                            <th>Sl No</th>
                            <th>Activity Name</th>
                            <th>Activity Status</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map((activity, index) => (
                            <tr key={activity.id}>
                                <td>{(page - 1) * limit + index + 1}</td>
                                <td>{activity.activity_name}</td>
                                <td>{activity.status}</td>
                                <td>{new Date(activity.created_at).toLocaleDateString('en-In')}</td>
                                <td>
                                    <button type="button" onClick={() => setEditActivity(activity)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br />
            <div className="activities-list-pagination">
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