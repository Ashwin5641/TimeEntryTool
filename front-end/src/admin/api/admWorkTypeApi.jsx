import api from "../../api/axios";

export const createWorkType = async (form) => {
    const res = await api.post('/admin/work-type', form);
    return res;
}

export const getAllWorkTypes = async (search, page, limit, sort) => {
    const res = await api.get('/admin/work-type', {
        params: {
            search, 
            page,
            limit,
            sort
        }
    });
    return res;
}

export const updateWorkType = async (id, form) => {
    const res = await api.put(`/admin/work-type/${id}`, form);
    return res;
}