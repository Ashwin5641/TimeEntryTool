import { useEffect, useRef, useState } from "react";
import "./empFillDetails.css";

import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faClockFour,
    faMessage,
    faUser,
    faCalendarDays,
    faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";

import { getSupervisorDetails } from "../../api/employeeEnterIdApi";

import {
    getNonSupervisorEmployees,
    createWorkLog,
    getActivityFromDprtAct,
    getDprtmntNameAndIdStsAct,
    getPrjctIdAndNameActSts,
    getSubActivityNameAndIdActSts,
    getWorkTypeFromDprt,
    getTodayWorkSummary
} from "../../api/empFillDetailsApi";


export default function EmpFillDetails() {

    const navigate = useNavigate();
    const { employee_id: supervisorId } = useParams();

    // =======================================================
    // Request / timer refs
    // =======================================================

    const submitTimeoutRef = useRef(null);
    const countdownIntervalRef = useRef(null);
    const summaryRequestRef = useRef(0);
    const supervisorRequestRef = useRef(0);

    // =======================================================
    // UI state
    // =======================================================

    const [showAfterSubmit, setShowAfterSubmit] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [loadingEmployeeDetails, setLoadingEmployeeDetails] = useState(true);
    const [loadingActivities, setLoadingActivities] = useState(false);
    const [loadingSubActivities, setLoadingSubActivities] = useState(false);
    const [loadingWorkTypes, setLoadingWorkTypes] = useState(false);
    const [loadingSummary, setLoadingSummary] = useState(false);

    // =======================================================
    // Supervisor
    // =======================================================

    const [supervisorDetails, setSupervisorDetails] = useState(null);

    // =======================================================
    // Selected employee
    // =======================================================

    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [employees, setEmployees] = useState([]);

    // =======================================================
    // Form
    // =======================================================

    const [form, setForm] = useState({
        employee_id: "",
        department_id: "",
        project_id: "",
        activity_id: "",
        sub_activity_id: "",
        department_work_type_id: "",
        hours: "",
        minutes: "",
        remarks: ""
    });

    // =======================================================
    // Today's summary
    // =======================================================

    const [todaySummary, setTodaySummary] = useState({
        totalLogs: 0,
        totalMinutes: 0,
        remainingMinutes: 480
    });

    // =======================================================
    // Dropdown data
    // =======================================================

    const [departments, setDepartments] = useState([]);
    const [projects, setProjects] = useState([]);
    const [activities, setActivities] = useState([]);
    const [subActivities, setSubActivities] = useState([]);
    const [workTypes, setWorkTypes] = useState([]);

    // =======================================================
    // Current target employee
    // =======================================================

    const targetEmployee =
        employeeDetails || supervisorDetails;

    // =======================================================
    // API response helper
    // =======================================================

    const getApiData = (response, fallback = []) => {

        if (response == null) {
            return fallback;
        }

        if (Array.isArray(response)) {
            return response;
        }

        const data = response?.data;

        if (data == null) {
            return fallback;
        }

        if (Array.isArray(data)) {
            return data;
        }

        if (
            data?.data !== undefined &&
            data?.data !== null
        ) {
            return Array.isArray(data.data)
                ? data.data
                : data.data;
        }

        if (
            typeof data === "object" &&
            !Array.isArray(data)
        ) {
            return data;
        }

        return fallback;
    };

    // =======================================================
    // Timer cleanup
    // =======================================================

    const clearSubmitTimers = () => {

        if (submitTimeoutRef.current) {
            clearTimeout(submitTimeoutRef.current);
            submitTimeoutRef.current = null;
        }

        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
    };

    // =======================================================
    // Reset work-log fields
    // =======================================================

    const resetWorkLogFields = () => {

        setForm(prev => ({
            ...prev,
            project_id: "",
            activity_id: "",
            sub_activity_id: "",
            department_work_type_id: "",
            hours: "",
            minutes: "",
            remarks: ""
        }));

        setSubActivities([]);
        setLoadingSubActivities(false);
    };

    // =======================================================
    // Initial loading
    // =======================================================

    useEffect(() => {

        fetchSupervisorDetails();
        fetchNonSupervisorEmployees();
        fetchAllDepartments();
        fetchAllProjects();

        return () => {

            clearSubmitTimers();

            supervisorRequestRef.current += 1;
            summaryRequestRef.current += 1;
        };

    }, [supervisorId]);

    // =======================================================
    // Fetch supervisor
    // =======================================================

    const fetchSupervisorDetails = async () => {

        const requestId =
            ++supervisorRequestRef.current;

        if (!supervisorId) {

            setSupervisorDetails(null);
            setMessage("Supervisor ID is missing.");
            setLoadingEmployeeDetails(false);

            return;
        }

        try {

            setLoadingEmployeeDetails(true);

            const res =
                await getSupervisorDetails(supervisorId);

            if (
                requestId !==
                supervisorRequestRef.current
            ) {
                return;
            }

            const supervisor =
                getApiData(res, null);

            if (!supervisor) {

                setSupervisorDetails(null);
                setMessage(
                    "Supervisor details could not be found."
                );

                return;
            }

            setSupervisorDetails(supervisor);
            setEmployeeDetails(null);

            const supervisorDepartmentId =
                Number(supervisor.department_id);

            setForm(prev => ({
                ...prev,

                employee_id: "",

                department_id:
                    Number.isFinite(
                        supervisorDepartmentId
                    ) &&
                    supervisorDepartmentId > 0
                        ? supervisorDepartmentId
                        : ""
            }));

        } catch (err) {

            if (
                requestId !==
                supervisorRequestRef.current
            ) {
                return;
            }

            console.error(
                "Failed to fetch supervisor details:",
                err
            );

            setSupervisorDetails(null);

            setMessage(
                err?.response?.data?.message ||
                "Unable to find supervisor details."
            );

        } finally {

            if (
                requestId ===
                supervisorRequestRef.current
            ) {
                setLoadingEmployeeDetails(false);
            }
        }
    };

    // =======================================================
    // Fetch active non-supervisor employees
    // =======================================================

    const fetchNonSupervisorEmployees = async () => {

        try {

            setLoadingEmployees(true);

            const res =
                await getNonSupervisorEmployees();

            const employeeList =
                getApiData(res, []);

            setEmployees(
                Array.isArray(employeeList)
                    ? employeeList
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to fetch non-supervisor employees:",
                err
            );

            setEmployees([]);

            setMessage(
                err?.response?.data?.message ||
                "Unable to load employees."
            );

        } finally {

            setLoadingEmployees(false);
        }
    };

    // =======================================================
    // Fetch departments
    // =======================================================

    const fetchAllDepartments = async () => {

        try {

            const res =
                await getDprtmntNameAndIdStsAct();

            const departmentList =
                getApiData(res, []);

            setDepartments(
                Array.isArray(departmentList)
                    ? departmentList
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to fetch departments:",
                err
            );

            setDepartments([]);
        }
    };

    // =======================================================
    // Fetch projects
    // =======================================================

    const fetchAllProjects = async () => {

        try {

            const res =
                await getPrjctIdAndNameActSts();

            const projectList =
                getApiData(res, []);

            setProjects(
                Array.isArray(projectList)
                    ? projectList
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to fetch projects:",
                err
            );

            setProjects([]);
        }
    };

    // =======================================================
    // Fetch activities + work types when department changes
    // =======================================================

    useEffect(() => {

        const departmentId =
            Number(form.department_id);

        setActivities([]);
        setSubActivities([]);
        setWorkTypes([]);

        setLoadingActivities(false);
        setLoadingSubActivities(false);
        setLoadingWorkTypes(false);

        setForm(prev => ({
            ...prev,

            activity_id: "",
            sub_activity_id: "",
            department_work_type_id: ""
        }));

        if (
            !Number.isFinite(departmentId) ||
            departmentId <= 0
        ) {
            return;
        }

        let cancelled = false;

        const loadDepartmentData = async () => {

            setLoadingActivities(true);
            setLoadingWorkTypes(true);

            try {

                const [
                    activityResponse,
                    workTypeResponse
                ] = await Promise.all([
                    getActivityFromDprtAct(
                        departmentId
                    ),
                    getWorkTypeFromDprt(
                        departmentId
                    )
                ]);

                if (cancelled) {
                    return;
                }

                const activityList =
                    getApiData(
                        activityResponse,
                        []
                    );

                const workTypeList =
                    getApiData(
                        workTypeResponse,
                        []
                    );

                setActivities(
                    Array.isArray(activityList)
                        ? activityList
                        : []
                );

                setWorkTypes(
                    Array.isArray(workTypeList)
                        ? workTypeList
                        : []
                );

            } catch (err) {

                if (cancelled) {
                    return;
                }

                console.error(
                    "Failed to fetch department dependent data:",
                    err
                );

                setActivities([]);
                setWorkTypes([]);

                setMessage(
                    err?.response?.data?.message ||
                    "Unable to load activities or work types."
                );

            } finally {

                if (!cancelled) {

                    setLoadingActivities(false);
                    setLoadingWorkTypes(false);
                }
            }
        };

        loadDepartmentData();

        return () => {
            cancelled = true;
        };

    }, [form.department_id]);

    // =======================================================
    // Fetch sub activities when activity changes
    // =======================================================

    useEffect(() => {

        const departmentId =
            Number(form.department_id);

        const activityId =
            Number(form.activity_id);

        setSubActivities([]);
        setLoadingSubActivities(false);

        if (
            !Number.isFinite(departmentId) ||
            departmentId <= 0 ||
            !Number.isFinite(activityId) ||
            activityId <= 0
        ) {
            return;
        }

        let cancelled = false;

        const loadSubActivities = async () => {

            try {

                setLoadingSubActivities(true);

                const res =
                    await getSubActivityNameAndIdActSts(
                        departmentId,
                        activityId
                    );

                if (cancelled) {
                    return;
                }

                const subActivityList =
                    getApiData(res, []);

                setSubActivities(
                    Array.isArray(subActivityList)
                        ? subActivityList
                        : []
                );

            } catch (err) {

                if (cancelled) {
                    return;
                }

                console.error(
                    "Failed to fetch sub activities:",
                    err
                );

                setSubActivities([]);

                setMessage(
                    err?.response?.data?.message ||
                    "Unable to load sub activities."
                );

            } finally {

                if (!cancelled) {
                    setLoadingSubActivities(false);
                }
            }
        };

        loadSubActivities();

        return () => {
            cancelled = true;
        };

    }, [
        form.department_id,
        form.activity_id
    ]);

    // =======================================================
    // Employee dropdown options
    // =======================================================

    const employeeOptions = [
        ...(supervisorDetails
            ? [{
                value: Number(supervisorDetails.id),

                label:
                    `${supervisorDetails.employee_id} - ${supervisorDetails.employee_name} (You)`,

                employee: supervisorDetails,

                isSupervisor: true
            }]
            : []),

        ...employees
            .filter(employee =>
                employee?.id &&
                Number(employee.id) !==
                Number(supervisorDetails?.id)
            )
            .map(employee => ({
                value: Number(employee.id),

                label:
                    `${employee.employee_id} - ${employee.employee_name}`,

                employee,

                isSupervisor: false
            }))
    ];

    // =======================================================
    // Department options
    // =======================================================

    const departmentOptions =
        departments
            .filter(department =>
                department?.id !== undefined &&
                department?.id !== null
            )
            .map(department => ({
                value: Number(department.id),
                label: department.department_name
            }))
            .filter(option =>
                Number.isFinite(option.value)
            );

    // =======================================================
    // Project options
    // =======================================================

    const projectOptions =
        projects
            .filter(project =>
                project?.id !== undefined &&
                project?.id !== null
            )
            .map(project => ({
                value: Number(project.id),

                label: project.project_name
                    ? `${project.project_name}${
                        project.customer_name
                            ? ` / ${project.customer_name}`
                            : ""
                    }`
                    : ""
            }))
            .filter(option =>
                Number.isFinite(option.value)
            );

    // =======================================================
    // Activity options
    // =======================================================

    const activityOptions =
        activities
            .map(activity => {

                const id =
                    activity?.id ??
                    activity?.activity_id;

                return {
                    value: Number(id),
                    label: activity?.activity_name || ""
                };
            })
            .filter(option =>
                Number.isFinite(option.value) &&
                option.value > 0
            );

    // =======================================================
    // Sub activity options
    // =======================================================

    const subActivityOptions =
        subActivities
            .filter(subActivity =>
                subActivity?.id !== undefined &&
                subActivity?.id !== null
            )
            .map(subActivity => ({
                value: Number(subActivity.id),

                label:
                    subActivity.sub_activity_name || ""
            }))
            .filter(option =>
                Number.isFinite(option.value) &&
                option.value > 0
            );

    // =======================================================
    // Work type options
    // =======================================================

    const workTypeOptions =
        workTypes
            .filter(workType =>
                workType?.id !== undefined &&
                workType?.id !== null
            )
            .map(workType => ({
                value: Number(workType.id),

                label:
                    workType.work_type_name || ""
            }))
            .filter(option =>
                Number.isFinite(option.value) &&
                option.value > 0
            );

    // =======================================================
    // Selected employee option
    // =======================================================

    const selectedEmployeeOption =
        employeeDetails

            ? employeeOptions.find(
                option =>
                    option.value ===
                    Number(employeeDetails.id)
            ) || null

            : supervisorDetails

                ? employeeOptions.find(
                    option =>
                        option.isSupervisor
                ) || null

                : null;

    // =======================================================
    // Select supervisor / My work log
    // =======================================================

    const selectSupervisor = () => {

        const supervisorDepartmentId =
            Number(
                supervisorDetails?.department_id
            );

        setMessage("");
        setEmployeeDetails(null);

        setForm(prev => ({
            ...prev,

            employee_id: "",

            department_id:
                Number.isFinite(
                    supervisorDepartmentId
                ) &&
                supervisorDepartmentId > 0
                    ? supervisorDepartmentId
                    : "",

            project_id: "",
            activity_id: "",
            sub_activity_id: "",
            department_work_type_id: "",
            hours: "",
            minutes: "",
            remarks: ""
        }));

        setSubActivities([]);
    };

    // =======================================================
    // Employee selection from dropdown
    // =======================================================

    const handleEmployeeChange = selected => {

        setMessage("");

        if (!selected || selected.isSupervisor) {

            selectSupervisor();

            return;
        }

        const employee =
            selected.employee;

        if (!employee?.id) {

            setMessage(
                "Unable to determine the selected employee."
            );

            return;
        }

        const employeeDepartmentId =
            Number(employee.department_id);

        setEmployeeDetails(employee);

        setForm(prev => ({
            ...prev,

            employee_id:
                Number(employee.id),

            department_id:
                Number.isFinite(
                    employeeDepartmentId
                ) &&
                employeeDepartmentId > 0
                    ? employeeDepartmentId
                    : "",

            project_id: "",
            activity_id: "",
            sub_activity_id: "",
            department_work_type_id: "",
            hours: "",
            minutes: "",
            remarks: ""
        }));

        setSubActivities([]);
    };

    // =======================================================
    // Today's summary
    // =======================================================

    useEffect(() => {

        const employeeId =
            targetEmployee?.id;

        if (!employeeId) {

            setTodaySummary({
                totalLogs: 0,
                totalMinutes: 0,
                remainingMinutes: 480
            });

            setLoadingSummary(false);

            return;
        }

        fetchTodaySummary(employeeId);

    }, [targetEmployee?.id]);

    // =======================================================
    // Fetch today's summary
    // =======================================================

    const fetchTodaySummary = async employeeId => {

        if (!employeeId) {
            return;
        }

        const requestId =
            ++summaryRequestRef.current;

        try {

            setLoadingSummary(true);

            const res =
                await getTodayWorkSummary(
                    employeeId
                );

            if (
                requestId !==
                summaryRequestRef.current
            ) {
                return;
            }

            const summary =
                getApiData(res, {});

            const totalLogs =
                Number(
                    summary?.totalLogs ??
                    summary?.total_logs ??
                    0
                );

            const totalMinutes =
                Number(
                    summary?.totalMinutes ??
                    summary?.total_minutes ??
                    0
                );

            const remainingMinutes =
                Number(
                    summary?.remainingMinutes ??
                    summary?.remaining_minutes ??
                    Math.max(
                        0,
                        480 - totalMinutes
                    )
                );

            setTodaySummary({

                totalLogs:
                    Number.isFinite(totalLogs)
                        ? totalLogs
                        : 0,

                totalMinutes:
                    Number.isFinite(totalMinutes)
                        ? Math.max(
                            0,
                            totalMinutes
                        )
                        : 0,

                remainingMinutes:
                    Number.isFinite(
                        remainingMinutes
                    )
                        ? Math.max(
                            0,
                            remainingMinutes
                        )
                        : Math.max(
                            0,
                            480 - totalMinutes
                        )
            });

        } catch (err) {

            if (
                requestId !==
                summaryRequestRef.current
            ) {
                return;
            }

            console.error(
                "Failed to fetch today's summary:",
                err
            );

        } finally {

            if (
                requestId ===
                summaryRequestRef.current
            ) {
                setLoadingSummary(false);
            }
        }
    };

    // =======================================================
    // Format minutes
    // =======================================================

    const formatMinutes = (
        totalMinutes = 0
    ) => {

        const safeMinutes =
            Math.max(
                0,
                Number(totalMinutes) || 0
            );

        const hours =
            Math.floor(
                safeMinutes / 60
            );

        const minutes =
            safeMinutes % 60;

        return `${hours}:${String(
            minutes
        ).padStart(2, "0")}`;
    };

    // =======================================================
    // Input change
    // =======================================================

    const handleChange = e => {

        setMessage("");

        const {
            name,
            value
        } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // =======================================================
    // Activity
    // =======================================================

    const selectedActivity =
        activities.find(
            activity =>
                Number(
                    activity?.id ??
                    activity?.activity_id
                ) ===
                Number(form.activity_id)
        );

    const isOtherActivity =
        selectedActivity
            ?.activity_name
            ?.trim()
            ?.toLowerCase() ===
        "other";

    const handleActivityChange = selected => {

        setMessage("");

        const selectedIsOther =
            selected?.label
                ?.trim()
                ?.toLowerCase() ===
            "other";

        setForm(prev => ({
            ...prev,

            activity_id:
                selected?.value || "",

            sub_activity_id: "",

            project_id:
                selectedIsOther
                    ? ""
                    : prev.project_id
        }));

        setSubActivities([]);
        setLoadingSubActivities(false);
    };

    // =======================================================
    // Add another
    // =======================================================

    const handleAddAnother = () => {

        clearSubmitTimers();

        resetWorkLogFields();

        setMessage("");
        setCountdown(10);
        setShowAfterSubmit(false);
    };

    // =======================================================
    // Back home
    // =======================================================

    const handleBackHome = () => {

        clearSubmitTimers();

        navigate("/", {
            replace: true
        });
    };

    // =======================================================
    // Redirect countdown
    // =======================================================

    const startRedirectCountdown = () => {

        clearSubmitTimers();

        setCountdown(10);

        let seconds = 10;

        countdownIntervalRef.current =
            setInterval(() => {

                seconds -= 1;

                setCountdown(
                    Math.max(seconds, 0)
                );

                if (seconds <= 0) {

                    clearInterval(
                        countdownIntervalRef.current
                    );

                    countdownIntervalRef.current =
                        null;
                }

            }, 1000);

        submitTimeoutRef.current =
            setTimeout(() => {

                navigate("/", {
                    replace: true
                });

            }, 10000);
    };

    // =======================================================
    // Submit
    // =======================================================

    const handleSubmit = async e => {

        e.preventDefault();

        if (loading) {
            return;
        }

        setMessage("");

        const selectedEmployee =
            targetEmployee;

        if (!selectedEmployee?.id) {

            setMessage(
                "Unable to determine the employee record."
            );

            return;
        }

        const departmentId =
            Number(
                form.department_id ||
                selectedEmployee.department_id
            );

        if (
            !Number.isFinite(departmentId) ||
            departmentId <= 0
        ) {

            setMessage(
                "Unable to determine the department."
            );

            return;
        }

        const activityId =
            Number(form.activity_id);

        if (
            !Number.isFinite(activityId) ||
            activityId <= 0
        ) {

            setMessage(
                "Please select an activity."
            );

            return;
        }

        const subActivityId =
            Number(form.sub_activity_id);

        if (
            !Number.isFinite(subActivityId) ||
            subActivityId <= 0
        ) {

            setMessage(
                "Please select a sub-activity."
            );

            return;
        }

        const workTypeId =
            Number(
                form.department_work_type_id
            );

        if (
            !Number.isFinite(workTypeId) ||
            workTypeId <= 0
        ) {

            setMessage(
                "Please select a work type."
            );

            return;
        }

        const hoursValue =
            form.hours === ""
                ? 0
                : Number(form.hours);

        const minutesValue =
            form.minutes === ""
                ? 0
                : Number(form.minutes);

        if (
            form.hours === "" &&
            form.minutes === ""
        ) {

            setMessage(
                "Please enter the time spent."
            );

            return;
        }

        if (
            !Number.isInteger(hoursValue) ||
            hoursValue < 0 ||
            hoursValue > 24
        ) {

            setMessage(
                "Hours must be a whole number between 0 and 24."
            );

            return;
        }

        if (
            !Number.isInteger(minutesValue) ||
            minutesValue < 0 ||
            minutesValue > 59
        ) {

            setMessage(
                "Minutes must be a whole number between 0 and 59."
            );

            return;
        }

        if (
            hoursValue === 24 &&
            minutesValue > 0
        ) {

            setMessage(
                "For 24 hours, minutes must be 0."
            );

            return;
        }

        const totalMinutes =
            hoursValue * 60 +
            minutesValue;

        if (totalMinutes <= 0) {

            setMessage(
                "Time spent must be greater than zero."
            );

            return;
        }

        const remainingMinutes =
            Math.max(
                0,
                Number(
                    todaySummary.remainingMinutes
                ) || 0
            );

        if (
            totalMinutes >
            remainingMinutes
        ) {

            setMessage(
                `You can only log ${formatMinutes(
                    remainingMinutes
                )} more hours today.`
            );

            return;
        }

        const projectId =
            isOtherActivity
                ? null
                : (
                    form.project_id
                        ? Number(
                            form.project_id
                        )
                        : null
                );

        const workLog = {

            employee_id:
                Number(selectedEmployee.id),

            entered_by_employee_id:
                Number(supervisorDetails.id),

            department_id:
                departmentId,

            project_id:
                projectId,

            activity_id:
                activityId,

            sub_activity_id:
                subActivityId,

            department_work_type_id:
                workTypeId,

            duration_minutes:
                totalMinutes,

            remarks:
                form.remarks?.trim() || null
        };

        try {

            setLoading(true);

            await createWorkLog(workLog);

            await fetchTodaySummary(
                selectedEmployee.id
            );

            setShowAfterSubmit(true);

            startRedirectCountdown();

        } catch (err) {

            console.error(
                "Failed to submit work log:",
                err
            );

            setMessage(
                err?.response?.data?.message ||
                "Failed to submit work log. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    // =======================================================
    // Loading supervisor
    // =======================================================

    if (loadingEmployeeDetails) {

        return (
            <div className="empFillDetails-page">

                <div className="empFillDetails-loading">
                    Loading supervisor details...
                </div>

            </div>
        );
    }

    // =======================================================
    // Supervisor not found
    // =======================================================

    if (!supervisorDetails) {

        return (
            <div className="empFillDetails-page">

                <div className="empFillDetails-error-msg">

                    <FontAwesomeIcon
                        icon={faTriangleExclamation}
                    />

                    <p>
                        {
                            message ||
                            "Supervisor details could not be found."
                        }
                    </p>

                </div>

                <button
                    type="button"
                    className="empFillDetails-back-btn"
                    onClick={handleBackHome}
                >
                    Back to Home
                </button>

            </div>
        );
    }

    // =======================================================
    // Render
    // =======================================================

    return (
        <div className="empFillDetails-page">

            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            <div className="empFillDetails-pge-success-msg">

                <FontAwesomeIcon
                    icon={faCircleCheck}
                />

                <span>
                    Supervisor verified successfully.
                    Select an employee to enter their work
                    log, or select your own name to enter
                    your own work log.
                </span>

            </div>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="empFillDetails-pge-details-and-form">

                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <aside className="empFillDetails-pge-details-and-summary">

                    {/* =================================================
                        WORK LOG CARD
                    ================================================= */}

                    <section className="empFillDetails-pge-work-log-card">

                        <div className="empFillDetails-section-title">

                            <span className="empFillDetails-section-icon">

                                <FontAwesomeIcon
                                    icon={faClockFour}
                                />

                            </span>

                            <span>
                                Work Log
                            </span>

                        </div>

                        <div className="empFillDetails-logging-box">

                            <p className="empFillDetails-logging-label">
                                Logging time for
                            </p>

                            <div className="empFillDetails-selected-employee">

                                <div className="empFillDetails-selected-avatar">

                                    <FontAwesomeIcon
                                        icon={faUser}
                                    />

                                </div>

                                <div className="empFillDetails-selected-details">

                                    <h4>
                                        {
                                            targetEmployee?.employee_name
                                        }
                                    </h4>

                                    <p>
                                        {
                                            targetEmployee?.employee_id
                                        }
                                    </p>

                                    <p>
                                        {
                                            `${targetEmployee?.designation || ""} - ${targetEmployee?.department_name || ""} Department`
                                        }
                                    </p>

                                </div>

                                {!employeeDetails && (

                                    <span className="empFillDetails-selected-badge">

                                        Selected

                                        <FontAwesomeIcon
                                            icon={faCircleCheck}
                                        />

                                    </span>

                                )}

                            </div>

                        </div>

                        {/* =================================================
                            TODAY SUMMARY
                        ================================================= */}

                        <div className="empFillDetails-summary-title">

                            <span className="empFillDetails-summary-title-icon">

                                <FontAwesomeIcon
                                    icon={faCalendarDays}
                                />

                            </span>

                            <span>
                                Today's Summary
                            </span>

                        </div>

                        <div className="empFillDetails-summary-cards">

                            <div className="empFillDetails-summary-card">

                                <span className="empFillDetails-summary-label">
                                    Logged
                                </span>

                                <strong className="empFillDetails-summary-value summary-blue">

                                    {
                                        loadingSummary
                                            ? "..."
                                            : todaySummary.totalLogs
                                    }

                                </strong>

                                <span className="empFillDetails-summary-unit">
                                    entries
                                </span>

                            </div>

                            <div className="empFillDetails-summary-card">

                                <span className="empFillDetails-summary-label">
                                    Time Logged
                                </span>

                                <strong className="empFillDetails-summary-value summary-red">

                                    {
                                        loadingSummary
                                            ? "..."
                                            : formatMinutes(
                                                todaySummary.totalMinutes
                                            )
                                    }

                                </strong>

                                <span className="empFillDetails-summary-unit">
                                    hours
                                </span>

                            </div>

                            <div className="empFillDetails-summary-card">

                                <span className="empFillDetails-summary-label">
                                    Remaining
                                </span>

                                <strong className="empFillDetails-summary-value summary-green">

                                    {
                                        loadingSummary
                                            ? "..."
                                            : formatMinutes(
                                                todaySummary.remainingMinutes
                                            )
                                    }

                                </strong>

                                <span className="empFillDetails-summary-unit">
                                    hours
                                </span>

                            </div>

                        </div>

                        {/* =================================================
                            MY WORK LOG
                        ================================================= */}

                        <button
                            type="button"
                            className="empFillDetails-my-log-btn"
                            onClick={
                                selectSupervisor
                            }
                        >

                            <FontAwesomeIcon
                                icon={faUser}
                            />

                            <span>
                                My work log
                            </span>

                        </button>

                        {/* =================================================
                            INFO
                        ================================================= */}

                        <div className="empFillDetails-time-note">

                            <FontAwesomeIcon
                                icon={faMessage}
                            />

                            <span>
                                All times are in HH:MM format.
                            </span>

                        </div>

                    </section>

                </aside>

                {/* =================================================
                    FORM
                ================================================= */}

                <main className="empFillDetails-pge-form">

                    <form onSubmit={handleSubmit}>

                        {/* =================================================
                            FORM TITLE
                        ================================================= */}

                        <div className="empFillDetails-form-title">

                            <span className="empFillDetails-form-title-icon">

                                <FontAwesomeIcon
                                    icon={faCalendarDays}
                                />

                            </span>

                            <span>
                                Work Log Entry
                            </span>

                        </div>

                        {/* =================================================
                            EMPLOYEE + DEPARTMENT
                        ================================================= */}

                        <div className="empFillDetails-pge-form-parent">

                            <div className="empFillDetails-pge-form-grp">

                                <label>
                                    Employee Name
                                </label>

                                <Select
                                    classNamePrefix="empFillDetails-select"
                                    options={employeeOptions}
                                    value={selectedEmployeeOption}
                                    onChange={
                                        handleEmployeeChange
                                    }
                                    isLoading={
                                        loadingEmployees
                                    }
                                    isClearable
                                    placeholder={
                                        loadingEmployees
                                            ? "Loading employees..."
                                            : "Select employee"
                                    }
                                    noOptionsMessage={() =>
                                        "No active employees found"
                                    }
                                    maxMenuHeight={220}
                                />

                            </div>

                            <div className="empFillDetails-pge-form-grp">

                                <label>
                                    Department Name
                                </label>

                                <Select
                                    classNamePrefix="empFillDetails-select"
                                    options={
                                        departmentOptions
                                    }
                                    value={
                                        departmentOptions.find(
                                            option =>
                                                option.value ===
                                                Number(
                                                    form.department_id
                                                )
                                        ) || null
                                    }
                                    isDisabled
                                    placeholder="Department"
                                />

                            </div>

                        </div>

                        {/* =================================================
                            PROJECT
                        ================================================= */}

                        <div className="empFillDetails-pge-form-parent">

                            <div className="empFillDetails-pge-form-grp">

                                <label>
                                    Project Name
                                </label>

                                <Select
                                    classNamePrefix="empFillDetails-select"
                                    options={
                                        projectOptions
                                    }
                                    value={
                                        projectOptions.find(
                                            option =>
                                                option.value ===
                                                Number(
                                                    form.project_id
                                                )
                                        ) || null
                                    }
                                    onChange={
                                        selected => {

                                            setMessage("");

                                            setForm(
                                                prev => ({
                                                    ...prev,

                                                    project_id:
                                                        selected?.value ||
                                                        ""
                                                })
                                            );

                                        }
                                    }
                                    isDisabled={
                                        !targetEmployee ||
                                        isOtherActivity
                                    }
                                    isClearable
                                    placeholder={
                                        isOtherActivity
                                            ? "Not required for Other"
                                            : "Select project"
                                    }
                                    maxMenuHeight={220}
                                />

                            </div>

                        </div>

                        {/* =================================================
                            ACTIVITY + SUB ACTIVITY
                        ================================================= */}

                        <div className="empFillDetails-pge-form-parent">

                            <div className="empFillDetails-pge-form-grp">

                                <label>
                                    Activity
                                </label>

                                <Select
                                    classNamePrefix="empFillDetails-select"
                                    options={
                                        activityOptions
                                    }
                                    value={
                                        activityOptions.find(
                                            option =>
                                                option.value ===
                                                Number(
                                                    form.activity_id
                                                )
                                        ) || null
                                    }
                                    onChange={
                                        handleActivityChange
                                    }
                                    placeholder={
                                        loadingActivities
                                            ? "Loading activities..."
                                            : form.department_id
                                                ? "Select activity"
                                                : "Select department first"
                                    }
                                    isDisabled={
                                        !form.department_id ||
                                        loadingActivities
                                    }
                                    isLoading={
                                        loadingActivities
                                    }
                                    isClearable
                                    maxMenuHeight={220}
                                    noOptionsMessage={() =>
                                        loadingActivities
                                            ? "Loading activities..."
                                            : "No activities found for this department"
                                    }
                                />

                            </div>

                            <div className="empFillDetails-pge-form-grp">

                                <label>
                                    Sub Activity
                                </label>

                                <Select
                                    classNamePrefix="empFillDetails-select"
                                    options={
                                        subActivityOptions
                                    }
                                    value={
                                        subActivityOptions.find(
                                            option =>
                                                option.value ===
                                                Number(
                                                    form.sub_activity_id
                                                )
                                        ) || null
                                    }
                                    onChange={
                                        selected => {

                                            setMessage("");

                                            setForm(
                                                prev => ({
                                                    ...prev,

                                                    sub_activity_id:
                                                        selected?.value ||
                                                        ""
                                                })
                                            );

                                        }
                                    }
                                    placeholder={
                                        loadingSubActivities
                                            ? "Loading sub activities..."
                                            : form.activity_id
                                                ? "Select sub activity"
                                                : "Select activity first"
                                    }
                                    isDisabled={
                                        !form.activity_id ||
                                        loadingSubActivities
                                    }
                                    isLoading={
                                        loadingSubActivities
                                    }
                                    isClearable
                                    maxMenuHeight={220}
                                    noOptionsMessage={() =>
                                        loadingSubActivities
                                            ? "Loading sub activities..."
                                            : "No sub activities found"
                                    }
                                />

                            </div>

                        </div>

                        {/* =================================================
                            WORK TYPE
                        ================================================= */}

                        <div className="empFillDetails-pge-form-parent">

                            <div className="empFillDetails-pge-form-grp">

                                <label>
                                    Work Type
                                </label>

                                <Select
                                    classNamePrefix="empFillDetails-select"
                                    options={
                                        workTypeOptions
                                    }
                                    value={
                                        workTypeOptions.find(
                                            option =>
                                                option.value ===
                                                Number(
                                                    form.department_work_type_id
                                                )
                                        ) || null
                                    }
                                    onChange={
                                        selected => {

                                            setMessage("");

                                            setForm(
                                                prev => ({
                                                    ...prev,

                                                    department_work_type_id:
                                                        selected?.value ||
                                                        ""
                                                })
                                            );

                                        }
                                    }
                                    placeholder={
                                        loadingWorkTypes
                                            ? "Loading work types..."
                                            : form.department_id
                                                ? "Select work type"
                                                : "Select department first"
                                    }
                                    isDisabled={
                                        !form.department_id ||
                                        loadingWorkTypes
                                    }
                                    isLoading={
                                        loadingWorkTypes
                                    }
                                    isClearable
                                    maxMenuHeight={220}
                                    noOptionsMessage={() =>
                                        loadingWorkTypes
                                            ? "Loading work types..."
                                            : "No work types found for this department"
                                    }
                                />

                            </div>

                        </div>

                        {/* =================================================
                            TIME
                        ================================================= */}

                        <div className="empFillDetails-pge-form-time">

                            <p>
                                Time Spent
                            </p>

                            <div className="empFillDetails-pge-form-gparent">

                                <div className="empFillDetails-pge-form-grp">

                                    <label>
                                        Hours
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        max="24"
                                        step="1"
                                        name="hours"
                                        value={
                                            form.hours
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter hours"
                                    />

                                </div>

                                <div className="empFillDetails-pge-form-grp">

                                    <label>
                                        Minutes
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        max="59"
                                        step="1"
                                        name="minutes"
                                        value={
                                            form.minutes
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter minutes"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            REMARKS
                        ================================================= */}

                        <div className="empFillDetails-pge-form-remarks">

                            <label>
                                Remarks (optional)
                            </label>

                            <textarea
                                name="remarks"
                                value={
                                    form.remarks
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter remarks"
                            />

                        </div>

                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {message && (

                            <div className="empFillDetails-form-error">

                                <FontAwesomeIcon
                                    icon={
                                        faTriangleExclamation
                                    }
                                />

                                <span>
                                    {message}
                                </span>

                            </div>

                        )}

                        {/* =================================================
                            SUBMIT
                        ================================================= */}

                        {!showAfterSubmit && (

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    !targetEmployee ||
                                    loadingActivities ||
                                    loadingSubActivities ||
                                    loadingWorkTypes ||
                                    loadingSummary
                                }
                                className="empFillDetails-submit-btn"
                            >

                                {
                                    loading
                                        ? "Submitting..."
                                        : employeeDetails
                                            ? "Submit Employee Work Log"
                                            : "Submit My Work Log"
                                }

                            </button>

                        )}

                    </form>

                    {/* =================================================
                        SUCCESS POPUP
                    ================================================= */}

                    {showAfterSubmit && (

                        <div className="work-log-popup-overlay">

                            <div className="work-log-popup">

                                <div className="work-log-popup-icon">

                                    <FontAwesomeIcon
                                        icon={faCircleCheck}
                                    />

                                </div>

                                <h3>
                                    Work log submitted successfully!
                                </h3>

                                <p>
                                    The work log for{" "}
                                    <strong>
                                        {
                                            targetEmployee?.employee_name
                                        }
                                    </strong>{" "}
                                    has been saved successfully.
                                </p>

                                <div className="work-log-popup-actions">

                                    <button
                                        type="button"
                                        onClick={
                                            handleAddAnother
                                        }
                                    >
                                        Add Another
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleBackHome
                                        }
                                    >
                                        Back to Home
                                    </button>

                                </div>

                                <p className="work-log-popup-countdown">

                                    You will be redirected to
                                    home automatically in{" "}

                                    <span>
                                        {countdown}
                                    </span>{" "}

                                    seconds.

                                </p>

                            </div>

                        </div>

                    )}

                </main>

            </div>

        </div>
    );
}