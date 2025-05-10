import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CodeEditor from '../components/CodeEditor';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Terminal, Clock, Send, Award, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateQuestion as generateAIQuestion, evaluateCode, analyzeComplexity } from '../lib/ai';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Route } from 'react-router-dom';
import TopicSolvePage from './TopicSolvePage';

const AIMocktestPage = () => {
  const location = useLocation();
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const { topicName } = useParams();
  const navigate = useNavigate();
  
  // Debug: Check if API key is loaded
  useEffect(() => {
    console.log('API Key available:', !!import.meta.env.VITE_GEMINI_API_KEY);
    console.log('API Key:', import.meta.env.VITE_GEMINI_API_KEY?.slice(0, 10) + '...');
  }, []);

  // Get the topic from URL query params (if any)
  const queryParams = new URLSearchParams(location.search);
  const topicFromUrl = queryParams.get('topic');
  
  const [language, setLanguage] = useState(profile?.preferred_language || 'cpp');
  const [topic, setTopic] = useState(topicFromUrl || topicName || '');
  const [difficulty, setDifficulty] = useState('Easy');
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [showQuestion, setShowQuestion] = useState(false);
  const [codeResult, setCodeResult] = useState(null);
  const [timeComplexity, setTimeComplexity] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  // Sample default code templates for different languages
  const defaultCodes = {
    cpp: `#include <vector>
#include <iostream>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your solution here
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = twoSum(nums, target);
    cout << "[" << result[0] << ", " << result[1] << "]" << endl;
    return 0;
}`,
    c: `#include <stdio.h>
#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Your solution here
}

int main() {
    int nums[] = {2, 7, 11, 15};
    int target = 9;
    int returnSize;
    int* result = twoSum(nums, 4, target, &returnSize);
    printf("[%d, %d]\\n", result[0], result[1]);
    free(result);
    return 0;
}`,
    java: `import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
    }
    
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = solution.twoSum(nums, target);
        System.out.println("[" + result[0] + ", " + result[1] + "]");
    }
}`
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCode(defaultCodes[e.target.value] || '');
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleGenerateQuestion = async () => {
    try {
      setIsLoading(true);
      showToast('Generating question...', 'info');
      
      const generatedQuestion = await generateAIQuestion(language, topic, difficulty);
      console.log('Generated question:', generatedQuestion); // Debug log
      
      if (!generatedQuestion || !generatedQuestion.title) {
        throw new Error('Invalid question format received');
      }
      
      setQuestion(generatedQuestion);
      setCode('');
      setShowQuestion(true);
      
      showToast('Question generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating question:', error);
      showToast(error.message || 'Failed to generate question. Please try again.', 'error');
      setShowQuestion(false);
    } finally {
      setIsLoading(false);
    }
  };

  const runCode = async () => {
    try {
      setIsLoading(true);
      
      // Evaluate the code
      const evaluation = await evaluateCode(code, language, question?.title);
      setCodeResult({
        output: evaluation.output,
        error: evaluation.passed ? null : 'Failed test cases',
        passed: evaluation.passed
      });
      
      // Analyze time complexity
      const complexity = await analyzeComplexity(code, language);
      setTimeComplexity(complexity);
      
    } catch (error) {
      showToast('Failed to evaluate code', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRun = () => setShowAnalysis(true);

  const handleNext = () => {
    setShowAnalysis(false);
    setQuestion(null);
    setCode('');
    setCodeResult(null);
    setTimeComplexity(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full px-0">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center px-4">
          <Terminal className="mr-3 text-indigo-500" />
          AI Mocktest
        </h1>
        
        {!showQuestion ? (
          <div className="card max-w-xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-6">Generate a Coding Question</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-1">
                  Programming Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={handleLanguageChange}
                  className="select-field"
                  disabled={isLoading}
                >
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="java">Java</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-1">
                  Topic (optional)
                </label>
                <input
                  id="topic"
                  type="text"
                  placeholder="e.g., Arrays, Trees, Dynamic Programming"
                  value={topic}
                  onChange={handleTopicChange}
                  className="input-field"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-1">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={handleDifficultyChange}
                  className="select-field"
                  disabled={isLoading}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              
              <button
                className="btn-primary w-full flex items-center justify-center"
                onClick={handleGenerateQuestion}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating Question...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Generate Question
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex w-full h-[calc(100vh-120px)]">
            {/* Question Summary - 30% */}
            <div className="bg-gray-800 rounded-lg p-6 mr-4 flex-shrink-0" style={{ width: '30%' }}>
              <h2 className="text-xl font-bold text-white mb-4">{question.title}</h2>
              <p className="text-gray-300 mb-4">{question.description}</p>
              <pre className="bg-gray-900 p-2 rounded text-xs text-gray-400 mb-4">{question.constraints}</pre>
              <div className="flex items-center text-xs text-gray-400 mb-2">
                <span className="bg-green-600 text-white text-xs font-medium px-2.5 py-0.5 rounded mr-2">{question.difficulty}</span>
                <span>Expected Time Complexity: {question.timeComplexity}</span>
              </div>
            </div>
            {/* Code Editor - 70% */}
            <div className="bg-gray-800 rounded-lg p-6 flex-1 flex flex-col h-full" style={{ width: '70%' }}>
              <div className="flex-1 flex flex-col">
                <CodeEditor
                  code={code}
                  setCode={setCode}
                  language={language}
                  onRun={runCode}
                  result={codeResult}
                  isLoading={isLoading}
                />
              </div>
              {timeComplexity && (
                <div className="card mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <BarChart2 className="mr-2 text-indigo-400" />
                    Time Complexity Analysis
                  </h3>
                  <div className="mb-4">
                    <p className="text-gray-300">{timeComplexity.explanation}</p>
                  </div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={complexityData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis 
                          ticks={[0, 1, 2, 3]} 
                          domain={[0, 3]}
                          tickFormatter={(value) => {
                            return ['', 'O(n)', 'O(n²)', 'O(n³)'][value];
                          }}
                        />
                        <Tooltip 
                          formatter={(value, name, props) => [props.payload.complexity, 'Time Complexity']}
                          labelFormatter={(value) => `${value}'s Solution`}
                        />
                        <Bar dataKey="value" fill="#8884d8">
                          {complexityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {codeResult && codeResult.passed && (
                    <div className="mt-4 bg-green-900 p-3 rounded-md flex items-center text-green-300">
                      <Award className="mr-2" />
                      <span>Your solution passed all test cases with optimal time complexity!</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AIMocktestPage;