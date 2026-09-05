import { useEffect, useState } from "react";
import './subActivitiesForm.css'

import Select from "react-select";

import { createSubActivity, getActivityFromDprtAct, getDprtmntIdAndName, updateSubActivity } from "../../api/admSubActivitiesApi";

export default function SubActivitiesForm({onSuccess, editSubActivity, setEditSubActivity}) {

    const [form, setForm] = useState({
        department_id: '',
        activity_id: '',
        sub_activity: '',
        status: 'Active'
    });

    const [departments, setDepartments] = useState([]);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        fetchAllDepartments();
    }, [])
    
    useEffect(() => {
        if (!form.department_id) {
            setActivities([]);
            return;
        }

        fetchAllActivities(form.department_id);

    }, [form.department_id]);

    useEffect(() => {
        if (editSubActivity) {
            setForm({
                department_id: editSubActivity.department_id,
                activity_id: editSubActivity.activity_id,
                sub_activity: editSubActivity.sub_activity_name,
                status: editSubActivity.status
            })
        } else {
            setForm({
                department_id: '',
                activity_id: '',
                sub_activity: '',
                status: 'Active'
            })
        }
    }, [editSubActivity])

    const fetchAllDepartments = async () => {
        try {
            const res = await getDprtmntIdAndName();
            setDepartments(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const departmentOptions = [
        ...departments.map((department) => ({
            value: department.id,
            label: department.department_name
        }))
    ]

    const fetchAllActivities = async (department_id) => {
        try {
            const res = await getActivityFromDprtAct(department_id);
            setActivities(res.data);
        } catch (err) {
            console.error(err)
        }
    }

    const activityOptions = [
        ...activities.map((activity) => ({
            value: activity.activity_id,
            label: activity.activity_name
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
            if (editSubActivity) {
                await updateSubActivity(editSubActivity.id, form);
                setEditSubActivity(null)
            } else {
                await createSubActivity(form)
            }

            setForm({
                department_id: '',
                activity_id: '',
                sub_activity: '',
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
        <div className="subActivities-dash-form-comp">
            <h4>{editSubActivity ? 'Edit Sub Activity' : 'Add Sub Activity'}</h4>
            <form onSubmit={handleSubmit}>
                <div className="subActivities-form-grp">
                    <label htmlFor="department_id">Department: </label>
                    <Select
                        maxMenuHeight={200}
                        options={departmentOptions}
                        placeholder='Select department'
                        value={departmentOptions.find((option) =>
                            option.value === form.department_id
                        ) || null}
                        onChange={(selected) => {
                            setForm(prev => ({
                                ...prev,
                                department_id: selected?.value || '',
                                activity_id: ''
                            }));
                        }}
                    />
                </div>
                <br />
                <div className="subActivities-form-grp">
                    <label htmlFor="activity_id">Activity: </label>
                    <Select
                        maxMenuHeight={200}
                        options={activityOptions}
                        placeholder='Select activity'
                        value={activityOptions.find((option) => (
                            option.value === form.activity_id
                        )) || null}
                        onChange={(selected) => (
                            setForm({
                                ...form,
                                activity_id: selected.value
                            })
                        )}
                    />
                </div>
                <br />
                <div className="subActivities-form-grp">
                    <label htmlFor="sub_activity">Sub Activity: </label>
                    <input 
                        name="sub_activity"
                        type="text"
                        placeholder="Enter sub activity"
                        value={form.sub_activity}
                        onChange={handleChange}
                    />
                </div>
                <br />
                <div className="subActivities-form-grp">
                    <label htmlFor="status">Status: </label>
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
                <div className="subActivities-form-grp">
                    <button>{editSubActivity ? 'Update' : 'Add'}</button>
                    {
                        editSubActivity && <button type="button" onClick={() => setEditSubActivity(null)}>Cancel</button>
                    }
                </div>
            </form>
        </div>
    )
}