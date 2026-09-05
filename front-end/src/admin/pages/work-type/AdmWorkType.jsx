import { useEffect, useState } from "react";
import './admWorkType.css'

import WorkTypeForm from "../../components/work-type/WorkTypeForm";
import { getAllWorkTypes } from "../../api/admWorkTypeApi";

export default function AdmWorkType() {

    const [workTypes, setWorkTypes] = useState([]);

    const [editWorkType, setEditWorkType] = useState(null);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState('newest');
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        fetchAllWorkTypes()
    }, [search, page, limit, sort])

    const fetchAllWorkTypes = async () => {
        try {
            const res = await getAllWorkTypes(search, Number(page), Number(limit), sort);
            setWorkTypes(res.data);
            setTotalPages(res.pagination.totalPages)
            setTotalRecords(res.pagination.totalRecords)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="work-type-dash">
            <div className="work-type-dash-header">
                <h4>Work Type Management</h4>
            </div>
            <div className="work-type-dash-form">
                <WorkTypeForm 
                    onSuccess={fetchAllWorkTypes}
                    editWorkType={editWorkType}
                    setEditWorkType={setEditWorkType}
                />
            </div>
            <div className="work-type-dash-search">
                <input 
                    type="text"
                    placeholder="Search work type"
                    value={search}
                    onChange={(e) => {setSearch(e.target.value); setPage(1)}}
                />
            </div>
            <div className="work-type-list-controls">
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
                        <option value="subActivity_asc">Sub Activity A-Z</option>
                        <option value="subActivity_desc">Sub Activity Z-A</option>
                    </select>
                </div>
            </div>
            <div className="work-type-dash-table">
                <table>
                    <thead>
                        <tr>
                            <th>Sl No</th>
                            <th>Work Type Name</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workTypes.map((workType, index) => (
                            <tr key={workType.id}>
                                <td>{index + 1}</td>
                                <td>{workType.work_type_name}</td>
                                <td>{workType.status}</td>
                                <td>{new Date(workType.created_at).toLocaleDateString('en-In')}</td>
                                <td>
                                    <button type="button" onClick={() => setEditWorkType(workType)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br />
            <div className="work-type-list-pagination">
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