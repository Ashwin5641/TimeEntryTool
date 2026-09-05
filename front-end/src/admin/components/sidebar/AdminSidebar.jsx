import { useState } from "react";
import { Link } from "react-router-dom";

import './adminSidebar.css'

const menus = [
    {
        title: 'Dashboard',
        path: '/admin'
    },
    {
        title: 'Master',
        children: [
            {
                title: 'Employees',
                path: '/admin/employees'
            },
            {
                title: 'Employees List',
                path: '/admin/employees-list'
            },
            {
                title: 'Departments',
                path: '/admin/departments'
            },
            {
                title: 'Projects',
                path: '/admin/projects'
            },
            {
                title: 'Activities',
                path: '/admin/activities'
            },
            {
                title: 'Department Activities',
                path: '/admin/department-activities'
            },
            {
                title: 'Sub Activities',
                path: '/admin/sub-activities'
            },
            {
                title: 'Work Type',
                path: '/admin/work-type'
            },
            {
                title: 'Department Work Type',
                path: '/admin/department-workTypes'
            }
        ]
    },
    {
        title: 'Work',
        children: [
            {
                title: 'Work Logs',
                path: '/admin/work-logs'
            },
        ]
    },
    {
        title: 'Reports',
        children: [
            {
                title: 'Employee Report',
                path: '/admin/employee-report'
            },
            {
                title: 'Project Report',
                path: '/admin/project-report'
            },
            {
                title: 'Daily Report',
                path: '/admin/daily-report'
            },
        ]
    },
    {
        title: 'Settings',
        path: '/admin/settings'
    },
    {
        title: 'Logout',
        path: '/admin/logout'
    }
]

export default function AdminSidebar() {

    const [menuOpen, setMenuOpen] = useState(null);

    return (
        <div className="admin-sidebar">
            <h4>Admin Panel</h4>

            <ul>
                {
                    menus.map((menu) => (
                        <li key={menu.title}>   
                            {menu.children ? (
                                <>
                                    <button 
                                        className="admin-sidebar-parent"
                                        onClick={() => 
                                            setMenuOpen(menuOpen === menu.title ? null : menu.title
                                        )}
                                    >
                                        {menu.title}
                                    </button>

                                    {menuOpen === menu.title && (
                                        <ul className="admin-sidebar-submenu">
                                            {menu.children.map((child) => (
                                                    <li key={child.title}>
                                                        <Link
                                                        to={child.path}
                                                        className="admin-sidebar-menu"
                                                    >
                                                        {child.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            ) : (
                                <Link
                                    to={menu.path}
                                    className="admin-sidebar-menu"
                                >
                                    {menu.title}
                                </Link>
                            )}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}