const dashboardModel = require('../../models/admin/dashboardModel');

exports.getKpi = async (req, res) => {
    try {
        const result = await dashboardModel.getkpi();
        
        const hourlyData = await dashboardModel.getHourlyWorkLogs();

        const totalEmployees = await dashboardModel.getTotalEmployees();

        const totalActiveProjects = await dashboardModel.getTotalActiveProjects();

        const workEfficiencyComparison = await dashboardModel.getWorkEfficiencyComparison();

        const departmentProductivity = await dashboardModel.getDepartmentProductivity();

        const projectWiseHours = await dashboardModel.getProjectWiseHours();

        return res.status(200).json({
            success: true,
            data: {
                active_employees: result.active_employees,
                total_entries: result.total_entries,
                total_minutes: result.total_minutes,
                value_added_minutes: result.value_added_minutes,
                value_added_percentage: result.value_added_percentage,
                non_value_added_minutes: result.non_value_added_minutes,
                non_value_added_percentage: result.non_value_added_percentage,
                other_minutes: result.other_minutes,
                other_percentage: result.other_percentage,
                total_active_projects: totalActiveProjects,

                hourly_data: hourlyData,

                total_employees: totalEmployees,

                getWorkEfficiencyComparison: workEfficiencyComparison,

                department_productivity: departmentProductivity,

                project_wise_hours: projectWiseHours
            }
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}