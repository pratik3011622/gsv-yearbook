import { useState, useEffect } from 'react';
import {
  User, Edit3, Save, X, Camera, MapPin, Briefcase, GraduationCap,
  Mail, Globe, Linkedin, Github, Award, Calendar, CheckCircle,
  LogOut, Settings, ChevronDown, ChevronUp, Plus, Minus, BookOpen,
  TrendingUp, Users, Star, Shield, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

export const ProfilePage = ({ onNavigate }) => {
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
    if (profile) {
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
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Please login to view your profile
          </h2>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 rounded-lg font-semibold hover:shadow-lg transition-all"
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
    <div className="min-h-screen pt-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN - PROFILE CARD */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden hover:shadow-amber-500/10 transition-all duration-300">
              {/* Profile Header */}
              <div className="relative h-32 bg-gradient-to-r from-slate-800 to-slate-900">
                <div className="absolute -bottom-12 left-6">
                  <div className="relative">
                    {profilePhotoPreview || profile?.avatarUrl ? (
                      <img
                        src={profilePhotoPreview || `${api.baseURL}${profile.avatarUrl}`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-slate-900 shadow-lg object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-2xl font-bold text-slate-900 border-4 border-slate-900 shadow-lg">
                        {formData.fullName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                    {isEditing && (
                      <button
                        onClick={handlePhotoUpload}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-amber-500 text-slate-900 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors shadow-lg"
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
                  <h2 className="text-xl font-bold text-white mb-1">{formData.fullName || 'Your Name'}</h2>
                  <p className="text-amber-400 text-sm mb-2">
                    {formData.jobTitle && formData.currentCompany
                      ? `${formData.jobTitle} at ${formData.currentCompany}`
                      : 'Professional Title'
                    }
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-slate-400">
                    <span>Batch of {formData.batchYear || '20XX'}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-sm text-slate-400 mt-1">
                    <span>{formData.department || 'Department'}</span>
                  </div>
                  {formData.location && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-slate-400 mt-2">
                      <MapPin className="w-4 h-4" />
                      <span>{formData.location}, {formData.country}</span>
                    </div>
                  )}
                </div>

                {/* Profile Completion */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">Profile Completion</span>
                    <span className="text-sm text-amber-400">{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="w-full py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-slate-800 text-slate-300 rounded-lg font-semibold hover:bg-slate-700 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
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
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-700/50 p-8 hover:shadow-amber-500/20 hover:border-amber-400/40 transition-all duration-500">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-900" />
                </div>
                <h3 className="text-2xl font-bold text-white">About</h3>
              </div>
              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Tagline</label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => handleInputChange('tagline', e.target.value)}
                      placeholder="A short personal quote or tagline"
                      className="w-full p-4 bg-slate-800/80 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about your journey, experiences, and aspirations..."
                      className="w-full p-4 bg-slate-800/80 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all duration-300"
                      rows={5}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.tagline && (
                    <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl p-4">
                      <p className="text-amber-300 font-medium italic text-lg">"{formData.tagline}"</p>
                    </div>
                  )}
                  <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
                    <p className="text-slate-300 leading-relaxed text-base">
                      {formData.bio || 'No bio added yet. Share your story with the community.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* EDUCATION DETAILS */}
            <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 hover:shadow-amber-500/10 transition-all duration-300">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-amber-400" />
                Education Details
              </h3>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">University</label>
                    <input
                      type="text"
                      value={formData.universityName}
                      onChange={(e) => handleInputChange('universityName', e.target.value)}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Degree</label>
                    <input
                      type="text"
                      value={formData.degree}
                      onChange={(e) => handleInputChange('degree', e.target.value)}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Specialization</label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      placeholder="e.g., Computer Science"
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Start Year</label>
                      <input
                        type="number"
                        value={formData.graduationStart}
                        onChange={(e) => handleInputChange('graduationStart', e.target.value)}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">End Year</label>
                      <input
                        type="number"
                        value={formData.graduationEnd}
                        onChange={(e) => handleInputChange('graduationEnd', e.target.value)}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="text-white font-medium">{formData.universityName}</p>
                      <p className="text-slate-400 text-sm">{formData.degree} in {formData.specialization || 'Specialization'}</p>
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
            <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 hover:shadow-amber-500/10 transition-all duration-300">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-amber-400" />
                Professional Details
              </h3>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Current Company</label>
                    <input
                      type="text"
                      value={formData.currentCompany}
                      onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Industry</label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      placeholder="e.g., Technology, Finance"
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Years of Experience</label>
                    <input
                      type="number"
                      value={formData.yearsOfExperience}
                      onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Past Companies</label>
                    <input
                      type="text"
                      value={formData.pastCompanies.join(', ')}
                      onChange={(e) => handleArrayChange('pastCompanies', e.target.value)}
                      placeholder="Company A, Company B, Company C"
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Current Company</p>
                      <p className="text-white font-medium">{formData.currentCompany || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Job Title</p>
                      <p className="text-white font-medium">{formData.jobTitle || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Industry</p>
                      <p className="text-white font-medium">{formData.industry || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Experience</p>
                      <p className="text-white font-medium">{formData.yearsOfExperience ? `${formData.yearsOfExperience} years` : 'Not specified'}</p>
                    </div>
                  </div>
                  {formData.pastCompanies.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Past Companies</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.pastCompanies.map((company, index) => (
                          <span key={index} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm">
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
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-700/50 p-8 hover:shadow-amber-500/20 hover:border-amber-400/40 transition-all duration-500">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-slate-900" />
                </div>
                <h3 className="text-2xl font-bold text-white">Skills & Expertise</h3>
              </div>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Skills</label>
                    <input
                      type="text"
                      value={formData.skills.join(', ')}
                      onChange={(e) => handleArrayChange('skills', e.target.value)}
                      placeholder="React, Python, Machine Learning, Electronics, etc."
                      className="w-full p-4 bg-slate-800/80 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                    />
                    <p className="text-slate-400 text-sm mt-3">Separate skills with commas</p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
                  {formData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30 rounded-full text-sm font-semibold hover:bg-amber-500/30 hover:border-amber-500/50 transition-all duration-300 hover:scale-105"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg">No skills added yet.</p>
                      <p className="text-slate-500 text-sm mt-2">Add your technical and professional skills to showcase your expertise.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SOCIAL & LINKS */}
            <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 hover:shadow-amber-500/10 transition-all duration-300">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-amber-400" />
                Social & Links
              </h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">GitHub</label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                      placeholder="https://github.com/yourusername"
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Personal Website</label>
                    <input
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.linkedinUrl && (
                    <a href={formData.linkedinUrl} target="_blank" rel="noopener noreferrer"
                       className="flex items-center space-x-3 text-blue-400 hover:text-blue-300 transition-colors">
                      <Linkedin className="w-5 h-5" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                  {formData.githubUrl && (
                    <a href={formData.githubUrl} target="_blank" rel="noopener noreferrer"
                       className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors">
                      <Github className="w-5 h-5" />
                      <span>GitHub Profile</span>
                    </a>
                  )}
                  {formData.websiteUrl && (
                    <a href={formData.websiteUrl} target="_blank" rel="noopener noreferrer"
                       className="flex items-center space-x-3 text-green-400 hover:text-green-300 transition-colors">
                      <Globe className="w-5 h-5" />
                      <span>Personal Website</span>
                    </a>
                  )}
                  <div className="flex items-center space-x-3 text-slate-400">
                    <Mail className="w-5 h-5" />
                    <span>{user.email}</span>
                  </div>
                  {!formData.linkedinUrl && !formData.githubUrl && !formData.websiteUrl && (
                    <p className="text-slate-400">No social links added yet. Connect your professional profiles.</p>
                  )}
                </div>
              )}
            </div>

            {/* ACHIEVEMENTS & HIGHLIGHTS */}
            <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 hover:shadow-amber-500/10 transition-all duration-300">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-amber-400" />
                Achievements & Highlights
              </h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Key Achievements</label>
                    <textarea
                      value={formData.achievements.join('\n')}
                      onChange={(e) => handleArrayChange('achievements', e.target.value)}
                      placeholder="• Led a team of 10 developers&#10;• Published 5 research papers&#10;• Won Best Student Award"
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Certifications</label>
                    <input
                      type="text"
                      value={formData.certifications.join(', ')}
                      onChange={(e) => handleArrayChange('certifications', e.target.value)}
                      placeholder="AWS Certified, PMP, Google Cloud Professional"
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.achievements.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Key Achievements</p>
                      <ul className="space-y-1">
                        {formData.achievements.map((achievement, index) => (
                          <li key={index} className="text-slate-300 flex items-start">
                            <span className="text-amber-400 mr-2">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {formData.certifications.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Certifications</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.certifications.map((cert, index) => (
                          <span key={index} className="px-3 py-1 bg-slate-800 text-amber-300 border border-amber-500/30 rounded-full text-sm">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {formData.achievements.length === 0 && formData.certifications.length === 0 && (
                    <p className="text-slate-400">No achievements or certifications added yet. Showcase your accomplishments.</p>
                  )}
                </div>
              )}
            </div>

            {/* ACTIVITY / CONTRIBUTIONS */}
            <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 hover:shadow-amber-500/10 transition-all duration-300">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-amber-400" />
                Activity & Contributions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-800 rounded-lg">
                  <BookOpen className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-slate-400 text-sm">Stories Published</p>
                </div>
                <div className="text-center p-4 bg-slate-800 rounded-lg">
                  <Briefcase className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-slate-400 text-sm">Jobs Posted</p>
                </div>
                <div className="text-center p-4 bg-slate-800 rounded-lg">
                  <Users className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-slate-400 text-sm">Events Attended</p>
                </div>
              </div>
            </div>

            {/* ACCOUNT SETTINGS */}
            <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden hover:shadow-amber-500/10 transition-all duration-300">
              <button
                onClick={() => setShowAccountSettings(!showAccountSettings)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              >
                <h3 className="text-lg font-bold text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-amber-400" />
                  Account Settings
                </h3>
                {showAccountSettings ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>

              {showAccountSettings && (
                <div className="px-6 pb-6 space-y-6">
                  {/* Profile Privacy */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Profile Privacy</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-300">Public Profile</p>
                        <p className="text-slate-500 text-sm">Allow others to view your profile</p>
                      </div>
                      {isEditing ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isProfilePublic}
                            onChange={(e) => handleInputChange('isProfilePublic', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-sm ${formData.isProfilePublic ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {formData.isProfilePublic ? 'Public' : 'Private'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Change Password */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Change Password</h4>
                    <div className="space-y-3">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Current password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={handlePasswordChange}
                          className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                        >
                          Change Password
                        </button>
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="border-t border-slate-700 pt-6">
                    <h4 className="text-red-400 font-medium mb-3">Danger Zone</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-300">Delete Account</p>
                        <p className="text-slate-500 text-sm">Permanently delete your account and all data</p>
                      </div>
                      <button
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};