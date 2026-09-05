import { useEffect, useState } from "react";
import './admProjects.css'

import ProjectsForm from "../../components/projects/ProjectsForm";

import { getAllProjects } from "../../api/admProjectsApi";

export default function AdmProjects() {

    const [projects, setProjects] = useState([]);

    const [editProject, setEditProject] = useState('');

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState('newest');
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAllProjects()
        }, 400);

        return () => clearTimeout(timer)
    }, [search, page, limit, sort])

    const fetchAllProjects = async () => {
        try {
            const res = await getAllProjects(search, Number(page), Number(limit), sort);
            setProjects(res.data);
            setTotalPages(res.pagination.totalPages)
            setTotalRecords(res.pagination.totalRecords)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="projects-dash">
            <div className="projects-dash-header">
                <h4>Projects Management</h4>
            </div>
            <div className="projects-dash-form">
                <ProjectsForm 
                    onSuccess={fetchAllProjects} 
                    editProject={editProject} 
                    setEditProject={setEditProject} 
                />
            </div>
            <div className="projects-dash-search">
                <input 
                    type="text"
                    placeholder="Search project code or project name or customer name"
                    value={search}
                    onChange={(e) => {setSearch(e.target.value), setPage(1)}}
                />
            </div>
            <div className="projects-list-controls">
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
                        <option value="project_asc">Project A-Z</option>
                        <option value="project_desc">Project Z-A</option>
                    </select>
                </div>
            </div>
            <div className="projects-dash-table">
                <table>
                    <thead>
                        <tr>
                            <th>Sl No</th>
                            <th>Project Code</th>
                            <th>Project Name</th>
                            <th>Customer Name</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            projects.map((project, index) => (
                                <tr key={project.id}> 
                                    <td>{(page - 1) * limit + index + 1}</td>
                                    <td>{project.project_code}</td>
                                    <td>{project.project_name}</td>
                                    <td>{project.customer_name}</td>
                                    <td title={project.description}>
                                        {
                                            project.description?.length > 40
                                            ? `${project.description?.slice(0, 25)}...`
                                            : project.description
                                        }
                                    </td>
                                    <td>{project.status}</td>
                                    <td>{new Date(project.created_at).toLocaleDateString('en-In')}</td>
                                    <td>
                                        <button type="button" onClick={() => setEditProject(project)}>Edit</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <br />
            <div className="projects-list-pagination">
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