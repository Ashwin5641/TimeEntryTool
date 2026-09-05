const projectsModel = require('../../models/admin/projectsModel');

// for projects of admin dashboard

exports.getAllprojects = async (req, res) => {
    const {
        search = '',
        page = 1,
        limit = 10,
        sort = 'newest'
    } = req.query;

    try {
        const projects = await projectsModel.getAllProjects(search, Number(page), Number(limit), sort);
        
        return res.status(200).json({
            success: true,
            data: projects.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(projects.total / limit),
                totalRecords: projects.total
            }
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

exports.createProject = async (req, res) => {
    const {project_code, project_name, customer_name, description, status} = req.body;

    if (!project_code || !project_name || !customer_name || !status) {
        return res.status(400).json({
            success: false,
            message: 'Fill all the required fields'
        })
    }

    try {
        const existing = await projectsModel.checkProjectCode(project_name);

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Project name already exists!'
            })
        }

        await projectsModel.createProject(project_code, project_name, customer_name, description, status);

        return res.status(201).json({
            success: true,
            message: 'Project added successfully!'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

exports.updateProject = async (req, res) => {
    const {id} = req.params;
    const {
        project_code, 
        project_name, 
        customer_name, 
        description, 
        status
    } = req.body;

    if (!project_code || !project_name || !customer_name || !status) {
        return res.status(400).json({
            success: false,
            message: 'Fill all the required fields'
        })
    }

    try {
        const existing = await projectsModel.checkProject_codeById(id, project_name);

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Project name already exists!'
            })
        }

        await projectsModel.updateProject(id, project_code, project_name, customer_name, description, status);

        return res.status(200).json({
            success: true,
            message: 'Project updated successfully!'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        })
    }
}

// ----------------------------END-----------------------------

// for employee fill details of employee panel

exports.getPrjctIdAndNameActSts = async (req, res) => {
    try {
        const result = await projectsModel.getPrjctIdAndNameActSts();

        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Please try again later'
        })
    }
} 