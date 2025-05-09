import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Navbar from '../components/Navbar';
import { User, Mail, Calendar, School, Code, BookOpen, Award, BarChart2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, profile, updateProfile } = useAuth();
  const { showToast } = useToast();
  
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    gender: profile?.gender || 'male',
    dob: profile?.dob || '',
    skill_level: profile?.skill_level || 'beginner',
    college_name: profile?.college_name || '',
    preferred_language: profile?.preferred_language || 'cpp'
  });
  const [loading, setLoading] = useState(false);
  
  // Sample user stats (in a real app, these would come from Supabase)
  const stats = {
    rating: 1250,
    contests_participated: 12,
    problems_solved: 47,
    submissions: 82,
    success_rate: 68 // percentage
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const getSkillLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-600';
      case 'intermediate':
        return 'bg-blue-600';
      case 'advanced':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
          <User className="mr-3 text-indigo-500" />
          Profile
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Profile Information</h2>
                
                {!editing && (
                  <button 
                    onClick={() => setEditing(true)}
                    className="btn-secondary text-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              
              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Gender
                      </label>
                      <div className="flex space-x-6">
                        <div className="flex items-center">
                          <input
                            id="gender-male"
                            name="gender"
                            type="radio"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
                          />
                          <label htmlFor="gender-male" className="ml-2 block text-sm text-gray-300">
                            Male
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="gender-female"
                            name="gender"
                            type="radio"
                            value="female"
                            checked={formData.gender === 'female'}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
                          />
                          <label htmlFor="gender-female" className="ml-2 block text-sm text-gray-300">
                            Female
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="gender-other"
                            name="gender"
                            type="radio"
                            value="other"
                            checked={formData.gender === 'other'}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
                          />
                          <label htmlFor="gender-other" className="ml-2 block text-sm text-gray-300">
                            Other
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="dob" className="block text-sm font-medium text-gray-300 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="skill_level" className="block text-sm font-medium text-gray-300 mb-1">
                        Skill Level
                      </label>
                      <select
                        id="skill_level"
                        name="skill_level"
                        value={formData.skill_level}
                        onChange={handleChange}
                        required
                        className="select-field"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="college_name" className="block text-sm font-medium text-gray-300 mb-1">
                        College Name
                      </label>
                      <input
                        type="text"
                        id="college_name"
                        name="college_name"
                        value={formData.college_name}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="preferred_language" className="block text-sm font-medium text-gray-300 mb-1">
                        Preferred Programming Language
                      </label>
                      <select
                        id="preferred_language"
                        name="preferred_language"
                        value={formData.preferred_language}
                        onChange={handleChange}
                        required
                        className="select-field"
                      >
                        <option value="c">C</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1 flex justify-center items-center"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <User size={20} className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-400">Full Name</div>
                        <div className="text-white font-medium">{profile?.full_name || 'Not set'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail size={20} className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-400">Email</div>
                        <div className="text-white font-medium">{user?.email || 'Not set'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <User size={20} className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-400">Username</div>
                        <div className="text-white font-medium">{profile?.username || 'Not set'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar size={20} className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-400">Date of Birth</div>
                        <div className="text-white font-medium">{profile?.dob || 'Not set'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <School size={20} className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-400">College</div>
                        <div className="text-white font-medium">{profile?.college_name || 'Not set'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Code size={20} className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-400">Preferred Language</div>
                        <div className="text-white font-medium">
                          {profile?.preferred_language === 'cpp' ? 'C++' : 
                           profile?.preferred_language === 'c' ? 'C' : 
                           profile?.preferred_language === 'java' ? 'Java' : 
                           'Not set'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <BookOpen size={20} className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-400">Skill Level</div>
                        <div>
                          <span className={`${getSkillLevelColor(profile?.skill_level || 'beginner')} text-white text-xs font-medium px-2.5 py-0.5 rounded capitalize`}>
                            {profile?.skill_level || 'beginner'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <BarChart2 className="mr-2 text-indigo-400" />
                Your Stats
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="text-gray-300">Rating</span>
                  </div>
                  <span className="text-lg font-semibold text-white">{stats.rating}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-400 mr-2" />
                    <span className="text-gray-300">Contests</span>
                  </div>
                  <span className="text-lg font-semibold text-white">{stats.contests_participated}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <Code className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-gray-300">Problems Solved</span>
                  </div>
                  <span className="text-lg font-semibold text-white">{stats.problems_solved}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-purple-400 mr-2" />
                    <span className="text-gray-300">Submissions</span>
                  </div>
                  <span className="text-lg font-semibold text-white">{stats.submissions}</span>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">Success Rate</span>
                    <span className="text-sm text-gray-300">{stats.success_rate}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${stats.success_rate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;