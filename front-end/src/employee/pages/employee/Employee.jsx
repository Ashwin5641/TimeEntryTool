import { useState } from "react"
import './employee.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck, faClock, faFileLines, faIdBadge, faIdCard } from "@fortawesome/free-regular-svg-icons"
import { faArrowRight, faChevronRight, faQrcode, faUser } from "@fortawesome/free-solid-svg-icons"

import { getSupervisorDetails } from "../../api/employeeEnterIdApi"

import { useNavigate } from "react-router-dom"

export default function Employee() {

    const [form, setForm] = useState({
        supervisor_id: ''
    })

    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setMessage("");
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let supervisor_id = form.supervisor_id.trim();

        if (!supervisor_id) {
            setMessage("Please enter an employee ID.");
            return;
        }

        try {
            const res = await getSupervisorDetails(supervisor_id);
            navigate(`/employee-fillDetails/${res.data.employee_id}`)
        } catch (err) {
            console.error(err)
            setMessage(err.response?.data?.message)
        }
    }

    return (
        <div className="employee-page">
            <div className="employee-page-search-empID">
                <p>
                    <span><FontAwesomeIcon icon={faIdBadge} className="fa-idCard" /></span>
                    <span><FontAwesomeIcon icon={faQrcode} className="fa-qrCode" /></span>
                </p>
                <p>Enter or Scan Employee ID</p>
                <div className="employe-page-search-empId-instruct">
                    <p>Scan the QR code / Barcode on your ID Card</p>
                    <p>or enter your Employee ID and Press Enter</p>
                </div>
                <div className="employee-page-search-empID-input">
                    <span><FontAwesomeIcon icon={faUser} className="fa-inputUser" /></span>
                    <form onSubmit={handleSubmit}>
                        <input
                            name="supervisor_id"
                            value={form.supervisor_id}
                            onChange={handleChange}
                            type="text"
                            placeholder="Enter Employee Id" 
                         />
                         <button type="submit"><FontAwesomeIcon icon={faArrowRight} className="fa-rightArrow" /></button>
                    </form>
                </div>
                {
                    message && <p>{message}</p>
                }
                <div className="employee-page-or">
                    <div className="employee-page-or-left"></div>
                    <p>OR</p>
                    <div className="employee-page-or-right"></div>
                </div>
                <div className="employee-page-or-qr">
                    <p><FontAwesomeIcon icon={faQrcode} className="or-faqrCode" /></p>
                    <div className="employee-page-or-qr-instruct">
                        <p>Scan QR / Barcode</p>
                        <p>Hold you ID card under the scanner</p>
                    </div>
                </div>
            </div>
            <div className="employee-page-instructions">
                <p>How it works</p>
                <div className="employee-page-instructions-step">
                    <p>1</p>
                    <p><FontAwesomeIcon icon={faIdCard} /></p>
                    <div className="employee-page-instructions-step-content">
                        <p>Scan or Enter</p>
                        <p>Employeee ID</p>
                    </div>
                </div>
                <div className="employee-page-instructions-step-nvgte">
                    <p><FontAwesomeIcon icon={faChevronRight} /></p>
                </div>
                <div className="employee-page-instructions-step">
                    <p>2</p>
                    <p><FontAwesomeIcon icon={faFileLines} /></p>
                    <div className="employee-page-instructions-step-content">
                        <p>Fill work details</p>
                        <p>(Department, Project,</p>
                        <p>Activity, etc)</p>
                    </div>
                </div>
                <div className="employee-page-instructions-step-nvgte">
                    <p><FontAwesomeIcon icon={faChevronRight} /></p>
                </div>
                <div className="employee-page-instructions-step">
                    <p>3</p>
                    <p><FontAwesomeIcon icon={faClock} /></p>
                    <div className="employee-page-instructions-step-content">
                        <p>Enter Hours</p>
                        <p>and Minutes</p>
                    </div>
                </div>
                <div className="employee-page-instructions-step-nvgte">
                    <p><FontAwesomeIcon icon={faChevronRight} /></p>
                </div>
                <div className="employee-page-instructions-step">
                    <p>4</p>
                    <p><FontAwesomeIcon icon={faCircleCheck} /></p>
                    <div className="employee-page-instructions-step-content">
                        <p>Submit</p>
                        <p>Work Log</p>
                    </div>
                </div>
            </div>
        </div>
    )
}