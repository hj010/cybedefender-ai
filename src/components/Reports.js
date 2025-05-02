import React, { useState, useEffect } from 'react';
import AppLayout from './Layout';
import NoReportState from './NoReportState';
import DateRangePicker from './DateRangePicker';

const Reports = ({ onLogout }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReports, setSelectedReports] = useState([]);
  const itemsPerPage = 10;
  const [filters, setFilters] = useState({
    dateRange: {
      start: null,
      end: null,
    },
    severity: '',
    threatType: '',
  });

  // Fetch reports from Flask API
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://www.cybedefenderai.com/reports');
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      const data = await response.json();
      setReports(data);
      setError(null);
    } catch (err) {
      setError('Failed to load reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle file download
  const handleDownload = async (fileName) => {
    try {
      const response = await fetch(`https://www.cybedefenderai.com/download/${fileName}`);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      
      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert('Failed to download the file');
    }
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

  // Filter reports based on date range
  const filteredReports = reports.filter((report) => {
    // Convert report date to a proper Date object
    const reportDate = new Date(report.dateCreated).getTime();

    // Ensure filters.dateRange.start and filters.dateRange.end are valid Date objects
    const startDate = filters.dateRange.start instanceof Date && !isNaN(filters.dateRange.start) ? filters.dateRange.start.getTime() : null;
    const endDate = filters.dateRange.end instanceof Date && !isNaN(filters.dateRange.end) ? filters.dateRange.end.getTime() : null;

    // Log to help debug
    console.log("Report Date:", new Date(report.dateCreated));
    console.log("Start Date:", filters.dateRange.start, "Parsed:", startDate);
    console.log("End Date:", filters.dateRange.end, "Parsed:", endDate);

    const matchesDateRange =
      (!startDate || reportDate >= startDate) &&
      (!endDate || reportDate <= endDate);

    return matchesDateRange;
  });

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePagination = (direction) => {
    setCurrentPage((prevPage) => prevPage + direction);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedReports(filteredReports.map((report) => report.id));
    } else {
      setSelectedReports([]);
    }
  };

  const handleSelectReport = (id) => {
    if (selectedReports.includes(id)) {
      setSelectedReports(selectedReports.filter((reportId) => reportId !== id));
    } else {
      setSelectedReports([...selectedReports, id]);
    }
  };

  if (loading) {
    return (
      <AppLayout onLogout={onLogout}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading reports...</div>
        </div>
      </AppLayout>
    );
  }

  if (error || reports.length === 0) {
    return (
      <AppLayout onLogout={onLogout}>
        <NoReportState message={error ? error : "No reports available"} />
      </AppLayout>
    );
  }

  return (
    <AppLayout onLogout={onLogout}>
      <div className="bg-white rounded-lg shadow-sm">
        {/* Filter Header */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Date Range:</span>
                <DateRangePicker
                  onApply={(range) => handleFilterChange("dateRange", range)}
                  value={filters.dateRange} 
                />
              </div>

              {/* Clear All Button */}
              <button
                className="text-gray-600 m-0 hover:text-gray-800"
                onClick={() =>
                  setFilters({
                    severity: "",
                    threatType: "",
                    dateRange: {
                      start: null,
                      end: null,
                    },
                  }, setCurrentPage(1))
                }
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
        {reports.length > 0 && filteredReports.length === 0 ? (
        <div className="p-8">
          <NoReportState message="No reports available for the selected date range." />
        </div>
      ) : (
        <>
        

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-4 px-6 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="py-4 px-6 text-left">
                  <span className="text-gray-900 font-semibold">Title</span>
                </th>
                <th className="py-4 px-6 text-left">
                  <span className="text-gray-900 font-semibold">Date Created</span>
                </th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedReports.includes(report.id)}
                      onChange={() => handleSelectReport(report.id)}
                    />
                  </td>
                  <td className="py-4 px-6 text-gray-900 font-medium">{report.filename}</td>
                  <td className="py-4 px-6 text-gray-900">{report.dateCreated}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      className="text-blue-600 hover:text-blue-700 font-medium"
                      onClick={() => handleDownload(report.filename)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination - Copied from alerts.js */}
        {filteredReports.length > 0 && (
          <div className="p-4 border-t flex justify-between items-center text-sm text-gray-600">
            <button
              onClick={() => handlePagination(-1)}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {Math.ceil(filteredReports.length / itemsPerPage)}
            </span>
            <button
              onClick={() => handlePagination(1)}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300"
              disabled={currentPage === Math.ceil(filteredReports.length / itemsPerPage)}
            >
              Next
            </button>
          </div>
        )}
          </>
        
        
        )}
      </div>
    </AppLayout>
  );
};

export default Reports;