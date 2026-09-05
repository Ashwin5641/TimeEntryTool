import api from "../../api/axios";

export const getDprtmntNameAndIdStsAct = async () => {
    const res = await api.get('/admin/departments/options/employee-fillDetails');
    return res;
}

export const getPrjctIdAndNameActSts = async () => {
    const res = await api.get('/admin/projects/options/employee-fillDetails');
    return res;
}

export const getActivityFromDprtAct = async (department_id) => {
    const res = await api.get(
        '/admin/department-activities/options/employee-fillDetails',
        {
            params: {
                department_id
            }
        }
    );

    return res;
}

export const getSubActivityNameAndIdActSts = async (department_id, activity_id) => {
    const res = await api.get(
        '/admin/sub-activities/options/employee-fillDetails',
        {
            params: {
                department_id,
                activity_id
            }
        }
    );

    return res;
}

export const getWorkTypeFromDprt = async (department_id) => {
    const res = await api.get(
        '/admin/department-work-types/options/employee-fillDetails',
        {
            params: {
                department_id: Number(department_id)
            }
        }
    );

    return res;
};


// Get active non-supervisor employees

export const getNonSupervisorEmployees = async () => {
    const res = await api.get(
        '/admin/employees/employeeEnterId/non-supervisors'
    );

    return res;
}


export const createWorkLog = async (workLog) => {
    const res = await api.post('/employee-fillDetails', workLog);
    return res;
}

export const getTodayWorkSummary = async (employee_id) => {
    const res = await api.get(`/admin/work-logs/employee-fillDetails/today-summary/${employee_id}`);
    return res
};