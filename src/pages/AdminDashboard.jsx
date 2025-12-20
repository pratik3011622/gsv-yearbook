import { useState, useEffect } from 'react';
import {
  Users, CheckCircle, XCircle, Clock, BarChart3,
  Image, Briefcase, Calendar, BookOpen, AlertTriangle,
  Shield, Activity
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export const AdminDashboard = ({ onNavigate }) => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    totalEvents: 0,
    totalJobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [adminLogs, setAdminLogs] = useState([]);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchPendingProfiles();
      fetchStats();
      fetchAdminLogs();
    }
  }, [profile]);

  const fetchPendingProfiles = async () => {
    try {
      const data = await api.getAllProfiles();
      const pending = data.filter(profile => profile.approvalStatus === 'pending');
      setPendingProfiles(pending || []);
    } catch (error) {
      console.error('Error fetching pending profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await api.getAdminStats();
      setStats({
        totalUsers: statsData.users?.approved || 0,
        pendingApprovals: statsData.users?.pending || 0,
        totalEvents: 0, // Will be updated when events are implemented
        totalJobs: 0, // Will be updated when jobs are implemented
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchAdminLogs = async () => {
    try {
      const data = await api.getAdminLogs();
      setAdminLogs(data || []);
    } catch (error) {
      console.error('Error fetching admin logs:', error);
    }
  };

  const handleApproval = async (profileId, status, reason = null) => {
    try {
      if (status === 'approved') {
        await api.approveUser(profileId);
      } else {
        await api.rejectUser(profileId, reason);
      }

      fetchPendingProfiles();
      fetchStats();
      fetchAdminLogs();

      alert(`User ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      console.error('Error updating approval:', error);
      alert('Failed to update approval status');
    }
  };

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You don't have admin privileges to view this page
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Manage users, content, and monitor platform activity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.totalUsers}
              </span>
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Total Users</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.pendingApprovals}
              </span>
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Pending Approvals</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.totalEvents}
              </span>
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Total Events</h3>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.totalJobs}
              </span>
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Total Jobs</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 mb-8">
          <div className="border-b border-slate-200 dark:border-slate-700 p-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'pending'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Pending Approvals ({pendingProfiles.length})
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'logs'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Activity Logs
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : pendingProfiles.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      No pending approvals at the moment
                    </p>
                  </div>
                ) : (
                  pendingProfiles.map((user) => (
                    <div
                      key={user.id}
                      className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                            {user.fullName?.charAt(0) || '?'}
                          </div>

                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                              {user.fullName}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-2">
                              {user.email}
                            </p>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-slate-500 dark:text-slate-500">Type:</span>
                                <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">
                                  {user.userType}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500 dark:text-slate-500">Batch:</span>
                                <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">
                                  {user.batchYear}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500 dark:text-slate-500">Department:</span>
                                <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">
                                  {user.department}
                                </span>
                              </div>
                              {user.currentCompany && (
                                <div>
                                  <span className="text-slate-500 dark:text-slate-500">Company:</span>
                                  <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">
                                    {user.currentCompany}
                                  </span>
                                </div>
                              )}
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-3">
                              Registered: {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-3 ml-4">
                          <button
                            onClick={() => handleApproval(user.id, 'approved')}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Enter rejection reason (optional):');
                              handleApproval(user.id, 'rejected', reason);
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="space-y-4">
                {adminLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      No activity logs yet
                    </p>
                  </div>
                ) : (
                  adminLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border border-slate-200 dark:border-slate-700 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              log.action.includes('APPROVE')
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {log.action.replace('_', ' ')}
                            </span>
                            <span className="text-slate-500 dark:text-slate-500 text-sm">
                              {log.target_type}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            by {log.adminId?.fullName || 'Unknown Admin'}
                          </p>
                          {log.details?.reason && (
                            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                              Reason: {log.details.reason}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
