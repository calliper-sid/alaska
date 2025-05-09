import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Navbar from '../components/Navbar';
import CodeEditor from '../components/CodeEditor';
import { Users, Clock, Play, Crown, Award, ArrowLeft } from 'lucide-react';
import { getRoomById, getRoomParticipants } from '../lib/supabase';

const RoomPage = () => {
  const { id: roomId } = useParams();
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // in seconds
  const [roomStatus, setRoomStatus] = useState('waiting'); // waiting, active, finished
  const [code, setCode] = useState('');
  const [codeResult, setCodeResult] = useState(null);
  
  // Sample question (in a real app, this would come from the room data in Supabase)
  const [question, setQuestion] = useState({
    title: "Palindrome Checker",
    description: "Write a function that checks if a given string is a palindrome. A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward, ignoring spaces, case, and punctuation.",
    examples: [
      { input: "racecar", output: "true" },
      { input: "hello", output: "false" },
      { input: "A man, a plan, a canal: Panama", output: "true" }
    ]
  });
  
  // Sample default code template
  const defaultCode = `#include <iostream>
#include <string>
#include <algorithm>

using namespace std;

bool isPalindrome(string s) {
    // Your solution here
}

int main() {
    string input = "racecar";
    bool result = isPalindrome(input);
    cout << (result ? "true" : "false") << endl;
    return 0;
}`;
  
  // Sample scoreboard data
  const [scoreboard, setScoreboard] = useState([
    { 
      id: 1, 
      username: "JavaMaster", 
      score: 85, 
      time_taken: "12:45", 
      status: "completed" 
    },
    { 
      id: 2, 
      username: "CodeNinja", 
      score: 92, 
      time_taken: "10:21", 
      status: "completed" 
    },
    { 
      id: 3, 
      username: "AlgoExpert", 
      score: 78, 
      time_taken: "15:07", 
      status: "completed" 
    },
    { 
      id: 4, 
      username: "DevPro", 
      score: null, 
      time_taken: null, 
      status: "in_progress" 
    }
  ]);
  
  useEffect(() => {
    fetchRoomData();
  }, [roomId]);
  
  const fetchRoomData = async () => {
    try {
      // Fetch room data
      const roomData = await getRoomById(roomId);
      setRoom(roomData);
      setIsHost(roomData.host_id === user.id);
      
      // Fetch participants
      const participantsData = await getRoomParticipants(roomId);
      setParticipants(participantsData);
      
      // Initialize code editor
      setCode(defaultCode);
      
      // Set timer based on room duration
      if (roomData.duration_minutes) {
        setTimeLeft(roomData.duration_minutes * 60);
      }
      
      // Set room status
      if (roomData.status) {
        setRoomStatus(roomData.status);
      }
    } catch (error) {
      console.error('Error fetching room data:', error);
      showToast('Failed to load room data', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Format time from seconds to MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const startRoom = () => {
    if (!isHost) return;
    
    // In a real app, update the room status in Supabase
    setRoomStatus('active');
    showToast('The competition has started!', 'success');
    
    // Start the timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRoomStatus('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Clean up the timer when component unmounts
    return () => clearInterval(timer);
  };
  
  const runCode = () => {
    // In a real app, this would evaluate the code and update the score
    setCodeResult({
      output: "true",
      error: null,
      passed: true
    });
    
    showToast('Your solution has been submitted!', 'success');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="mr-3 hover:bg-gray-800 p-1 rounded-full"
            >
              <ArrowLeft size={24} className="text-gray-400" />
            </button>
            {room?.name || 'Coding Room'}
          </h1>
          
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full ${roomStatus === 'waiting' ? 'bg-yellow-600' : roomStatus === 'active' ? 'bg-green-600' : 'bg-red-600'}`}>
              <span className="text-sm font-medium">
                {roomStatus === 'waiting' ? 'Waiting to Start' : roomStatus === 'active' ? 'In Progress' : 'Finished'}
              </span>
            </div>
            
            <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
              <Clock size={16} className="mr-2 text-gray-400" />
              <span className={`font-mono font-medium ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Participants & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Room Info Card */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Users size={18} className="mr-2 text-indigo-400" />
                Participants
              </h2>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {participants.map((participant, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      {isHost && participant.user_id === room.host_id && (
                        <Crown size={14} className="mr-1 text-yellow-400" />
                      )}
                      <span>{participant.profiles?.username || `User ${index + 1}`}</span>
                    </div>
                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                      {participant.profiles?.skill_level || 'beginner'}
                    </span>
                  </div>
                ))}
              </div>
              
              {participants.length === 0 && (
                <p className="text-gray-400 text-center py-2">No participants yet</p>
              )}
              
              {isHost && roomStatus === 'waiting' && (
                <button 
                  onClick={startRoom}
                  className="btn-primary w-full mt-4 flex items-center justify-center"
                >
                  <Play size={16} className="mr-2" />
                  Start Competition
                </button>
              )}
              
              {!isHost && roomStatus === 'waiting' && (
                <div className="mt-4 text-sm text-center text-gray-400">
                  Waiting for host to start the competition...
                </div>
              )}
            </div>
            
            {/* Scoreboard Card - visible when competition is active or finished */}
            {(roomStatus === 'active' || roomStatus === 'finished') && (
              <div className="card">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Award size={18} className="mr-2 text-indigo-400" />
                  Scoreboard
                </h2>
                
                <div className="space-y-3">
                  {scoreboard.sort((a, b) => (b.score || 0) - (a.score || 0)).map((participant, index) => (
                    <div key={participant.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-700 last:border-b-0">
                      <div className="flex items-center">
                        <span className={`inline-block w-5 text-center font-semibold ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                          {index + 1}
                        </span>
                        <span className="ml-2">{participant.username}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {participant.status === 'completed' ? (
                          <>
                            <span className="text-green-400">{participant.score}</span>
                            <span className="text-xs text-gray-400">{participant.time_taken}</span>
                          </>
                        ) : (
                          <span className="text-xs italic text-gray-400">In progress</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Main Content Area - Question and Code Editor */}
          <div className="lg:col-span-3 space-y-6">
            {roomStatus === 'waiting' ? (
              <div className="card flex flex-col items-center justify-center py-16">
                <Clock size={48} className="text-gray-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Waiting to Start</h2>
                <p className="text-gray-400 text-center max-w-md">
                  The competition will begin once the host starts it. Get ready to code!
                </p>
              </div>
            ) : (
              <>
                {/* Question Card */}
                <div className="card">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-white">{question.title}</h2>
                  </div>
                  
                  <div className="prose prose-invert max-w-none mb-4">
                    <p className="text-gray-300">
                      {question.description}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-md font-medium text-gray-300">Examples:</h3>
                    {question.examples.map((example, index) => (
                      <div key={index} className="bg-gray-800 p-3 rounded-md">
                        <div className="mb-1">
                          <span className="text-gray-400 text-sm">Input: </span>
                          <code className="text-green-400">{example.input}</code>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Output: </span>
                          <code className="text-green-400">{example.output}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Code Editor */}
                <CodeEditor
                  code={code}
                  setCode={setCode}
                  language={room?.programming_language || 'cpp'}
                  onRun={runCode}
                  result={codeResult}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoomPage;