import { useState } from "react";
import './bottomBar.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield } from "@fortawesome/free-solid-svg-icons";

export default function BottomBar() {
    return (
        <div className="bottomBar">
            <div className="bottomBar-content">
                <p><FontAwesomeIcon icon={faShield} /></p>
                <p>Secured & Confidential</p>
            </div>
            <div className="bottomBar-content">
                <p>Every Minute Counts,</p>
                <p>Every Entry Matters</p>
            </div>
            <div className="bottomBar-content">
                <p>@ 2026 All rights reserved</p>
            </div>
        </div>
    )
}