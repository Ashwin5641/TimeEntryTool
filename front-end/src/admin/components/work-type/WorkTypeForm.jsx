import { useEffect, useState } from "react";
import './workTypeForm.css'

import { createWorkType, updateWorkType } from "../../api/admWorkTypeApi";

export default function WorkTypeForm({onSuccess, editWorkType, setEditWorkType}) {

    const [form, setForm] = useState({
        work_type_name: '',
        status: 'Active'
    })
    
    useEffect(() => {
        if (editWorkType) {
            setForm({
                work_type_name: editWorkType.work_type_name,
                status: editWorkType.status
            })
        } else {
            setForm({
                work_type_name: '',
                status: 'Active'
            })
        }
    }, [editWorkType])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editWorkType) {
                await updateWorkType(editWorkType.id, form);
                setEditWorkType(null)
            } else {
                await createWorkType(form)
            }

            setForm({
                work_type_name: '',
                status: 'Active'
            })

            if (onSuccess) {
                onSuccess()
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="work-type-dash-form-comp">
            <h4>Add Work Type</h4>
            <form onSubmit={handleSubmit}>
                <div className="work-type-form-grp">
                    <label htmlFor="work_type_name">Work Type Name: </label>
                    <input 
                        type="text"
                        name="work_type_name"
                        placeholder="Enter work type name"
                        value={form.work_type_name}
                        onChange={handleChange}
                    />
                </div>
                <br />
                <div className="work-type-form-grp">
                    <label htmlFor="Status">Status: </label>
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
                <div className="work-type-form-grp">
                    <button type="submit">{editWorkType ? 'Update' : 'Add'}</button>
                    {
                        editWorkType && <button onClick={() => setEditWorkType(null)} type="button">Cancel</button>
                    }
                </div>
            </form>
        </div>
    )
}