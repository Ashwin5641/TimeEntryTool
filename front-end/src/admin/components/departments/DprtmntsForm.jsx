import { useEffect, useState } from "react";
import './dprtmntsForm.css'

import { createDepartment, updateDepartment } from "../../api/admDprtmntsApi";

export default function DprtmntsForm({onSuccess, editDepartment, setEditDepartment}) {

    const [form, setForm] = useState({
        department_name: '',
        department_code: '',
        status: 'Active'
    })

    useEffect(() => {
        if (editDepartment) {
            setForm({
                department_name: editDepartment.department_name,
                department_code: editDepartment.department_code,
                status: editDepartment.status
            })
        } else {
            setForm({
                department_name: '',
                department_code: '',
                status: 'Active'
            })
        }
    }, [editDepartment])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            
            if (editDepartment) {
                await updateDepartment(editDepartment.id, form);
                setEditDepartment(null);
            } else {
                await createDepartment(form)
            }
 
            setForm({
                department_name: '',
                department_code: '',
                status: 'Active'
            })
        } catch (err) {
            console.error(err)
        }

        if (onSuccess) {
            onSuccess();
        }
    }

    return (
        <div className="dprtmnts-dash-form-comp">
            <h4>{editDepartment ? 'Edit Department' : 'Add Department'}</h4>
            <form onSubmit={handleSubmit}>
                <div className="dprtmnts-form-grp">
                    <label htmlFor="department_name">Department Name: </label>
                    <input name="department_name" value={form.department_name} type="text" placeholder="Enter Department Name" onChange={handleChange} />
                </div>
                <br />
                <div className="dprtmnts-form-grp">
                    <label htmlFor="depratment_code">Department Code: </label>
                    <input name="department_code" value={form.department_code} type="text" placeholder="Enter Department Code" onChange={handleChange} />
                </div>
                <br />
                <div className="dprtmnts-form-grp">
                    <label htmlFor="status">Status (Active / Inactive): </label>
                    <select 
                        name="status" 
                        onChange={handleChange}
                        value={form.status}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <br />
                <button>{editDepartment ? 'EDIT' : 'ADD'}</button>
                {
                    editDepartment && <button onClick={() => setEditDepartment(null)}>Cancel</button>
                }
            </form>
        </div>
    )
}