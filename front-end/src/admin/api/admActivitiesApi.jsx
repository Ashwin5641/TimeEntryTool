import api from "../../api/axios";

export const createActivity = async (form) => {
    const res = await api.post('/admin/activities', form);
    return res;
}

export const getAllActivities = async (search, page, limit, sort) => {
    const res = await api.get('/admin/activities', {
        params: {
            search,
            page,
            limit,
            sort
        }
    });
    return res;
}

export const updateActivity = async (id, form) => {
    const res = await api.put(`/admin/activities/${id}`, form);
    return res;
}