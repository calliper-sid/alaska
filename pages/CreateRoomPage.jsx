import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Navbar from '../components/Navbar';
import { PlusSquare, Lock, Users, Clock, Send } from 'lucide-react';
import { createRoom } from '../lib/supabase';

const CreateRoomPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    room_id: generateRoomId(),
    max_participants: 5,
    password: '',
    duration_minutes: 60,
    is_private: false,
    programming_language: 'cpp',
    difficulty: 'medium'
  });
  const [loading, setLoading] = useState(false);
  
  function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Add host_id to the form data
      const roomData = {
        ...formData,
        host_id: user.id,
        created_at: new Date().toISOString()
      };
      
      const room = await createRoom(roomData);
      showToast('Room created successfully!', 'success');
      navigate(`/room/${room.id}`);
    } catch (error) {
      console.error('Error creating room:', error);
      showToast(error.message || 'Failed to create room', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const regenerateRoomId = () => {
    setFormData(prev => ({
      ...prev,
      room_id: generateRoomId()
    }));
  };
  
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
          <PlusSquare className="mr-3 text-indigo-500" />
          Create Room
        </h1>
        
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Coding Challenge #1"
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="room_id" className="block text-sm font-medium text-gray-300 mb-1">
                  Room ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="room_id"
                    name="room_id"
                    value={formData.room_id}
                    onChange={handleChange}
                    readOnly
                    className="input-field pr-24"
                  />
                  <button
                    type="button"
                    onClick={regenerateRoomId}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded"
                  >
                    Regenerate
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Share this ID with participants to join
                </p>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave empty for no password"
                    className="input-field pl-9"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="max_participants" className="block text-sm font-medium text-gray-300 mb-1">
                  Max Participants
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="max_participants"
                    name="max_participants"
                    min="2"
                    max="20"
                    value={formData.max_participants}
                    onChange={handleChange}
                    required
                    className="input-field pl-9"
                  />
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-300 mb-1">
                  Duration (minutes)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="duration_minutes"
                    name="duration_minutes"
                    min="10"
                    max="180"
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    required
                    className="input-field pl-9"
                  />
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="programming_language" className="block text-sm font-medium text-gray-300 mb-1">
                  Programming Language
                </label>
                <select
                  id="programming_language"
                  name="programming_language"
                  value={formData.programming_language}
                  onChange={handleChange}
                  required
                  className="select-field"
                >
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="java">Java</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-1">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  required
                  className="select-field"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div className="flex items-center col-span-1 md:col-span-2">
                <input
                  type="checkbox"
                  id="is_private"
                  name="is_private"
                  checked={formData.is_private}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="is_private" className="ml-2 block text-sm text-gray-300">
                  Make this room private (only people with password can join)
                </label>
              </div>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center py-3"
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Room...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Create Room
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateRoomPage;