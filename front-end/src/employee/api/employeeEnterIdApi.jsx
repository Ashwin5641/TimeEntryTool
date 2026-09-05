import api from "../../api/axios";

export const getSupervisorDetails = async (supervisor_id) => {
    const res = await api.get(`/admin/employees/employeeEnterId/${supervisor_id}`);
    return res;
}