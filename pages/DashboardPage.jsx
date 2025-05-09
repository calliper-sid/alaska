import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { Search, Star, Clock, Terminal, Users, ArrowRight } from 'lucide-react';

const DashboardPage = () => {
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data - in a real app, this would come from an API/Supabase
  const [topics, setTopics] = useState([
    { id: 1, title: 'Arrays', difficulty: 'Easy', questions: 42, icon: '📊' },
    { id: 2, title: 'Linked Lists', difficulty: 'Medium', questions: 28, icon: '🔗' },
    { id: 3, title: 'Trees', difficulty: 'Hard', questions: 35, icon: '🌳' },
    { id: 4, title: 'Graphs', difficulty: 'Hard', questions: 23, icon: '📈' },
    { id: 5, title: 'Dynamic Programming', difficulty: 'Hard', questions: 31, icon: '🧮' },
    { id: 6, title: 'Sorting', difficulty: 'Medium', questions: 19, icon: '📋' },
    { id: 7, title: 'Searching', difficulty: 'Easy', questions: 15, icon: '🔍' },
    { id: 8, title: 'Greedy Algorithms', difficulty: 'Medium', questions: 22, icon: '🤑' },
  ]);
  
  const filteredTopics = topics.filter(topic => 
    topic.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sample user stats - would come from Supabase
  const rating = 1250;
  const progress = 65; // percentage

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-600';
      case 'medium':
        return 'bg-yellow-600';
      case 'hard':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* User Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Rating Card */}
          <div className="card bg-gradient-to-br from-indigo-900 to-indigo-700">
            <div className="flex items-center">
              <Star className="text-yellow-400 h-10 w-10" />
              <div className="ml-4">
                <h3 className="text-lg text-gray-300">Your Rating</h3>
                <p className="text-3xl font-bold text-white">{rating}</p>
              </div>
            </div>
          </div>
          
          {/* Progress Card */}
          <div className="card">
            <h3 className="text-lg text-gray-300 mb-3">Your Progress</h3>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-4 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">
              You've completed {progress}% of your learning goals
            </p>
          </div>
          
          {/* Quick Actions Card */}
          <div className="card">
            <h3 className="text-lg text-gray-300 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/mocktest" className="btn-secondary flex items-center justify-center">
                <Terminal size={16} className="mr-2" />
                AI Mocktest
              </Link>
              <Link to="/join-room" className="btn-secondary flex items-center justify-center">
                <Users size={16} className="mr-2" />
                Join a Room
              </Link>
            </div>
          </div>
        </div>
        
        {/* Test Your Skills Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Test Your Skills</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 py-2 text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTopics.map(topic => (
              <div key={topic.id} className="card hover:bg-gray-750 transition-all duration-200 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-3xl">{topic.icon}</div>
                  <span className={`${getDifficultyColor(topic.difficulty)} text-xs font-medium px-2.5 py-0.5 rounded`}>
                    {topic.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{topic.title}</h3>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {topic.questions} questions
                  </span>
                  <Link 
                    to={`/mocktest?topic=${topic.title.toLowerCase()}`}
                    className="text-indigo-400 group-hover:text-indigo-300 flex items-center"
                  >
                    Practice
                    <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Activity Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          
          <div className="card">
            <div className="text-gray-400 text-center py-10">
              <Clock className="h-10 w-10 mx-auto mb-3 text-gray-500" />
              <p className="text-lg">No recent activity found</p>
              <p className="mt-2">Start practicing to track your progress</p>
              <Link to="/mocktest" className="btn-primary mt-4 inline-block">
                Take an AI Mock Test
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;