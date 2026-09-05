import api from "../../api/axios";

export const createDepartment = async (form) => {
    const res = await api.post('/admin/departments', form);
    return res;
}

export const getAllDepartments = async (search, page, limit, sort) => {
    const res = await api.get('/admin/departments', {
        params: {
            search,
            page,
            limit,
            sort
        }
    });
    return res;
}

export const deleteDepartment = async (id)  => {
    const res = await api.delete(`/admin/departments/${id}`);
    return res;
}

export const updateDepartment = async (id, form) => {
    const res = await api.put(`/admin/departments/${id}`, form);
    return res;
}