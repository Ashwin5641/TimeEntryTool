CREATE DATABASE hhvtt_timetrack;

CREATE TABLE departments (
	id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(255) UNIQUE NOT NULL,
    department_code VARCHAR(100) UNIQUE,
    status ENUM('Active','Inactive') DEFAULT 'Active' ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE employees (
	id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(255) UNIQUE NOT NULL,
    employee_name VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    designation VARCHAR(100) NOT NULL,
    status ENUM('Active','Inactive') DEFAULT 'Active',
    role ENUM('Supervisor', 'Employee') DEFAULT 'Employee'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE projects (
	id INT AUTO_INCREMENT PRIMARY KEY,
    project_code VARCHAR(20) NOT NULL UNIQUE,
    project_name VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    description VARCHAR(500) NULL,
    status ENUM('Active', 'Completed') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

CREATE TABLE activities (
	id INT AUTO_INCREMENT PRIMARY KEY,
    activity_name VARCHAR(255) UNIQUE NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
   	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

CREATE TABLE department_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    activity_id INT NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    UNIQUE(department_id, activity_id),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (activity_id) REFERENCES activities(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

CREATE TABLE sub_activities (
	id INT AUTO_INCREMENT PRIMARY KEY,
    department_activity_id INT NOT NULL,
    sub_activity_name VARCHAR(255) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(department_activity_id, sub_activity_name),
    FOREIGN KEY (department_activity_id)
        REFERENCES department_activities(id)
        ON DELETE RESTRICT
)

CREATE TABLE work_logs (
	id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    entered_by_employee_id INT NOT NULL,
    department_id INT NOT NULL,
    project_id INT NULL,
    activity_id INT NOT NULL,
    sub_activity_id INT NOT NULL,
    department_work_type_id INT NOT NULL,
    work_date DATE DEFAULT CURRENT_DATE,
    duration_minutes SMALLINT UNSIGNED NOT NULL,
    remarks TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE RESTRICT,
    FOREIGN KEY (entered_by_employee_id) REFERENCES employees(id) ON DELETE RESTRICT,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE RESTRICT,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE RESTRICT,
    FOREIGN KEY (sub_activity_id) REFERENCES sub_activities(id) ON DELETE RESTRICT,
    FOREIGN KEY (work_type_id) REFERENCES work_types(id) ON DELETE RESTRICT
)

CREATE TABLE work_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    work_type_name VARCHAR(255) UNIQUE NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE department_work_types (
	id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    work_type_id INT NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(department_id, work_type_id),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    FOREIGN KEY (work_type_id) REFERENCES work_types(id) ON DELETE RESTRICT
)