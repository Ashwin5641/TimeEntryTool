import { useEffect, useState } from "react";
import './employeesForm.css';

import Select from "react-select";
import { useNavigate } from "react-router-dom";

import { createEmployee, getDprtmntsNameAndIdStsAct } from "../../api/admEmployeesApi";
import { updateEmployee } from "../../api/admEmployeesListApi";

export default function EmployeesForm({editEmployee, setEditEmployee}) {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        employee_id: '',
        employee_name: '',
        department_id: '',
        designation: '',
        status: 'Active'
    });

    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetchAllDepartments();
    }, [])

    useEffect(() => {
        if (editEmployee) {
            setForm({
                id: editEmployee.id,
                employee_id: editEmployee.employee_id,
                employee_name: editEmployee.employee_name,
                department_id: editEmployee.department_id,
                designation: editEmployee.designation,
                status: editEmployee.status
            })
        } else {
            setForm({
                employee_id: '',
                employee_name: '',
                department_id: '',
                designation: '',
                status: 'Active'
            })
        }
    }, [editEmployee])

    const fetchAllDepartments = async () => {
        try {
            const res = await getDprtmntsNameAndIdStsAct();
            setDepartments(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const departmentOptions = [
        ...departments.map(department => ({
            value: department.id,
            label: department.department_name
        }))
    ]

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (editEmployee) {
                await updateEmployee(editEmployee.id, form);
                navigate('/admin/employees-list')
            } else {
                await createEmployee(form);
                setForm({
                    employee_id: '',
                    employee_name: '',
                    department_id: '',
                    designation: '',
                    status: 'Active'
                })
                navigate('/admin/employees-list')
            }
            
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="employees-dash-form-comp">
            <h4>{editEmployee ? 'Edit Employee' : 'Add Employee'}</h4>
            <form onSubmit={handleSubmit}>
                <div className="employee-form-grp">
                    <label htmlFor="employee_id">Employee ID: </label>
                    <input name="employee_id" value={form.employee_id} onChange={handleChange} type="text" placeholder="Enter Employee ID" />
                </div>
                <br />
                <div className="employee-form-grp">
                    <label htmlFor="employee_name">Employee Name: </label>
                    <input name="employee_name" value={form.employee_name} onChange={handleChange} type="text" placeholder="Enter Employee Name" />
                </div>
                <br />
                <div className="employee-form-grp">
                    <label htmlFor="department_id">Department Name: </label>
                    <Select
                        name="department_id"
                        placeholder='Select Department'
                        options={departmentOptions}
                        minMenuHeight={200}
                        isSearchable
                        value={departmentOptions.find(
                            (option) => option.value === Number(form.department_id)
                        ) || null}
                        onChange={(selected) => {
                            setForm({
                                ...form,
                                department_id: selected.value
                            })
                        }}
                    />
                </div>
                <br />
                <div className="employee-form-grp">
                    <label htmlFor="designation">Designation: </label>
                    <input name="designation" value={form.designation} onChange={handleChange} type="text" placeholder="Enter Designation" />
                </div>
                <br />
                <div className="employee-form-grp">
                    <label htmlFor="status">Status: </label>
                    <select 
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <br />
                <div className="employee-form-grp">
                    <button>{editEmployee ? 'Update' : 'Add'}</button>
                    {
                        editEmployee && <button type="button" onClick={() => {setEditEmployee(null); navigate('/admin/employees-list')}}>Cancel</button>
                    }
                </div>
            </form>
        </div>
    )
}