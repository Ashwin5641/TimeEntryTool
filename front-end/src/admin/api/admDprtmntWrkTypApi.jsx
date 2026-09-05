import api from "../../api/axios";

export const getAllDepartments = async () => {
    const res = await api.get('/admin/departments/options/department-work-types');
    return res
}

export const getAllWorkTypes = async () => {
    const res = await api.get('/admin/work-type/options/department-work-types');
    return res;
}

export const createDprtmntWrkTyp = async (form) => {
    const res = await api.post('/admin/department-work-types', form);
    return res
}

export const getAllDeprtmntwrkTypes = async (search, page, limit, sort) => {
    const res = await api.get('/admin/department-work-types', {
        params: {
            search,
            page,
            limit,
            sort
        }
    });
    return res
}

export const updateDeprtmntWrkTyp = async (id, form) => {
    const res = await api.put(`/admin/department-work-types/${id}`, form);
    return res;
}