import { useState } from "react";
import './topbar.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";

export default function Topbar() {
    return (
        <div className="employee-topbar">
            <div className="employee-topbar-logo">
                <img src="/src/assets/logo.png" alt="" />
            </div>
            <div className="employee-topbar-title">
                <h3>HHV Thermal Technologies Pvt. Ltd.</h3>
                <p>Time Entry Tool</p>
            </div>
            <div className="employee-topbar-dateTime">
                <div className="employee-topbar-date-time">
                    <div className="employee-topbar-date">
                        <span><FontAwesomeIcon icon={faCalendar} /></span>
                        <span>{new Date().toLocaleDateString("en-IN")}</span>
                    </div>
                    <span>|</span>
                    <div className="employee-topbar-time">
                        <span><FontAwesomeIcon icon={faClock} /></span>
                        <span>{new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit"})}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}