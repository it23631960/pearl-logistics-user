import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TitleBar from '../Components/TitleBar';
import { toast } from 'react-toastify';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = JSON.parse(sessionStorage.getItem('userData'));
  const user = userData?.user;
  const userId = user?.id;
  const token = userData?.token;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${backendUrl}api/reports/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReports(response.data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
        toast.error('Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchReports();
    }
  }, [userId, token]);

  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return 'Invalid date';
    const [year, month, day, hour, minute] = dateArray;
    return new Date(year, month - 1, day, hour, minute).toLocaleString();
  };

  const downloadReport = async (reportId, reportName) => {
    try {
      const response = await axios.get(`${backendUrl}api/reports/${reportId}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

   
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', reportName);
      
      
      document.body.appendChild(link);
      
    
      link.click();
      
    
      link.parentNode.removeChild(link);
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Failed to download report:', error);
      toast.error('Failed to download report');
    }
  };

  const deleteReport = async (reportId) => {
    try {
      await axios.delete(`${backendUrl}api/reports/${reportId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      
      setReports(reports.filter(report => report.id !== reportId));
      toast.success('Report deleted successfully');
    } catch (error) {
      console.error('Failed to delete report:', error);
      toast.error('Failed to delete report');
    }
  };

  
  const groupedReports = reports.reduce((acc, report) => {
    const type = report.reportType || 'Other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(report);
    return acc;
  }, {});

  return (
    <>
      <TitleBar />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">My Reports</h2>
        <hr className="mb-6" />
        
        {loading ? (
          <p className="text-gray-500">Loading reports...</p>
        ) : reports.length === 0 ? (
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">You don't have any saved reports yet.</p>
          </div>
        ) : (
          Object.entries(groupedReports).map(([type, typeReports]) => (
            <div key={type} className="mb-8">
              <h3 className="text-xl font-medium mb-3 text-gray-700 capitalize">{type} Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {typeReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-lg font-medium truncate">{report.reportName}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-3">
                      <p>Created: {formatDate(report.createdAt)}</p>
                      <p>Type: <span className="capitalize">{report.reportType}</span></p>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => downloadReport(report.id, report.reportName)}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded border border-red-200 hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default MyReports;