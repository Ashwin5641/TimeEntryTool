import api from "../../api/axios";

export const createProject = async (form) => {
    const res = await api.post('/admin/projects', form);
    return res;
}

export const getAllProjects = async (search, page, limit, sort) => {
    const res = await api.get('/admin/projects', {
        params: {
            search,
            page,
            limit,
            sort
        }
    });
    return res;
}

export const updateProject = async (id, form) => {
    const res = await api.put(`/admin/projects/${id}`, form);
    return res;
}