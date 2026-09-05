import { useEffect, useState } from "react";
import './activitiesForm.css'

import { createActivity, updateActivity } from "../../api/admActivitiesApi";

export default function ActivitiesForm({onSuccess, editActivity, setEditActivity}) {

    const [form, setForm] = useState({
        activity_name: '',
        status: 'Active'
    });

    useEffect(() => {
        if (editActivity) {
            setForm({
                activity_name: editActivity.activity_name,
                status: editActivity.status
            })
        } else {
            setForm({
                activity_name: '',
                status: 'Active'
            })
        }
    }, [editActivity])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editActivity) {
                await updateActivity(editActivity.id, form);
                setEditActivity(null)
            } else {
                await createActivity(form)
            }

            setForm({
                activity_name: '',
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
        <div className="activities-dash-form-comp">
            <h4>{editActivity ? 'Edit Activity' : 'Add Activity'}</h4>
            <form onSubmit={handleSubmit}>
                <div className="activities-form-grp">
                    <label htmlFor="activity_name">Activity Name: </label>
                    <input
                        name="activity_name"
                        value={form.activity_name}
                        onChange={handleChange}
                        placeholder="Enter Activity Name"
                        type="text"
                    />
                </div>
                <br />
                <div className="activities-form-grp">
                    <label htmlFor="status">Status (Active / Inactive): </label>
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
                <div className="activities-form-grp">
                    <button>{editActivity ? 'Update' : 'Add'}</button>
                    {
                        editActivity && <button type="button" onClick={() => setEditActivity(null)}>Cancel</button>
                    }
                </div>
            </form>
        </div>
    )
}