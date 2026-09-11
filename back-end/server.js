const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: [
        'http://localhost:5173',
        'http://172.21.4.36:5173'
    ],
}))

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

// for the authentication

app.use('/auth', require('./routes/authentication/authRoutes'));

// for the admin dashboard

app.use('/admin/departments', require('./routes/admin/departmentsRoutes'));

app.use('/admin/employees', require('./routes/admin/employeesRoutes'));

app.use('/admin/projects', require('./routes/admin/projectsRoutes'));

app.use('/admin/activities', require('./routes/admin/activtiesRoutes'));

app.use('/admin/department-activities', require('./routes/admin/dprtmntActivitiesRoutes'));

app.use('/admin/sub-activities', require('./routes/admin/subActivitiesRoutes'));

app.use('/admin/work-type', require('./routes/admin/workTypeRoutes'));

app.use('/admin/department-work-types', require('./routes/admin/dprtmntWrkTypRoutes'));

app.use('/admin/work-logs', require('./routes/admin/worklogsRoutes'));

app.use('/admin/dashboard', require('./routes/admin/dashboardRoutes'));


// for the employees panel

app.use('/employee-fillDetails', require('./routes/employee/empFillDetailsRoutes'));

app.listen(port, "0.0.0.0", () => {
    console.log(`server is running at http://localhost:${port}`)
})