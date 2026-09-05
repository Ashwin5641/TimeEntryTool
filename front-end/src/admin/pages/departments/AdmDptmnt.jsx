import { useEffect, useState } from "react";
import './admDptmnt.css'

import DprtmntsForm from "../../components/departments/DprtmntsForm";

import { deleteDepartment, getAllDepartments } from "../../api/admDprtmntsApi";

export default function AdmDptmnt() {

    const [departments, setDepartments] = useState([]);

    const [editDepartment, setEditDepartment] = useState(null);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState('newest');
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAllDepartments()
        }, 400);

        return () => clearTimeout(timer)
    }, [search, page, limit, sort])

    const fetchAllDepartments = async () => {
        try {
            const res = await getAllDepartments(search, page, limit, sort);
            setDepartments(res.data)
            setTotalPages(res.pagination.totalPages);
            setTotalRecords(res.pagination.totalRecords)
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteDepartment(id);
            fetchAllDepartments();
        } catch (err) {
            console.error(err)
        }
    }

    const handleEdit = async (edit) => {
        setEditDepartment(edit)
    }

    return (
        <div className="dprtmnts-dash">
            <div className="dprtmnts-dash-header">
                <h4>Departments Management</h4>
            </div>
            <div className="dprtmnts-dash-form">
                <DprtmntsForm 
                    onSuccess={fetchAllDepartments} 
                    editDepartment={editDepartment} 
                    setEditDepartment={setEditDepartment} 
                />
            </div>
            <div className="dprtmnts-dash-search">
                <input
                    type="text"
                    placeholder="Search department name or department code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="dprtmnts-controls">
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
                        <option value="department_asc">Department A-Z</option>
                        <option value="department_desc">Department Z-A</option>
                    </select>
                </div>
            </div>
            <div className="dprtmnts-dash-table">
                <table>
                    <thead>
                        <tr>
                            <th>Sl No</th>
                            <th>Department Name</th>
                            <th>Department Code</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((department, index) => (
                            <tr key={department.id}>
                                <td>{index + 1}</td>
                                <td>{department.department_name}</td>
                                <td>{department.department_code}</td>
                                <td>{department.status}</td>
                                <td>{new Date(department.created_at).toLocaleDateString()}</td>
                                <td>
                                    <button type="button" onClick={() => handleEdit(department)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br />
            <div className="dprtmnts-pagination">
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