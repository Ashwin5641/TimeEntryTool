import api from "../../api/axios";

export const getAllWorkLogs = async (search, page, limit, sort, workDate) => {
    const res = await api.get('/admin/work-logs', {
        params: {
            search,
            page,
            limit,
            sort,
            workDate
        }
    });
    return res
}

export const downloadWorkLogs = async (
    search,
    sort,
    workDate
) => {

    const blob = await api.get('/admin/work-logs/download', {
        params: {
            search: search || '',
            sort: sort || 'newest',
            workDate: workDate || ''
        },
        responseType: 'blob'
    });

    console.log('DOWNLOAD BLOB:', blob);
    console.log('IS BLOB:', blob instanceof Blob);

    if (!(blob instanceof Blob)) {
        throw new Error('Download response is not a Blob');
    }

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.download = workDate
        ? `work_logs_${workDate}.csv`
        : 'work_logs_all.csv';

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
};