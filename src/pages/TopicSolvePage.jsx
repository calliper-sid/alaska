import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CodeEditor from '../components/CodeEditor';

const dummyQuestions = {
  arrays: [
    {
      title: 'Find Maximum in Array',
      description: 'Given an array of integers, return the maximum value.',
      constraints: '1 <= n <= 1000\n-10^6 <= arr[i] <= 10^6',
      starterCode: 'def find_max(arr):\n    # Your code here\n    pass',
      difficulty: 'Easy',
      timeComplexity: 'O(n)'
    },
    {
      title: 'Sum of Array',
      description: 'Given an array of integers, return the sum of all elements.',
      constraints: '1 <= n <= 1000\n-10^6 <= arr[i] <= 10^6',
      starterCode: 'def array_sum(arr):\n    # Your code here\n    pass',
      difficulty: 'Easy',
      timeComplexity: 'O(n)'
    }
  ],
  trees: [
    {
      title: 'Height of Binary Tree',
      description: 'Given the root of a binary tree, return its height.',
      constraints: '1 <= nodes <= 1000',
      starterCode: 'def tree_height(root):\n    # Your code here\n    pass',
      difficulty: 'Medium',
      timeComplexity: 'O(n)'
    }
  ],
  // Add more topics as needed
};

const TopicSolvePage = () => {
  const { topicName } = useParams();
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const questions = dummyQuestions[topicName] || [
    {
      title: 'No Questions',
      description: 'No questions available for this topic yet.',
      constraints: '',
      starterCode: '',
      difficulty: '',
      timeComplexity: ''
    }
  ];
  const question = questions[questionIndex];
  const [code, setCode] = useState(question.starterCode || '');

  const handleRun = () => setShowAnalysis(true);
  const handleNext = () => {
    setShowAnalysis(false);
    const nextIndex = (questionIndex + 1) % questions.length;
    setQuestionIndex(nextIndex);
    setCode(questions[nextIndex].starterCode);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex max-w-7xl mx-auto px-4 py-8" style={{ height: '80vh' }}>
        {/* Left: Question Summary */}
        <div className="bg-gray-800 rounded-lg p-6 mr-6" style={{ flex: '0 0 30%' }}>
          <h2 className="text-xl font-bold text-white mb-4">{question.title}</h2>
          <p className="text-gray-300 mb-4">{question.description}</p>
          <pre className="bg-gray-900 p-2 rounded text-xs text-gray-400 mb-4">{question.constraints}</pre>
          <div className="flex items-center text-xs text-gray-400 mb-2">
            <span className="bg-green-600 text-white text-xs font-medium px-2.5 py-0.5 rounded mr-2">{question.difficulty}</span>
            <span>Expected Time Complexity: {question.timeComplexity}</span>
          </div>
        </div>
        {/* Right: Code Editor */}
        <div className="bg-gray-800 rounded-lg p-6 flex-1 flex flex-col" style={{ flex: '0 0 70%' }}>
          <CodeEditor code={code} setCode={setCode} language="python" />
          <button className="btn-primary mt-4 w-32" onClick={handleRun}>Run</button>
          {showAnalysis && (
            <div className="mt-6 bg-gray-900 p-4 rounded">
              <h3 className="text-lg text-white mb-2">Analysis</h3>
              <p className="text-gray-300">Dummy analysis/result here.</p>
              <div className="flex space-x-4 mt-4">
                <button className="btn-primary" onClick={handleNext}>Next Question</button>
                <button className="btn-secondary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicSolvePage; 