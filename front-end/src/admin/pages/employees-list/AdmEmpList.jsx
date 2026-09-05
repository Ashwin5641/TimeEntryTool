import { useEffect, useState } from "react";
import './admEmpList.css'

import { getAllEmployeesList } from "../../api/admEmployeesListApi";

import { useNavigate } from "react-router-dom";

export default function AdmEmpList() {

    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState('newest')
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAllEmployessList()
        }, 400);

        return () => clearTimeout(timer)
    }, [search, page, sort, limit])


    const fetchAllEmployessList = async () => {
        try {
            const res = await getAllEmployeesList(search, page, sort, limit);
            setEmployees(res.data);
            setTotalPages(res.pagination.totalPages);
            setTotalRecords(res.pagination.totalRecords);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="employees-list-dash">
            <div className="employees-list-dash-header">
                <h4>Employees List Management</h4>
            </div>
            <div className="employees-list-dash-search">
                <input
                    type="text" 
                    placeholder="Search Employee Id or Name or Department Name or Designation"
                    value={search}
                    onChange={(e) => {
                        {setSearch(e.target.value); setPage(1)}
                    }}
                />
            </div>
            <div className="employees-list-controls">
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
                    </select>
                </div>
            </div>
            <div className="employees-list-dash-table">
                <table>
                    <thead>
                        <tr>
                            <th>Sl No</th>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Department Name</th>
                            <th>Designation</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee, index) => (
                            <tr key={employee.id}>
                                <td>{(page - 1) * limit + index + 1}</td>
                                <td>{employee.employee_id}</td>
                                <td>{employee.employee_name}</td>
                                <td>{employee.department_name}</td>
                                <td>{employee.designation}</td>
                                <td>{employee.status}</td>
                                <td>
                                    <button onClick={() => navigate(`/admin/employees/edit/${employee.id}`)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br />
            <div className="employees-list-pagination">
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