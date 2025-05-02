import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "./Layout";
import { ChevronDown } from "lucide-react";
import FileUploadModal from "./FileUploadModal";
import NoAlertsState from "./NoAlertsState";
import DateRangePicker from "./DateRangePicker";
import ThreatDetailsModal from './ThreatDetailsModal';

const Alerts = ({ onLogout }) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all-threats');
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedThreat, setSelectedThreat] = useState(null);
    const [alerts, setAlerts] = useState([]); // Replace the dummy alerts array with state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAlerts();
    }, []); // Empty dependency array means this runs once when component mounts

    const fetchAlerts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Replace '123' with actual userId from your auth system
            const userId = '123'; 
            const response = await fetch(`https://www.cybedefenderai.com/cybedefender/alerts`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch alerts');
            }

            const data = await response.json();
            setAlerts(data.alerts);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching alerts:', err);
        } finally {
            setIsLoading(false);
        }
    };



    // const alerts = [
    //     { date: "2024-12-12", threatType: "Malware", severity: "Low" },
    //     { date: "2024-12-12", threatType: "Virus", severity: "High" },
    //     { date: "2025-05-01", threatType: "Virus", severity: "Medium" },
    //     { date: "2025-05-01", threatType: "Malware", severity: "High" },
    //     { date: "2025-05-01", threatType: "Virus", severity: "Low" },
    //     { date: "2025-05-01", threatType: "Malware", severity: "Low" },
    //     { date: "2025-05-01", threatType: "Malware", severity: "Low" },
    //     { date: "2025-05-01", threatType: "Malware", severity: "Low" },
    //     { date: "2025-05-01", threatType: "Malware", severity: "Low" },
    //     { date: "2024-12-12", threatType: "Malware", severity: "Low" },
    //     { date: "2024-12-12", threatType: "Virus", severity: "High" },
    //     { date: "2025-05-01", threatType: "Virus", severity: "Medium" },
    //     { date: "2025-05-01", threatType: "Malware", severity: "High" },
    //     { date: "2025-05-01", threatType: "Virus", severity: "Low" },
    //     { date: "2025-05-01", threatType: "Malware", severity: "Low" },
    //     { date: "2025-05-01", threatType: "Malware", severity: "Low" },
    //     { date: "2024-12-12", threatType: "Malware", severity: "Low" },
    //     { date: "2024-12-12", threatType: "Virus", severity: "High" },
    //     { date: "2025-05-01", threatType: "Virus", severity: "Medium" },
    //     { date: "2025-05-01", threatType: "Malware", severity: "High" },
    //     { date: "2025-05-01", threatType: "Virus", severity: "Low" },
    //     { date: "2025-05-01", threatType: "Malware", severity: "Low" },
    //     { date: "2025-05-01", threatType: "Malware", severity: "Low" },
    //     { date: "2025-05-01", threatType: "Malware", severity: "Low" },
    //     { date: "2024-12-12", threatType: "Malware", severity: "Low" },
    //     { date: "2024-12-12", threatType: "Virus", severity: "High" },
    //     { date: "2025-05-01", threatType: "Virus", severity: "Medium" },
    //     { date: "2025-05-01", threatType: "Malware", severity: "High" },
    //     { date: "2025-05-01", threatType: "Virus", severity: "Low" },
    //     { date: "2025-05-01", threatType: "Malware", severity: "Low" }
    // ];
    
    const uploadHistory = [
        { fileName: "Adware", timestamp: "12/12/2024 - 12:01:00", status: "Upload Successful" },
        { fileName: "Virus", timestamp: "24/12/2024 - 1:20:02", status: "Upload Failed" },
        { fileName: "Spyware", timestamp: "31/12/2024 - 22:40:00", status: "Upload Successful" },
        { fileName: "Malware", timestamp: "5/1/2025 - 19:20:10", status: "Upload Successful" },
        { fileName: "Adware", timestamp: "12/1/2025 - 7:01:00", status: "Upload Failed" },
        { fileName: "Adware", timestamp: "12/1/2025 - 12:11:03", status: "Upload Failed" },
        { fileName: "Adware", timestamp: "12/12/2024 - 12:01:00", status: "Upload Successful" },
        { fileName: "Virus", timestamp: "24/12/2024 - 1:20:02", status: "Upload Failed" },
        { fileName: "Spyware", timestamp: "31/12/2024 - 22:40:00", status: "Upload Successful" },
        { fileName: "Malware", timestamp: "5/1/2025 - 19:20:10", status: "Upload Successful" },
        { fileName: "Adware", timestamp: "12/1/2025 - 7:01:00", status: "Upload Failed" },
        { fileName: "Adware", timestamp: "12/1/2025 - 12:11:03", status: "Upload Failed" }
    ];

    const [filters, setFilters] = useState({
        dateRange: {
            start: null, // Or a valid Date object
            end: null,   // Or a valid Date object
        },
        severity: '',
        threatType: '',
    });



    const itemsPerPage = 10;

    const paginatedUploadHistory = uploadHistory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusColor = (status) => {
        return status.toLowerCase().includes('failed') ? 'text-red-500' : 'text-green-500';
    };

    const getSeverityClass = (severity, defaultClass = "bg-gray-100 text-gray-800") => {
        const classes = {
            low: "bg-blue-100 text-blue-800",
            medium: "bg-yellow-100 text-yellow-800",
            high: "bg-red-100 text-red-800",
        };
        return classes[severity.toLowerCase()] || defaultClass;
    };

    const handleFilterChange = (field, value) => {
        if (field === "dateRange") {
            // Handling the date range filter
            console.log("Applying Range Start:", value.start, "Range End:", value.end);

            const start = new Date(value.start); // Convert to Date if necessary
            const end = new Date(value.end);     // Convert to Date if necessary

            // Check if they are valid dates before updating state
            if (!isNaN(start) && !isNaN(end)) {
                setFilters((prevFilters) => ({
                    ...prevFilters,
                    dateRange: {
                        start: start,
                        end: end,
                    },
                }));
            } else {
                console.error("Invalid Date Range:", value.start, value.end);
            }
        } else {
            // Handling severity and threatType filters
            setFilters((prevFilters) => ({
                ...prevFilters,
                [field]: value, // Dynamically updating the appropriate filter
            }));
        }
        setCurrentPage(1);
    };

    const filteredAlerts = alerts.filter((alert) => {
        const matchesSeverity = filters.severity ? alert.severity === filters.severity : true;
        const matchesThreatType = filters.threatType ? alert.threatType === filters.threatType : true;

        // Convert alert date to a proper Date object (since your date format is now YYYY-MM-DD)
        const alertDate = new Date(alert.date).getTime(); // ISO 8601 format is automatically parsed by JavaScript

        // Ensure filters.dateRange.start and filters.dateRange.end are valid Date objects
        const startDate = filters.dateRange.start instanceof Date && !isNaN(filters.dateRange.start) ? filters.dateRange.start.getTime() : null;
        const endDate = filters.dateRange.end instanceof Date && !isNaN(filters.dateRange.end) ? filters.dateRange.end.getTime() : null;

        // Log to help debug
        console.log("Alert Date:", new Date(alert.date)); // The parsed alert date
        console.log("Start Date:", filters.dateRange.start, "Parsed:", startDate);
        console.log("End Date:", filters.dateRange.end, "Parsed:", endDate);

        const matchesDateRange =
            (!startDate || alertDate >= startDate) &&
            (!endDate || alertDate <= endDate);

        return matchesSeverity && matchesThreatType && matchesDateRange;
    });

    const paginatedAlerts = filteredAlerts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePagination = (direction) => {
        setCurrentPage((prevPage) => prevPage + direction);
    };

    const severityOptions = ["All", "High", "Medium", "Low"];
    const threatTypeOptions = ["All", "Malware", "Virus", "Benign", "Bot", "DDoS", "DoS GoldenEye", "DoS Hulk", "DoS Slowhttptest", "DoS Slowloris", "FTP-Patator", "Heartbleed", "Infiltration", "PortScan", "SSH-Patator", "Web Brute","Sql Injection","Web Attack XSS"];

    return (
        <AppLayout onLogout={onLogout}>
            {/* Top Tabs */}
            <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-lg">
                <div className="flex items-center ">
                    <div className="bg-gray-100 rounded-lg p-1 flex items-center">
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative m-0 ${activeTab === 'all-threats'
                                ? 'bg-white text-gray-900'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                            onClick={() => handleTabChange('all-threats')}
                        >
                            All Threats
                        </button>

                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative m-0 ${activeTab === 'upload-history'
                                ? 'bg-white text-gray-900'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                            onClick={() => handleTabChange('upload-history')}
                        >
                            Upload History
                        </button>
                    </div>
                </div>
                <>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg m-0 hover:bg-blue-700 transition-colors flex items-center"
                        onClick={() => setIsUploadModalOpen(true)}
                    >
                        Upload
                    </button>
                    <FileUploadModal
                        isOpen={isUploadModalOpen}
                        onClose={() => setIsUploadModalOpen(false)}
                    />
                </>
            </div>
            {activeTab === 'upload-history' && (
                <div className="bg-white rounded-lg shadow">
                    <div className="overflow-x-auto">
                        {uploadHistory.length > 0 ? (


                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left p-4 text-gray-600 font-medium">File Name</th>
                                        <th className="text-left p-4 text-gray-600 font-medium">Timestamp</th>
                                        <th className="text-left p-4 text-gray-600 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUploadHistory.map((item, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="p-4 text-gray-900">{item.fileName}</td>
                                            <td className="p-4 text-gray-900">{item.timestamp}</td>
                                            <td className={`p-4 ${getStatusColor(item.status)}`}>{item.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                            : (
                                <NoAlertsState message="No History Found" />
                            )
                        }
                    </div>
                    {/* Pagination Controls */}
                    {
                        uploadHistory.length > 0 && (

                            <div className="p-4 border-t flex justify-between items-center text-sm text-gray-600">
                                <button
                                    onClick={() => handlePagination(-1)}
                                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300"
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span>
                                    Page {currentPage} of {Math.ceil(uploadHistory.length / itemsPerPage)}
                                </span>
                                <button
                                    onClick={() => handlePagination(1)}
                                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300"
                                    disabled={currentPage === Math.ceil(uploadHistory.length / itemsPerPage)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                </div>

            )}
            {activeTab === 'all-threats' && (
                <div className="bg-white rounded-lg shadow">
                    {/* Filter Section */}
                    <div className="p-4 border-b">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                {/* Severity Filter */}
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600">Severity:</span>
                                    <select
                                        className="flex items-center gap-1 px-3 py-1.5 m-0 border rounded-md hover:bg-gray-50"
                                        onChange={(e) => handleFilterChange("severity", e.target.value)}
                                        value={filters.severity}
                                    >
                                        {severityOptions.map((option, index) => (
                                            <option key={index} value={option === "All" ? "" : option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Threat Type Filter */}
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600">Threat Type:</span>
                                    <select
                                        className="flex items-center gap-1 px-3 py-1.5 m-0 border rounded-md hover:bg-gray-50"
                                        onChange={(e) => handleFilterChange("threatType", e.target.value)}
                                        value={filters.threatType}
                                    >
                                        {threatTypeOptions.map((option, index) => (
                                            <option key={index} value={option === "All" ? "" : option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600">Date Range:</span>
                                    <DateRangePicker
                                        onApply={(range) => handleFilterChange("dateRange", range)}
                                        value={filters.dateRange} />
                                </div>

                                {/* Clear All Button */}
                                <button
                                    className="text-gray-600 m-0 hover:text-gray-800"
                                    onClick={() =>
                                        setFilters({
                                            severity: "",
                                            threatType: "",
                                            dateRange: "Selected date range",

                                        }, setCurrentPage(1))

                                    }
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Alerts Table */}
                    <div className="overflow-x-auto">
                    {isLoading ? (
                <div className="p-8 text-center text-gray-600">
                    Loading alerts...
                </div>
            ) : error ? (
                <div className="p-8 text-center text-red-600">
                    {error}
                </div>
            ) : paginatedAlerts.length ? (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left p-4 text-gray-600">Date</th>
                                        <th className="text-left p-4 text-gray-600">Threat Type</th>
                                        <th className="text-left p-4 text-gray-600">Severity</th>
                                        <th className="text-left p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedAlerts.map((alert, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="p-4 text-gray-900">{alert.date.split(" ")[0]}</td>
                                            <td className="p-4 text-gray-900">{alert.threatType}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-sm ${getSeverityClass(alert.severity)}`}>
                                                    {alert.severity}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                    onClick={() => {
                                                        setSelectedThreat(alert.threatType);
                                                        setIsDetailsModalOpen(true);
                                                    }}>


                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <NoAlertsState message="No Alerts Found" />
                        )}
                    </div>

                    {filteredAlerts.length > 0 && (
                        <div className="p-4 border-t flex justify-between items-center text-sm text-gray-600">
                            <button
                                onClick={() => handlePagination(-1)}
                                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300"
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>
                                Page {currentPage} of {Math.ceil(filteredAlerts.length / itemsPerPage)}
                            </span>
                            <button
                                onClick={() => handlePagination(1)}
                                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300"
                                disabled={currentPage === Math.ceil(filteredAlerts.length / itemsPerPage)}
                            >
                                Next
                            </button>
                        </div>
                    )}


                </div>
            )}
            <ThreatDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                threatType={selectedThreat}
                alerts={alerts}
            />
        </AppLayout>
    );
};

export default Alerts;