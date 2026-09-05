import { useEffect, useState } from "react";
import './admDashboard.css'

import { getKpi} from "../../api/admDashboardApi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faChartLine, 
    faFolderOpen, 
    faHourglass1, 
    faUsers, 
    faArrowUp, 
    faArrowDown, 
    faPause 
} from "@fortawesome/free-solid-svg-icons";
import { faClockFour } from "@fortawesome/free-regular-svg-icons";

import {
        AreaChart,
        Area,
        ResponsiveContainer,
        PieChart,
        Pie,
        Cell,
        Tooltip,
        Legend,
        BarChart,
        Bar,
        XAxis,
        YAxis,
        CartesianGrid,
        LabelList
} from "recharts";

export default function AdmDashboard() {

    const [totalHrsToday, setTotalHrsToday] = useState('');
    const [valueAddedPrcnt, setValueAddedPrcnt] = useState('');
    const [valueAddedHrs, setValueAddedHrs] = useState('');
    const [nonValAddPrcnt, setNonValAddPrcnt] = useState('');
    const [nonValueAddHrs, setNonValueAddHrs] = useState('');
    const [otherHoursPrcnt, setOtherHoursPrcnt] = useState('');
    const [otherHours, setOtherHours] = useState('');
    const [loggedEmpees, setLoggedEmpees] = useState('');
    const [totalEmpees, setTotalEmpees] = useState('');
    const [totActivePrjts, setTotActivePrjts] = useState('');

    const [hourlyData, setHourlyData] = useState([]);
    const [workEfficiencyComparison, setWorkEfficiencyComparison] = useState([]);
    const [dprtmntPrdctvity, setDprtmntPrdctvity] = useState([]);
    const [prjctWysHrs, setPrjctWysHrs] = useState([]);
    
    useEffect(() => {
        fetchKpi();
    }, [])

    const fetchKpi = async () => {
        const res = await getKpi();
        setTotalHrsToday(res.data.total_minutes);
        setValueAddedPrcnt(res.data.value_added_percentage);
        setValueAddedHrs(res.data.value_added_minutes);
        setNonValAddPrcnt(res.data.non_value_added_percentage);
        setNonValueAddHrs(res.data.non_value_added_minutes);
        setOtherHoursPrcnt(res.data.other_percentage);
        setOtherHours(res.data.other_minutes);
        setLoggedEmpees(res.data.active_employees);
        setTotalEmpees(res.data.total_employees);
        setTotActivePrjts(res.data.total_active_projects);
        setHourlyData(res.data.hourly_data);
        setWorkEfficiencyComparison(res.data.getWorkEfficiencyComparison);
        setDprtmntPrdctvity(res.data.department_productivity);
        setPrjctWysHrs(res.data.project_wise_hours);
    }

    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const todayDate = formatDate(today);
    const yesterdayDate = formatDate(yesterday);


    // Find today's and yesterday's data
    const todayData = workEfficiencyComparison.find(
        item => item.work_date === todayDate
    );

    const yesterdayData = workEfficiencyComparison.find(
        item => item.work_date === yesterdayDate
    );


    // ========================
    // VALUE ADDED
    // ========================

    const todayValue =
        Number(todayData?.value_added_minutes ?? 0);

    const yesterdayValue =
        Number(yesterdayData?.value_added_minutes ?? 0);

    const valueAddedDifference =
        yesterdayValue > 0
            ? ((todayValue - yesterdayValue) / yesterdayValue) * 100
            : todayValue > 0
                ? 100
                : 0;

    const isValueAddedUp =
        valueAddedDifference >= 0;


    // ========================
    // NON VALUE ADDED
    // ========================

    const todayNonValueAdded =
        Number(todayData?.non_value_added_minutes ?? 0);

    const yesterdayNonValueAdded =
        Number(yesterdayData?.non_value_added_minutes ?? 0);

    const nonValueAddedDifference =
        yesterdayNonValueAdded > 0
            ? ((todayNonValueAdded - yesterdayNonValueAdded) /
                yesterdayNonValueAdded) * 100
            : todayNonValueAdded > 0
                ? 100
                : 0;

    const isNonValueAddedUp =
        nonValueAddedDifference <= 0;

    // ========================
    // OTHER
    // ========================

    const todayOther =
        Number(todayData?.other_minutes ?? 0);

    const yesterdayOther =
        Number(yesterdayData?.other_minutes ?? 0);

    const otherDifference =
        yesterdayOther > 0
            ? ((todayOther - yesterdayOther) /
                yesterdayOther) * 100
            : todayOther > 0
                ? 100
                : 0;

    const isOtherUp =
        otherDifference <= 0;

    // --------------------------first div insights------------------------

    // =======================================
    // WORK TIME DISTRIBUTION
    // =======================================

    const workTimeDistribution = [
        {
            name: "Value Added",
            value: Number(valueAddedHrs) || 0
        },
        {
            name: "Non Value Added",
            value: Number(nonValueAddHrs) || 0
        },
        {
            name: "Other",
            value: Number(otherHours) || 0
        }
    ];


    // =======================================
    // DEPARTMENT PRODUCTIVITY
    // =======================================

    const renderProductivityLabel = (props) => {
        const { x, y, width, height, index } = props;

        const item = dprtmntPrdctvity[index];

        const productivity = Math.ceil(
            Number(item?.productivity_percentage) || 0
        );

        return (
                <text
                    x={x + width + 8}
                    y={y + height / 2}
                    fill="#201818"
                    textAnchor="start"
                    dominantBaseline="middle"
                    fontSize={12}
                    fontWeight={600}
                >
                    {productivity}%
                </text>
        );
    };

    // =====================================
    // PROJECT WISE HOURS
    // =====================================

    const formatHours = (hours) => {
        const totalHours = Number(hours) || 0;

        const wholeHours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - wholeHours) * 60);

        if (minutes === 60) {
            return `${wholeHours + 1}h 00m`;
        }

        return `${wholeHours}h ${String(minutes).padStart(2, '0')}m`;
    };

    const projectHoursData = prjctWysHrs.map((project) => ({
        ...project,
        total_hours: Number(project.total_minutes) / 60
    }));

    return (
        <div className="admDashboard-dash">
            <div className="admDashboard-dash-header">
                <h4>Dashboard Management</h4>
            </div>
            <div className="admDashboard-dash-overview">
                <p>Dashboard Overview</p>
                <div className="admDashboard-dash-ovrvw-crds">
                    <div className="admDashboard-dash-ovrvw-crd">
                        <p><span><FontAwesomeIcon icon={faClockFour} /></span></p>
                        <div className="admDashboard-dash-ovrvw-crd-detail">
                            <p>Total Hours Logged</p>
                            <h3>{Math.floor(totalHrsToday / 60)} : {String(totalHrsToday % 60).padStart(2, '0')} <span>hrs</span></h3>
                            <p>Today</p>
                            <div className="admDashboard-stat">
                                <ResponsiveContainer width="100%" height={60}>
                                    <AreaChart data={hourlyData}>
                                        <Area
                                            type="monotone"
                                            dataKey="minutes"
                                            stroke="red"
                                            fill="#ffd6d6"
                                            fillOpacity={0.2}
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="admDashboard-dash-ovrvw-crd">
                        <p><span><FontAwesomeIcon icon={faChartLine} /></span></p>
                        <div className="admDashboard-dash-ovrvw-crd-detail">
                            <p>Value Added</p>
                            <h3>{Math.ceil(valueAddedPrcnt)}%</h3>
                            <p>{Math.floor(valueAddedHrs / 60)} : {String(valueAddedHrs % 60).padStart(2, '0')} <span>hrs</span></p>
                            <div className="admDashboard-stat">
                                <p className={isValueAddedUp ? "comparison-up" : "comparison-down"}>
                                    <FontAwesomeIcon
                                        icon={isValueAddedUp ? faArrowUp : faArrowDown}
                                        className="faarrowicon"
                                    />

                                    {" "}
                                    {Math.abs(valueAddedDifference).toFixed(1)}%

                                    {" "}
                                    <span>vs yesterday</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="admDashboard-dash-ovrvw-crd">
                        <p><span><FontAwesomeIcon icon={faHourglass1} /></span></p>
                        <div className="admDashboard-dash-ovrvw-crd-detail">
                            <p>Non Value Added</p>
                            <h3>{Math.ceil(nonValAddPrcnt)}%</h3>
                            <p>{Math.floor(nonValueAddHrs / 60)} : {String(nonValueAddHrs % 60).padStart(2, '0')} <span>hrs</span></p>
                            <div className="admDashboard-stat">
                                <p className={isNonValueAddedUp ? "comparison-up" : "comparison-down"}>
                                    <FontAwesomeIcon
                                        icon={isNonValueAddedUp ? faArrowUp : faArrowDown}
                                        className="faarrowicon"
                                    />

                                    {" "}
                                    {Math.abs(nonValueAddedDifference).toFixed(1)}%

                                    {" "}
                                    <span>vs yesterday</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="admDashboard-dash-ovrvw-crd">
                        <p><span><FontAwesomeIcon icon={faPause} /></span></p>
                        <div className="admDashboard-dash-ovrvw-crd-detail">
                            <p>Other Time</p>
                            <h3>{Math.ceil(otherHoursPrcnt)}%</h3>
                            <p>{Math.floor(otherHours / 60)} : {String(otherHours % 60).padStart(2, '0')} <span>hrs</span></p>
                            <div className="admDashboard-stat">
                                <p className={isOtherUp ? "comparison-up" : "comparison-down"}>
                                    <FontAwesomeIcon
                                        icon={isOtherUp ? faArrowUp : faArrowDown}
                                        className="faarrowicon"
                                    />

                                    {" "}
                                    {Math.abs(otherDifference).toFixed(1)}%

                                    {" "}
                                    <span>vs yesterday</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="admDashboard-dash-ovrvw-crd">
                        <p><span><FontAwesomeIcon icon={faUsers} /></span></p>
                        <div className="admDashboard-dash-ovrvw-crd-detail">
                            <p>Employee's Logged</p>
                            <h3>{loggedEmpees} <span>/ {totalEmpees}</span></h3>
                            <p>{Math.ceil(loggedEmpees / totalEmpees * 100)}%</p>
                        </div>
                    </div>
                    <div className="admDashboard-dash-ovrvw-crd">
                        <p><span><FontAwesomeIcon icon={faFolderOpen} /></span></p>
                        <div className="admDashboard-dash-ovrvw-crd-detail">
                            <p>Active Projects</p>
                            <h3>{totActivePrjts}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="admDashboard-first-insight">
                <div className="admDashboard-wrk-tym-distbion">
                    <p>Work Time Distribution</p>
                    <div className="admDashboard-donut-container">
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={workTimeDistribution}
                                    innerRadius={65}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    <Cell fill="#bb2626" />
                                    <Cell fill="#201818" />
                                    <Cell fill="#7a7979" />
                                </Pie>
                                <Tooltip
                                    formatter={(value) => {
                                        const minutes = Number(value);
                                        const hours = Math.floor(minutes / 60);
                                        const mins = minutes % 60;

                                        return [
                                            `${hours}h ${mins}m`,
                                            "Duration"
                                        ];
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="admDashboard-dprtmnt-prdctvty">
                    <p>Department Productivity</p>
                    <div className="admDashboard-barChart-container">
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart
                                data={dprtmntPrdctvity}
                                layout="vertical"
                                margin={{
                                    top: 10,
                                    right: 50,
                                    left: 20,
                                    bottom: 10
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    type="number"
                                    domain={[0, 100]}
                                    ticks={[0, 20, 40, 60, 80, 100]}
                                    tickFormatter={(value) => `${Math.round(value)}%`}
                                />

                                <YAxis
                                    type="category"
                                    dataKey="department_name"
                                    width={100}
                                />

                                <Tooltip
                                    formatter={(value, name) => [
                                        `${Number(value).toFixed(1)}%`,
                                        name
                                    ]}
                                />

                                <Legend />

                                <Bar
                                    dataKey="productivity_percentage"
                                    name="Value Added"
                                    stackId="productivity"
                                    fill="#bb2626"
                                    barSize={30}
                                />

                                <Bar
                                    dataKey="non_value_added_percentage"
                                    name="Non Value Added"
                                    stackId="productivity"
                                    fill="#201818"
                                    barSize={30}
                                />

                                <Bar
                                    dataKey="other_percentage"
                                    name="Other"
                                    stackId="productivity"
                                    fill="#7a7979"
                                    barSize={30}
                                >
                                    <LabelList
                                        content={renderProductivityLabel}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <div className="admDashboard-second-insight">
                <div className="admDashboard-prjct-wys-hrs">
                    <p>Project-wise Hours</p>
                    <div className="admDashboard-project-barChart-container">
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={projectHoursData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 20
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="project_name"
                                    angle={-35}
                                    textAnchor="end"
                                    interval={0}
                                    height={80}
                                />

                                <YAxis
                                    domain={[0, 'auto']}
                                    tickFormatter={(value) =>
                                        `${Number(value).toFixed(0)}h`
                                    }
                                />

                                <Tooltip
                                    formatter={(value) => [
                                        formatHours(value),
                                        "Total Time"
                                    ]}
                                />

                                <Bar
                                    dataKey="total_hours"
                                    name="Total Hours"
                                    fill="#bb2626"
                                    radius={[5, 5, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}