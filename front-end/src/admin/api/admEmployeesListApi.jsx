import api from "../../api/axios";

export const getAllEmployeesList = async (search, page, sort, limit) => {
    const res = await api.get('/admin/employees/employees-list', {
        params: {
            search, 
            page, 
            sort, 
            limit
        }
    });
    return res;
}

export const getEmployeeById = async (id) => {
    const res = await api.get(`/admin/employees/employees-list/edit/${id}`);
    return res;
}

export const updateEmployee = async (id, form) => {
    const res = await api.put(`/admin/employees/employees-list/${id}`, form);
    return res;
}