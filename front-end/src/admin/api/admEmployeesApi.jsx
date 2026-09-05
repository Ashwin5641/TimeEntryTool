import api from "../../api/axios";

export const getDprtmntsNameAndIdStsAct = async () => {
    const res = await api.get('/admin/departments/options/employees');
    return res;
}

export const createEmployee = async (form) => {
    const res = await api.post('/admin/employees', form);
    return res;
}