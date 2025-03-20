import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from './Layout';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import NoDashboardState from './NoDashboardState';

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [monthlyData, setMonthlyData] = useState([]);
  const [severityData, setSeverityData] = useState([]);
  const [anomalies, setAnomalies] = useState(0);
  const [highSeverity, setHighSeverity] = useState(0);
  const [mediumSeverity, setMediumSeverity] = useState(0);
  const [lowSeverity, setLowSeverity] = useState(0);
  const [recentThreats, setRecentThreats] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchCybedefenderData();
  }, []);

  const fetchCybedefenderData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/cybedefender/Dashboard');
      const data = await response.json();

      // Extracting month-wise anomalies
      const monthData = Object.keys(data.monthlyData).map((month) => ({
        name: month,
        value: data.monthlyData[month],
      }));

      setMonthlyData(monthData);
      setAnomalies(data.Anomalies);
      setHighSeverity(data.High);
      setMediumSeverity(data.Medium);
      setLowSeverity(data.Low);

      setSeverityData([
        { name: 'Low Severity', value: data.Low, color: '#4444FF' },
        { name: 'Medium Severity', value: data.Medium, color: '#FFD700' },
        { name: 'High Severity', value: data.High, color: '#FF4444' },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(true);
    }
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/cybedefender/alerts"); // Replace with your API URL
        const data = await response.json();
        console.log("alerts", data.alerts)
        if (!data.alerts) return;

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split("T")[0];
        console.log("today", today)
        console.log("Sample alert date:", data.alerts[0].date);
        console.log("fetch",data.alerts
          .filter(alert => new Date(alert.date) <= new Date(today)))

        // Filter alerts for today & sort by timestamp (latest first)
        const filteredAlerts = data.alerts
        .filter(alert => new Date(alert.date) <= new Date(today)) 
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6); // Take only the top 6 recent alerts
        console.log("filtered", filteredAlerts)
        setRecentThreats(filteredAlerts);
      } catch (error) {
        console.error("Error fetching alerts:", error);
        setError(true);
      }
    };

    fetchAlerts();
  }, []);
  const getSeverityClass = (severity) => {
    switch (severity.toLowerCase()) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  if (error || (anomalies === 0 && recentThreats.length === 0)) {
    return (
      <AppLayout onLogout={onLogout}>
        <NoDashboardState message="No data found" />
      </AppLayout>
    );
  }

  return (
    <AppLayout onLogout={onLogout}>
      {/* Threat Overview Cards */}
      <h2 className="text-xl font-semibold mb-4">Threat Overview</h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 pt-6">
            <div className="text-sm text-gray-500">Total Anomalies Detected</div>
            <div className="text-2xl font-bold">{anomalies}</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50">
          <CardContent className="p-4 pt-6">
            <div className="text-sm text-red-600">High Severity</div>
            <div className="text-2xl font-bold text-red-600">{highSeverity}</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50">
          <CardContent className="p-4 pt-6">
            <div className="text-sm text-yellow-600">Medium Severity</div>
            <div className="text-2xl font-bold text-yellow-600">{mediumSeverity}</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50">
          <CardContent className="p-4 pt-6">
            <div className="text-sm text-blue-600">Low Severity</div>
            <div className="text-2xl font-bold text-blue-600">{lowSeverity}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Total Anomalies Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#4444FF" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Anomalies</CardTitle>
            <div className="text-3xl font-bold">{anomalies}</div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {severityData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
      <CardHeader>
        <CardTitle>Recent Threats</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="p-2">Type</th>
              <th className="p-2">Timestamp</th>
              <th className="p-2">Severity</th>
            </tr>
          </thead>
          <tbody>
            {recentThreats.length > 0 ? (
              recentThreats.map((threat, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{threat.threatType}</td>
                  <td className="p-2">{threat.date}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${getSeverityClass(threat.severity)}`}>
                      {threat.severity}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-2 text-center">
                  No recent threats for today.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
    </AppLayout>
  );
};

export default Dashboard;
