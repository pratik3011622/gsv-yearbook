import { useState, useEffect } from 'react';
import {
  User, Edit3, Save, X, Camera, MapPin, Briefcase, GraduationCap,
  Mail, Globe, Linkedin, Github, Award, Calendar, CheckCircle,
  LogOut, Settings, ChevronDown, ChevronUp, Plus, Minus, BookOpen,
  TrendingUp, Users, Star, Shield, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api, staticBaseURL } from '../lib/api';

export const ProfilePage = ({ onNavigate, userId }) => {
  const { profile, user, updateProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [viewProfile, setViewProfile] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [error, setError] = useState(null);

  const displayProfile = userId ? viewProfile : (profile || {});

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    tagline: '',
    batchYear: '',
    department: '',
    universityName: 'Gati Shakti Vishwavidyalaya',
    degree: 'Bachelor of Technology',
    specialization: '',
    graduationStart: '',
    graduationEnd: '',
    currentCompany: '',
    jobTitle: '',
    industry: '',
    yearsOfExperience: '',
    pastCompanies: [],
    location: '',
    country: 'India',
    linkedinUrl: '',
    githubUrl: '',
    websiteUrl: '',
    skills: [],
    achievements: [],
    certifications: [],
    isProfilePublic: true
  });

  useEffect(() => {
    if (userId) {
      // Reset formData for viewing other user
      setFormData({
        fullName: '',
        bio: '',
        tagline: '',
        batchYear: '',
        department: '',
        universityName: 'Gati Shakti Vishwavidyalaya',
        degree: 'Bachelor of Technology',
        specialization: '',
        graduationStart: '',
        graduationEnd: '',
        currentCompany: '',
        jobTitle: '',
        industry: '',
        yearsOfExperience: '',
        pastCompanies: [],
        location: '',
        country: 'India',
        linkedinUrl: '',
        githubUrl: '',
        websiteUrl: '',
        skills: [],
        achievements: [],
        certifications: [],
        isProfilePublic: true
      });
    } else if (profile) {
      // Set formData for own profile
      setFormData({
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        tagline: profile.tagline || '',
        batchYear: profile.batchYear || '',
        department: profile.department || '',
        universityName: profile.universityName || 'Gati Shakti Vishwavidyalaya',
        degree: profile.degree || 'Bachelor of Technology',
        specialization: profile.specialization || '',
        graduationStart: profile.graduationStart || '',
        graduationEnd: profile.graduationEnd || '',
        currentCompany: profile.currentCompany || '',
        jobTitle: profile.jobTitle || '',
        industry: profile.industry || '',
        yearsOfExperience: profile.yearsOfExperience || '',
        pastCompanies: profile.pastCompanies || [],
        location: profile.location || '',
        country: profile.country || 'India',
        linkedinUrl: profile.linkedinUrl || '',
        githubUrl: profile.githubUrl || '',
        websiteUrl: profile.websiteUrl || '',
        skills: profile.skills || [],
        achievements: profile.achievements || [],
        certifications: profile.certifications || [],
        isProfilePublic: profile.isProfilePublic !== false
      });
    }
  }, [userId, profile]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    const separator = field === 'achievements' ? '\n' : ',';
    const array = value.split(separator).map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: array
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (profilePhotoFile) {
        // Use FormData for file upload
        const formDataToSend = new FormData();

        // Add all form data
        Object.keys(formData).forEach(key => {
          if (Array.isArray(formData[key])) {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key] || '');
          }
        });

        // Add the file
        formDataToSend.append('profilePhoto', profilePhotoFile);

        const response = await fetch(`${api.baseURL}/profiles/me`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formDataToSend
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const updatedUser = await response.json();
        console.log('Updated user from server:', updatedUser);
        await updateProfile(updatedUser);

        // Clear photo states
        setProfilePhotoFile(null);
        setProfilePhotoPreview(null);
      } else {
        // Regular JSON update
        await api.updateProfile(formData);
        await updateProfile(formData);
      }

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    // TODO: Implement password change API
    alert('Password change functionality will be available soon');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Implement account deletion
      alert('Account deletion functionality will be available soon');
    }
  };

  const calculateProfileCompletion = () => {
    const fields = [
      'fullName', 'bio', 'batchYear', 'department',
      'currentCompany', 'jobTitle', 'location', 'skills'
    ];
    const completedFields = fields.filter(field => {
      if (Array.isArray(formData[field])) {
        return formData[field].length > 0;
      }
      return formData[field];
    }).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const handleLogout = async () => {
    await signOut();
    onNavigate('home');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = () => {
    document.getElementById('profilePhotoInput').click();
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Please login to view your profile
          </h2>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const completionPercentage = calculateProfileCompletion();
  const isAlumni = profile?.role === 'alumni';

  return (
    <div className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN - PROFILE CARD */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-300">
              {/* Profile Header */}
              <div className="relative h-32 bg-gradient-to-r from-primary-600 to-primary-800">
                <div className="absolute -bottom-12 left-6">
                  <div className="relative">
                    {profilePhotoPreview || displayProfile?.avatarUrl ? (
                      <img
                        key={profilePhotoPreview || displayProfile?.avatarUrl}
                        src={profilePhotoPreview || `${staticBaseURL}${displayProfile.avatarUrl}`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-lg object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-2xl font-bold text-white border-4 border-white dark:border-slate-800 shadow-lg">
                        {formData.fullName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                    {isEditing && (
                      <button
                        onClick={handlePhotoUpload}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-slate-700 text-slate-700 dark:text-white rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors shadow-lg border border-slate-200 dark:border-slate-600"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                    <input
                      id="profilePhotoInput"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="pt-16 pb-6 px-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{formData.fullName || 'Your Name'}</h2>
                  <p className="text-primary-600 dark:text-primary-400 text-sm mb-2 font-medium">
                    {formData.jobTitle && formData.currentCompany
                      ? `${formData.jobTitle} at ${formData.currentCompany}`
                      : 'Professional Title'
                    }
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                    <span>Batch of {formData.batchYear || '20XX'}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <span>{formData.department || 'Department'}</span>
                  </div>
                  {formData.location && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mt-2">
                      <MapPin className="w-4 h-4" />
                      <span>{formData.location}, {formData.country}</span>
                    </div>
                  )}
                </div>

                {/* Profile Completion */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Profile Completion</span>
                    <span className="text-sm text-primary-600 dark:text-primary-400 font-bold">{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - DETAILED INFORMATION */}
          <div className="lg:col-span-2 space-y-6">

            {/* ABOUT SECTION */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">About</h3>
              </div>
              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">Tagline</label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => handleInputChange('tagline', e.target.value)}
                      placeholder="A short personal quote or tagline"
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about your journey, experiences, and aspirations..."
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-300"
                      rows={5}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.tagline && (
                    <div className="bg-primary-50 dark:bg-primary-900/10 border-l-4 border-primary-500 rounded-r-xl p-4">
                      <p className="text-primary-700 dark:text-primary-300 font-medium italic text-lg">"{formData.tagline}"</p>
                    </div>
                  )}
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700/50">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                      {formData.bio || 'No bio added yet. Share your story with the community.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* EDUCATION DETAILS */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                Education Details
              </h3>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">University</label>
                    <input
                      type="text"
                      value={formData.universityName}
                      onChange={(e) => handleInputChange('universityName', e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Degree</label>
                    <input
                      type="text"
                      value={formData.degree}
                      onChange={(e) => handleInputChange('degree', e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Specialization</label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      placeholder="e.g., Computer Science"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Year</label>
                      <input
                        type="number"
                        value={formData.graduationStart}
                        onChange={(e) => handleInputChange('graduationStart', e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">End Year</label>
                      <input
                        type="number"
                        value={formData.graduationEnd}
                        onChange={(e) => handleInputChange('graduationEnd', e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="text-slate-900 dark:text-white font-medium">{formData.universityName}</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{formData.degree} in {formData.specialization || 'Specialization'}</p>
                      <p className="text-slate-500 text-sm">
                        {formData.graduationStart && formData.graduationEnd
                          ? `${formData.graduationStart} - ${formData.graduationEnd}`
                          : 'Graduation year not specified'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PROFESSIONAL DETAILS */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                Professional Details
              </h3>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Company</label>
                    <input
                      type="text"
                      value={formData.currentCompany}
                      onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Industry</label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      placeholder="e.g., Technology, Finance"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Years of Experience</label>
                    <input
                      type="number"
                      value={formData.yearsOfExperience}
                      onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Past Companies</label>
                    <input
                      type="text"
                      value={formData.pastCompanies.join(', ')}
                      onChange={(e) => handleArrayChange('pastCompanies', e.target.value)}
                      placeholder="Company A, Company B, Company C"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-500 text-sm">Current Company</p>
                      <p className="text-slate-900 dark:text-white font-medium">{formData.currentCompany || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">Job Title</p>
                      <p className="text-slate-900 dark:text-white font-medium">{formData.jobTitle || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">Industry</p>
                      <p className="text-slate-900 dark:text-white font-medium">{formData.industry || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">Experience</p>
                      <p className="text-slate-900 dark:text-white font-medium">{formData.yearsOfExperience ? `${formData.yearsOfExperience} years` : 'Not specified'}</p>
                    </div>
                  </div>
                  {formData.pastCompanies.length > 0 && (
                    <div>
                      <p className="text-slate-500 text-sm mb-2">Past Companies</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.pastCompanies.map((company, index) => (
                          <span key={index} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm">
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SKILLS SECTION */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Skills & Expertise</h3>
              </div>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">Skills</label>
                    <input
                      type="text"
                      value={formData.skills.join(', ')}
                      onChange={(e) => handleArrayChange('skills', e.target.value)}
                      placeholder="React, Python, Machine Learning, Electronics, etc."
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                    />
                    <p className="text-slate-500 text-sm mt-3">Separate skills with commas</p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700/50">
                  {formData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800 rounded-full text-sm font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-all duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500 text-lg">No skills added yet.</p>
                      <p className="text-slate-400 text-sm mt-2">Add your technical and professional skills to showcase your expertise.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SOCIAL & LINKS */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                Social & Links
              </h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">GitHub</label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                      placeholder="https://github.com/yourusername"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Personal Website</label>
                    <input
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.linkedinUrl && (
                    <a href={formData.linkedinUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 hover:underline transition-colors">
                      <Linkedin className="w-5 h-5" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                  {formData.githubUrl && (
                    <a href={formData.githubUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <Github className="w-5 h-5" />
                      <span>GitHub Profile</span>
                    </a>
                  )}
                  {formData.websiteUrl && (
                    <a href={formData.websiteUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400 hover:underline transition-colors">
                      <Globe className="w-5 h-5" />
                      <span>Personal Website</span>
                    </a>
                  )}
                  <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                    <Mail className="w-5 h-5" />
                    <span>{user.email}</span>
                  </div>
                  {!formData.linkedinUrl && !formData.githubUrl && !formData.websiteUrl && (
                    <p className="text-slate-500 text-sm">No social links added yet.</p>
                  )}
                </div>
              )}
            </div>

            {/* ACHIEVEMENTS & HIGHLIGHTS */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                Achievements & Highlights
              </h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Key Achievements</label>
                    <textarea
                      value={formData.achievements.join('\n')}
                      onChange={(e) => handleArrayChange('achievements', e.target.value)}
                      placeholder="• Led a team of 10 developers&#10;• Published 5 research papers&#10;• Won Best Student Award"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Certifications</label>
                    <input
                      type="text"
                      value={formData.certifications.join(', ')}
                      onChange={(e) => handleArrayChange('certifications', e.target.value)}
                      placeholder="AWS Certified, PMP, Google Cloud Professional"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.achievements.length > 0 && (
                    <div>
                      <p className="text-slate-500 text-sm mb-2">Key Achievements</p>
                      <ul className="space-y-1">
                        {formData.achievements.map((achievement, index) => (
                          <li key={index} className="text-slate-700 dark:text-slate-300 flex items-start">
                            <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {formData.certifications.length > 0 && (
                    <div>
                      <p className="text-slate-500 text-sm mb-2">Certifications</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.certifications.map((cert, index) => (
                          <span key={index} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {formData.achievements.length === 0 && formData.certifications.length === 0 && (
                    <p className="text-slate-500 text-sm">No achievements or certifications added yet.</p>
                  )}
                </div>
              )}
            </div>

            {/* ACTIVITY / CONTRIBUTIONS */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                Activity & Contributions
              </h3>
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">Activity tracking coming soon.</p>
              </div>
            </div>

            {/* ACCOUNT SETTINGS (Only for own profile) */}
            {!userId && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => setShowAccountSettings(!showAccountSettings)}
                  className="w-full flex items-center justify-between text-lg font-bold text-slate-900 dark:text-white"
                >
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-slate-500" />
                    Account Settings
                  </div>
                  {showAccountSettings ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {showAccountSettings && (
                  <div className="mt-6 space-y-6 animate-fadeIn">
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700/50">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Change Password</h4>
                      <div className="space-y-4">
                        <input
                          type="password"
                          placeholder="Current Password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                        <button
                          onClick={handlePasswordChange}
                          className="w-full py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 font-semibold"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
                      <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Deleting your account is permanent. All your data including connections and messages will be wiped out.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 bg-white dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/40 text-sm font-semibold transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};