import api from "../../api/axios";

export const getKpi = async () => {
    const res = await api.get('/admin/dashboard');
    return res;
}