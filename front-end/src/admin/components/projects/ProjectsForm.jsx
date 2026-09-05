import { useEffect, useState } from "react";
import './projectsForm.css'

import { createProject, updateProject } from "../../api/admProjectsApi";

export default function ProjectsForm({onSuccess, editProject, setEditProject}) {

    const [form, setForm] = useState({
        project_code: '',
        project_name: '',
        customer_name: '',
        description: '',
        status: 'Active'
    })

    useEffect(() => {
        if (editProject) {
            setForm({
                project_code: editProject.project_code,
                project_name: editProject.project_name,
                customer_name: editProject.customer_name,
                description: editProject.description,
                status: editProject.status
            })
        } else {
            setForm({
                project_code: '',
                project_name: '',
                customer_name: '',
                description: '',
                status: 'Active'
            })
        }
    }, [editProject])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (editProject) {
                await updateProject(editProject.id, form);
                setEditProject(null)
            } else {
                await createProject(form)
            }

            setForm({
                project_code: '',
                project_name: '',
                customer_name: '',
                description: '',
                status: 'Active'
            })

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="projects-dash-form-comp">
            <h4>{editProject ? 'Edit Project' : 'Add Project'}</h4>
            <form onSubmit={handleSubmit}>
                <div className="projects-form-grp">
                    <label htmlFor="project_code">Project Code: </label>
                    <input 
                        name="project_code" 
                        value={form.project_code} 
                        onChange={handleChange} 
                        placeholder="Enter project code" 
                        type="text" 
                    />
                </div>
                <br />
                <div className="projects-form-grp">
                    <label htmlFor="project_name">Project Name: </label>
                    <input 
                        name="project_name" 
                        value={form.project_name} 
                        onChange={handleChange} 
                        placeholder="Enter project name" 
                        type="text" 
                    />
                </div>
                <br />
                <div className="projects-form-grp">
                    <label htmlFor="customer">Customer Name: </label>
                    <input 
                        name="customer_name" 
                        value={form.customer_name} 
                        onChange={handleChange} 
                        placeholder="Enter customer"
                        type="text" 
                    />
                </div>
                <br />
                <div className="projects-form-grp">
                    <label htmlFor="description">Description: </label>
                    <textarea name="description" value={form.description} onChange={handleChange}></textarea>
                </div>
                <br />
                <div className="projects-form-grp">
                    <label htmlFor="status">Status (Active / Inactive): </label>
                    <select name="status" value={form.status} onChange={handleChange}>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <br />
                <div className="projects-form-grp">
                    <button type="submit">{editProject ? 'Update' : 'Add'}</button>
                    {
                        editProject && <button type="button" onClick={() => setEditProject(null)}>Cancel</button>
                    }
                </div>
            </form>
        </div>
    )
}