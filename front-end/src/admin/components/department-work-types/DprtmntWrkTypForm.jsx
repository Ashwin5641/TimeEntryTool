import { useEffect, useState } from "react";
import './DprtmntWrkTypForm.css'

import Select from "react-select";

import { createDprtmntWrkTyp, getAllDepartments, getAllWorkTypes, updateDeprtmntWrkTyp } from "../../api/admDprtmntWrkTypApi";

export default function DrprtmntWrkTypForm({onSuccess, editDeprtmntWrkTyp, setEditDprtmntWrkTyp}) {

    const [departments, setDepartments] = useState([]);
    const [workTypes, setWorkTypes] = useState([]);

    const [form, setForm] = useState({
        department_id: '',
        work_type_id: '',
        status: 'Active'
    })

    useEffect(() => {
        if (editDeprtmntWrkTyp) {
            setForm({
                department_id: editDeprtmntWrkTyp.department_id,
                work_type_id: editDeprtmntWrkTyp.work_type_id,
                status: editDeprtmntWrkTyp.status
            })
        } else {
            setForm({
                department_id: '',
                work_type_id: '',
                status: 'Active'
            })
        }
    }, [editDeprtmntWrkTyp])

    useEffect(() => {
        fetchAllDepartments();
        fetchAllWorkTypes();
    }, [])

    const fetchAllDepartments = async () => {
        try {
            const res = await getAllDepartments();
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

    const fetchAllWorkTypes = async () => {
        try {
            const res = await getAllWorkTypes();
            setWorkTypes(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const workTypesOptions = [
        ...workTypes.map((workType) => ({
            label: workType.work_type_name,
            value: workType.id
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
            if (editDeprtmntWrkTyp) {
                await updateDeprtmntWrkTyp(editDeprtmntWrkTyp.id, form);
                setEditDprtmntWrkTyp(null)
            } else {
                await createDprtmntWrkTyp(form)
            }

            setForm({
                department_id: '',
                work_type_id: '',
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
        <div className="dprtmnt-wrkTypes-dash-form-comp">
            <h4>{editDeprtmntWrkTyp  ? 'Edit Department Work Type' : 'Add Department Work Type'}</h4>
            <form onSubmit={handleSubmit}>
                <div className="dprtmnt-wrkTypes-form-grp">
                    <label htmlFor="department_id">Department Name: </label>
                    <Select 
                        options={departmentOptions}
                        placeholder='Select Department'
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
                <div className="dprtmnt-wrkTypes-form-grp">
                    <label htmlFor="department_id">Work Type Name: </label>
                    <Select 
                        options={workTypesOptions}
                        placeholder='Select Work Type'
                        value={workTypesOptions.find(
                            option => option.value === form.work_type_id
                        ) || null}
                        onChange={(selected) => {
                            setForm({
                                ...form,
                                work_type_id: selected.value
                            })
                        }}
                    />
                </div>
                <br />
                <div className="dprtmnt-wrkTypes-form-grp">
                    <label htmlFor="status">Status (Active / Inactive)</label>
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
                <div className="dprtmnt-wrkTypes-form-grp">
                    <button type="submit">{editDeprtmntWrkTyp ? 'Update' : 'Add'}</button>
                    {
                        editDeprtmntWrkTyp && <button onClick={() => setEditDprtmntWrkTyp(null)} type='button'>Cancel</button>
                    }
                </div>
            </form>
        </div>
    )
}