import { useEffect, useState } from "react";
import './admDprtmntWrkTyp.css';

import DrprtmntWrkTypForm from "../../components/department-work-types/DprtmntWrkTypForm";
import { getAllDeprtmntwrkTypes } from "../../api/admDprtmntWrkTypApi";

export default function AdmDprtmntWrkTyp() {

    const [dprtmntWrkTypes, setDprtmntWrkTypes] = useState([]);
    const [editDeprtmntWrkTyp, setEditDprtmntWrkTyp] = useState(null);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState('newest');
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAllDprmntWrkTypes()
        }, 400);

        return () => clearTimeout(timer)
    }, [search, page, limit, sort])

    const fetchAllDprmntWrkTypes = async () => {
        try {
            const res = await getAllDeprtmntwrkTypes(search, Number(page), Number(limit), sort);
            setDprtmntWrkTypes(res.data);
            setTotalPages(res.pagination.totalPages)
            setTotalRecords(res.pagination.totalRecords)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="dprtmnt-wrkTypes-dash">
            <div className="dprtmnt-wrkTypes-dash-header">
                <h4>Department Work Type Management</h4>
            </div>
            <div className="dprtmnt-wrkTypes-dash-form">
                <DrprtmntWrkTypForm 
                    onSuccess={fetchAllDprmntWrkTypes}
                    editDeprtmntWrkTyp={editDeprtmntWrkTyp}
                    setEditDprtmntWrkTyp={setEditDprtmntWrkTyp}
                />
            </div>
            <div className="dprtmnt-wrkTypes-dash-search">
                <input 
                    type="text" 
                    placeholder="Search department name or work type"
                    value={search}
                    onChange={(e) => {setSearch(e.target.value); setPage(1)}}
                />
            </div>
            <div className="dprtmnt-wrkTypes-list-controls">
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
                        <option value="department_asc">Department Z-A</option>
                        <option value="department_desc">Department Z-A</option>
                    </select>
                </div>
            </div>
            <div className="dprtmnt-wrkTypes-dash-table">
                <table>
                    <thead>
                        <tr>
                            <th>Sl No</th>
                            <th>Department Name</th>
                            <th>Activity Name</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dprtmntWrkTypes.map((deprtmentWrkType, index) => (
                            <tr key={deprtmentWrkType.id}>
                                <td>{index + 1}</td>
                                <td>{deprtmentWrkType.department_name}</td>
                                <td>{deprtmentWrkType.work_type_name}</td>
                                <td>{deprtmentWrkType.status}</td>
                                <td>{new Date(deprtmentWrkType.created_at).toLocaleDateString('en-In')}</td>
                                <td>
                                    <button onClick={() => setEditDprtmntWrkTyp(deprtmentWrkType)} type="button">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br />
            <div className="dprtmnt-wrkTypes-list-pagination">
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