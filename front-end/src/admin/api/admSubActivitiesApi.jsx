import api from "../../api/axios";

export const getDprtmntIdAndName = async () => {
    const res = await api.get('/admin/departments/options/sub-activities');
    return res;
}

export const getActivityFromDprtAct = async (department_id) => {
    const res = await api.get(`/admin/department-activities/options/sub-activities`, {
        params: {
            department_id
        }
    });
    return res;
}

export const createSubActivity = async (form) => {
    const res = await api.post(`/admin/sub-activities`, form);
    return res;
}

export const getAllSubActivities = async (search, page, limit, sort) => {
    const res = await api.get('/admin/sub-activities', {
        params: {
            search,
            page,
            limit,
            sort
        }
    });
    return res
}

export const updateSubActivity = async (id, form) => {
    const res = await api.put(`/admin/sub-activities/${id}`, form);
    return res;
}