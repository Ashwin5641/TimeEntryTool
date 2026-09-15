import api from "../../api/axios";

export const getAllWorkLogs = async (
    search,
    page,
    limit,
    sort,
    workDate
) => {
    const res = await api.get('/admin/work-logs', {
        params: {
            search,
            page,
            limit,
            sort,
            workDate
        }
    });

    return res;
};


export const downloadWorkLogs = async (
    search,
    sort,
    workDate
) => {

    const blob = await api.get(
        '/admin/work-logs/download',
        {
            params: {
                search: search || '',
                sort: sort || 'newest',
                workDate: workDate || ''
            },
            responseType: 'blob'
        }
    );

    console.log('Excel blob:', blob);
    console.log('Blob size:', blob?.size);
    console.log('Blob type:', blob?.type);

    if (!(blob instanceof Blob)) {
        throw new Error('Invalid Excel response');
    }

    if (blob.size === 0) {
        throw new Error('Empty Excel file received');
    }

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.download = workDate
        ? `work_logs_report_${workDate}.xlsx`
        : 'work_logs_report.xlsx';

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
};