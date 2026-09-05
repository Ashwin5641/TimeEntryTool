import { Outlet } from "react-router-dom";
import './employeeLayout.css'

import Topbar from "../components/topbar/Topbar";
import BottomBar from "../components/bottomBar/BottomBar";

export default function EmployeeLayout() {
    return (
        <div className="employee-layout">
            <Topbar />
            <div className="employee-content">
                <Outlet />
            </div>
            <BottomBar />
        </div>
    )
}