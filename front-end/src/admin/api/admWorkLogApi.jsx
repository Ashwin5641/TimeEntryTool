import api from "../../api/axios";

export const getAllWorkLogs = async (search, page, limit, sort) => {
    const res = await api.get('/admin/work-logs', {
        params: {
            search,
            page,
            limit,
            sort
        }
    });
    return res
}