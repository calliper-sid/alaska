import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Navbar from '../components/Navbar';
import { Users, Key, Search } from 'lucide-react';
import { supabase, joinRoom } from '../lib/supabase';

const JoinRoomPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Sample active rooms (in a real app, this would come from Supabase)
  const [activeRooms, setActiveRooms] = useState([
    {
      id: 1,
      name: "Algorithm Challenge",
      host: "Coder123",
      participants: 3,
      max_participants: 5,
      programming_language: "C++",
      is_private: false
    },
    {
      id: 2,
      name: "DSA Practice Room",
      host: "JavaMaster",
      participants: 2,
      max_participants: 4,
      programming_language: "Java",
      is_private: true
    },
    {
      id: 3,
      name: "Beginner Friendly Coding",
      host: "CodeTeacher",
      participants: 7,
      max_participants: 10,
      programming_language: "C",
      is_private: false
    }
  ]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, check if the room exists and validate password
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_id', roomId)
        .single();
      
      if (roomError) throw new Error('Room not found');
      
      if (room.is_private && room.password !== password) {
        throw new Error('Invalid password');
      }
      
      // Check if the room is full
      const { data: participants, error: participantsError } = await supabase
        .from('room_participants')
        .select('count', { count: 'exact' })
        .eq('room_id', room.id);
      
      if (participantsError) throw participantsError;
      
      if (participants.count >= room.max_participants) {
        throw new Error('Room is full');
      }
      
      // Join the room
      await joinRoom(room.id, user.id);
      
      showToast('Joined room successfully!', 'success');
      navigate(`/room/${room.id}`);
    } catch (error) {
      console.error('Error joining room:', error);
      showToast(error.message || 'Failed to join room', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleJoinActiveRoom = (room) => {
    // In a real app, this would also check if the room requires a password
    if (room.is_private) {
      setRoomId(room.id.toString());
      showToast('This room requires a password', 'info');
    } else {
      // Direct join for public rooms
      navigate(`/room/${room.id}`);
      showToast('Joined room successfully!', 'success');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
          <Users className="mr-3 text-indigo-500" />
          Join Room
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Join by ID Form */}
          <div className="card lg:col-span-1">
            <h2 className="text-xl font-bold text-white mb-6">Join by Room ID</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="roomId" className="block text-sm font-medium text-gray-300 mb-1">
                  Room ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="roomId"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter room ID"
                    required
                    className="input-field pl-9"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password (if required)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter room password"
                    className="input-field pl-9"
                  />
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Joining...
                  </>
                ) : (
                  'Join Room'
                )}
              </button>
            </form>
          </div>
          
          {/* Active Rooms List */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-6">Active Rooms</h2>
              
              {activeRooms.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400">No active rooms found</p>
                  <button className="btn-primary mt-4">Refresh</button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3">Room Name</th>
                        <th scope="col" className="px-6 py-3">Host</th>
                        <th scope="col" className="px-6 py-3">Language</th>
                        <th scope="col" className="px-6 py-3">Participants</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeRooms.map((room) => (
                        <tr key={room.id} className="border-b border-gray-700">
                          <td className="px-6 py-4 font-medium whitespace-nowrap">
                            {room.name}
                            {room.is_private && (
                              <span className="ml-2 bg-yellow-600 text-xs font-medium px-2.5 py-0.5 rounded">
                                Private
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">{room.host}</td>
                          <td className="px-6 py-4">{room.programming_language}</td>
                          <td className="px-6 py-4">
                            {room.participants}/{room.max_participants}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleJoinActiveRoom(room)}
                              className="font-medium text-indigo-400 hover:underline"
                            >
                              Join
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JoinRoomPage;