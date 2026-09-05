import { useEffect, useState } from "react";
import './dprtmentActivitiesForm.css'

import Select from "react-select";

import { createDprtmntActivity, getActivitiesNameAndIdWithActSts, getDprtmntIdAndNameWithActSts, updateDprtmntActivity } from "../../api/admDprtmntActivitiesApi";

export default function DprtmntActivitiesForm({onSuccess, editDprtmntActivity, setEditDprtmntActivity}) {

    const [departments, setDepartments] = useState([]);
    const [activities, setActivities] = useState([]);

    const [form, setForm] = useState({
        department_id: '',
        activity_id: '',
        status: 'Active'
    })

    useEffect(() => {
        if (editDprtmntActivity) {
            setForm({
                department_id: editDprtmntActivity.department_id,
                activity_id: editDprtmntActivity.activity_id,
                status: editDprtmntActivity.status
            })
        } else {
            setForm({
                department_id: '',
                activity_id: '',
                status: 'Active'
            })
        }
    }, [editDprtmntActivity])

    useEffect(() => {
        fetchAllDepartmentNameAndId();
        fetchAllActivitiesNameAndId();
    }, [])

    const fetchAllDepartmentNameAndId = async () => {
        try {
            const res = await getDprtmntIdAndNameWithActSts();
            setDepartments(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const departmentOptions = [
        ...departments.map((department) => ({
            label: department.department_name,
            value: department.id
        }))
    ]

    const fetchAllActivitiesNameAndId = async () => {
        try {
            const res = await getActivitiesNameAndIdWithActSts();
            setActivities(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const activitiesOptions = [
        ...activities.map((activity) => ({
            label: activity.activity_name,
            value: activity.id
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
            if (editDprtmntActivity) {
                await updateDprtmntActivity(editDprtmntActivity.id, form);
                setEditDprtmntActivity(null)
            } else {
                await createDprtmntActivity(form)
            }

            setForm({
                department_id: '',
                activity_id: '',
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
        <div className="dprtmnt-activities-dash-form-comp">
            <h4>Add Department Activity</h4>
            <form onSubmit={handleSubmit}>
                <div className="dprtmnt-activities-form-grp">
                    <label htmlFor="department_id">Department Name: </label>
                    <Select
                        placeholder='Select Department'
                        name="department_id"
                        options={departmentOptions}
                        value={departmentOptions.find(
                            option => option.value === form.department_id
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
                <div className="dprtmnt-activities-form-grp">
                    <label htmlFor="activity_id">Activity Name: </label>
                    <Select
                        placeholder='Select Activity'
                        name="activity_id"
                        options={activitiesOptions}
                        value={activitiesOptions.find(
                            option => option.value === form.activity_id
                        ) || null}
                        onChange={(selected) => {
                            setForm({
                                ...form,
                                activity_id: selected.value
                            })
                        }}
                    />
                </div>
                <br />
                <div className="dprtmnt-activities-form-grp">
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
                <div className="dprtmnt-activities-form-grp">
                    <button type="submit">{editDprtmntActivity ? 'Update' : 'Add'}</button>
                    {
                        editDprtmntActivity && <button onClick={() => setEditDprtmntActivity(null)} type="button">Cancel</button>
                    }
                </div>
            </form>
        </div>
    )
}