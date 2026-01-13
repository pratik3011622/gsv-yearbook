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

          {/* LEFT COLUMN - PROFILE INFO */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Profile Photo & Basic Info */}
              <div className="text-center lg:text-left mb-8">
                <div className="relative inline-block mb-6">
                  {profilePhotoPreview || displayProfile?.avatarUrl ? (
                    <img
                      key={profilePhotoPreview || displayProfile?.avatarUrl}
                      src={profilePhotoPreview || (displayProfile.avatarUrl?.startsWith('http') ? displayProfile.avatarUrl : `${staticBaseURL}${displayProfile.avatarUrl}`)}
                      alt="Profile"
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover grayscale-0"
                    />
                  ) : (
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-5xl font-serif text-slate-400">
                      {formData.fullName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                  {isEditing && (
                    <button
                      onClick={handlePhotoUpload}
                      className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full hover:bg-slate-800 transition-colors"
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

                <div className="space-y-2">
                  <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
                    {formData.fullName || 'Your Name'}
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                    {formData.jobTitle && formData.currentCompany
                      ? `${formData.jobTitle} at ${formData.currentCompany}`
                      : 'Professional Title'
                    }
                  </p>
                  <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">
                    Batch of {formData.batchYear || '20XX'} • {formData.department || 'Department'}
                  </p>

                  {formData.location && (
                    <div className="flex items-center justify-center lg:justify-start text-slate-500 pt-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{formData.location}, {formData.country}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Completion (Simplified) */}
              <div className="mb-8 py-6 border-t border-b border-slate-200 dark:border-slate-800/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile Complete</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1">
                  <div
                    className="bg-slate-900 dark:bg-white h-1 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2 border border-slate-900 dark:border-white text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all flex items-center justify-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="w-full py-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-red-500 hover:text-red-600 dark:hover:text-red-400 text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - DETAILED INFORMATION */}
          <div className="lg:col-span-2 space-y-6">

            {/* ABOUT SECTION */}
            {/* ABOUT SECTION */}
            <div className="pb-8 border-b border-slate-200 dark:border-slate-800/50">
              <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6">About</h3>
              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tagline</label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => handleInputChange('tagline', e.target.value)}
                      placeholder="A short personal quote or tagline"
                      className="w-full p-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:border-black dark:focus:border-white transition-colors outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about your journey..."
                      className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 border-0 resize-none"
                      rows={5}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.tagline && (
                    <p className="text-xl text-slate-900 dark:text-white font-serif italic">"{formData.tagline}"</p>
                  )}
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-light">
                    {formData.bio || 'No bio added yet. Share your story with the community.'}
                  </p>
                </div>
              )}
            </div>

            {/* EDUCATION DETAILS */}
            {/* EDUCATION DETAILS */}
            <div className="py-8 border-b border-slate-200 dark:border-slate-800/50">
              <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6">Education</h3>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">University</label>
                    <input
                      type="text"
                      value={formData.universityName}
                      onChange={(e) => handleInputChange('universityName', e.target.value)}
                      className="w-full p-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-black dark:focus:border-white outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Degree</label>
                    <input
                      type="text"
                      value={formData.degree}
                      onChange={(e) => handleInputChange('degree', e.target.value)}
                      className="w-full p-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-black dark:focus:border-white outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Specialization</label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      className="w-full p-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-black dark:focus:border-white outline-none transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Start</label>
                      <input
                        type="number"
                        value={formData.graduationStart}
                        onChange={(e) => handleInputChange('graduationStart', e.target.value)}
                        className="w-full p-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-black dark:focus:border-white outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">End</label>
                      <input
                        type="number"
                        value={formData.graduationEnd}
                        onChange={(e) => handleInputChange('graduationEnd', e.target.value)}
                        className="w-full p-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-black dark:focus:border-white outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mr-4 shrink-0">
                    <GraduationCap className="w-6 h-6 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{formData.universityName}</h4>
                    <p className="text-slate-600 dark:text-slate-400">{formData.degree} in {formData.specialization || 'Specialization'}</p>
                    <p className="text-slate-500 text-sm mt-1 font-medium">
                      {formData.graduationStart && formData.graduationEnd
                        ? `${formData.graduationStart} - ${formData.graduationEnd}`
                        : 'Year not specified'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* PROFESSIONAL DETAILS */}
            {/* PROFESSIONAL DETAILS */}
            <div className="py-8 border-b border-slate-200 dark:border-slate-800/50">
              <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6">Experience</h3>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Current Company</label>
                    <input
                      type="text"
                      value={formData.currentCompany}
                      onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                      className="w-full p-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      className="w-full p-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">History</label>
                    <input
                      type="text"
                      value={formData.pastCompanies.join(', ')}
                      onChange={(e) => handleArrayChange('pastCompanies', e.target.value)}
                      placeholder="Previous companies separated by comma"
                      className="w-full p-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mr-4 shrink-0">
                      <Briefcase className="w-6 h-6 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{formData.currentCompany || 'Not specified'}</h4>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">{formData.jobTitle || 'Role'}</p>
                      <p className="text-slate-500 text-sm mt-1">{formData.industry}</p>
                    </div>
                  </div>

                  {formData.pastCompanies.length > 0 && (
                    <div className="pl-16">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Previously</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.pastCompanies.map((company, index) => (
                          <span key={index} className="text-slate-600 dark:text-slate-400 text-sm font-medium bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded">
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
            {/* SKILLS SECTION */}
            <div className="py-8 border-b border-slate-200 dark:border-slate-800/50">
              <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6">Expertise</h3>
              {isEditing ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Skills</label>
                  <input
                    type="text"
                    value={formData.skills.join(', ')}
                    onChange={(e) => handleArrayChange('skills', e.target.value)}
                    className="w-full p-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>
              ) : (
                <div>
                  {formData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="text-lg font-medium text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 pb-1"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No skills added yet.</p>
                  )}
                </div>
              )}
            </div>

            {/* SOCIAL & LINKS */}
            {/* SOCIAL & LINKS */}
            <div className="py-8">
              <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6">Connect</h3>
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    placeholder="LinkedIn URL"
                    className="w-full p-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                    placeholder="GitHub URL"
                    className="w-full p-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              ) : (
                <div className="flex gap-6">
                  {formData.linkedinUrl && (
                    <a href={formData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Linkedin className="w-6 h-6" />
                    </a>
                  )}
                  {formData.githubUrl && (
                    <a href={formData.githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                      <Github className="w-6 h-6" />
                    </a>
                  )}
                  {formData.websiteUrl && (
                    <a href={formData.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-slate-900 dark:text-white hover:text-emerald-500 transition-colors">
                      <Globe className="w-6 h-6" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* ACHIEVEMENTS & HIGHLIGHTS */}
            {/* ACHIEVEMENTS & HIGHLIGHTS */}
            {/* Reduced visibility as requested for clean layout, or kept minimal if data exists */}
            {formData.achievements.length > 0 && (
              <div className="py-8 border-b border-slate-200 dark:border-slate-800/50">
                <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6">Achievements</h3>
                <ul className="space-y-2">
                  {formData.achievements.map((achievement, index) => (
                    <li key={index} className="text-slate-700 dark:text-slate-300 flex items-start">
                      <span className="text-slate-400 mr-2">•</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

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