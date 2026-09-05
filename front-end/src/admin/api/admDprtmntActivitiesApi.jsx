import api from "../../api/axios";

export const getDprtmntIdAndNameWithActSts = async  () => {
    const res = await api.get('/admin/departments/options/department-activities');
    return res;
}

export const getActivitiesNameAndIdWithActSts = async () => {
    const res = await api.get('/admin/activities/options/department-activities');
    return res
}

export const createDprtmntActivity = async (form) => {
    const res = await api.post('/admin/department-activities', form);
    return res
}

export const getAllDprtmntActivities = async (search, page, limit, sort) => {
    const res = await api.get('/admin/department-activities', {
        params: {
            search,
            page,
            limit, 
            sort
        }
    });
    return res
}

export const updateDprtmntActivity = async (id, form) => {
    const res = await api.put(`/admin/department-activities/${id}`, form);
    return res;
}