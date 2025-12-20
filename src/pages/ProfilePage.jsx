import { useState, useEffect } from 'react';
import {
  User, Edit3, Save, X, Camera, MapPin, Briefcase, GraduationCap,
  Mail, Phone, Globe, Linkedin, Github, Award, Calendar, CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

export const ProfilePage = ({ onNavigate }) => {
  const { profile, user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    batchYear: '',
    department: '',
    currentCompany: '',
    jobTitle: '',
    location: '',
    phone: '',
    linkedinUrl: '',
    githubUrl: '',
    websiteUrl: '',
    skills: [],
    interests: [],
    achievements: []
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        batchYear: profile.batchYear || '',
        department: profile.department || '',
        currentCompany: profile.currentCompany || '',
        jobTitle: profile.jobTitle || '',
        location: profile.location || '',
        phone: profile.phone || '',
        linkedinUrl: profile.linkedinUrl || '',
        githubUrl: profile.githubUrl || '',
        websiteUrl: profile.websiteUrl || '',
        skills: profile.skills || [],
        interests: profile.interests || [],
        achievements: profile.achievements || []
      });
    }
  }, [profile]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: array
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.updateProfile(formData);
      await updateProfile(formData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    const fields = [
      'fullName', 'bio', 'batchYear', 'department',
      'currentCompany', 'jobTitle', 'location'
    ];
    const completedFields = fields.filter(field => formData[field]).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Please login to view your profile
          </h2>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const completionPercentage = calculateProfileCompletion();

  return (
    <div className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-6 left-6 flex items-end space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 border-4 border-white shadow-lg">
                  {formData.fullName?.charAt(0) || '?'}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-1">{formData.fullName || 'Your Name'}</h1>
                <p className="text-white/90">
                  {profile?.userType === 'alumni' ? 'Alumni' : 'Student'} • {formData.batchYear || 'Batch Year'}
                </p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white/90">Profile {completionPercentage}% Complete</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-6 right-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Basic Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Section */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About</h2>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                      rows={4}
                    />
                  ) : (
                    <p className="text-slate-600 dark:text-slate-400">
                      {formData.bio || 'No bio added yet.'}
                    </p>
                  )}
                </div>

                {/* Education */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Education
                  </h2>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Batch Year
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={formData.batchYear}
                            onChange={(e) => handleInputChange('batchYear', e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                          />
                        ) : (
                          <p className="text-slate-900 dark:text-white">{formData.batchYear || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Department
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.department}
                            onChange={(e) => handleInputChange('department', e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                          />
                        ) : (
                          <p className="text-slate-900 dark:text-white">{formData.department || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Career */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Career
                  </h2>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Current Company
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.currentCompany}
                            onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                          />
                        ) : (
                          <p className="text-slate-900 dark:text-white">{formData.currentCompany || 'Not specified'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Position
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.jobTitle}
                            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                          />
                        ) : (
                          <p className="text-slate-900 dark:text-white">{formData.jobTitle || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Skills</h2>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.skills.join(', ')}
                      onChange={(e) => handleArrayChange('skills', e.target.value)}
                      placeholder="Enter skills separated by commas"
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.length > 0 ? (
                        formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-600 dark:text-slate-400">No skills added yet.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Contact & Stats */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Contact
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-400">{user.email}</span>
                    </div>
                    {formData.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-slate-500" />
                        {isEditing ? (
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="flex-1 p-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                          />
                        ) : (
                          <span className="text-slate-600 dark:text-slate-400">{formData.phone}</span>
                        )}
                      </div>
                    )}
                    {formData.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className="flex-1 p-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                          />
                        ) : (
                          <span className="text-slate-600 dark:text-slate-400">{formData.location}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Social Links
                  </h2>
                  <div className="space-y-3">
                    {formData.linkedinUrl && (
                      <div className="flex items-center space-x-3">
                        <Linkedin className="w-4 h-4 text-blue-600" />
                        {isEditing ? (
                          <input
                            type="url"
                            value={formData.linkedinUrl}
                            onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                            className="flex-1 p-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                          />
                        ) : (
                          <a
                            href={formData.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            LinkedIn Profile
                          </a>
                        )}
                      </div>
                    )}
                    {formData.githubUrl && (
                      <div className="flex items-center space-x-3">
                        <Github className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                        {isEditing ? (
                          <input
                            type="url"
                            value={formData.githubUrl}
                            onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                            className="flex-1 p-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                          />
                        ) : (
                          <a
                            href={formData.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                          >
                            GitHub Profile
                          </a>
                        )}
                      </div>
                    )}
                    {formData.websiteUrl && (
                      <div className="flex items-center space-x-3">
                        <Globe className="w-4 h-4 text-green-600" />
                        {isEditing ? (
                          <input
                            type="url"
                            value={formData.websiteUrl}
                            onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                            className="flex-1 p-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                          />
                        ) : (
                          <a
                            href={formData.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 transition-colors"
                          >
                            Personal Website
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">Profile Completion</h3>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {completionPercentage}% complete
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};