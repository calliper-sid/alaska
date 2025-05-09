import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CodeEditor from '../components/CodeEditor';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Terminal, Clock, Send, Award, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample question (in a real app, this would come from the AI SDK)
const sampleQuestion = {
  title: "Two Sum",
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]`,
  difficulty: "Easy",
  constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
  timeComplexity: "Expected: O(n)"
};

// Sample time complexity data for chart
const complexityData = [
  { name: 'Your Code', complexity: 'O(n)', value: 1, color: '#4f46e5' },
  { name: 'Best Solution', complexity: 'O(n)', value: 1, color: '#22c55e' },
  { name: 'Naive', complexity: 'O(n²)', value: 2, color: '#f59e0b' },
];

const AIMocktestPage = () => {
  const location = useLocation();
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  
  // Get the topic from URL query params (if any)
  const queryParams = new URLSearchParams(location.search);
  const topicFromUrl = queryParams.get('topic');
  
  const [language, setLanguage] = useState(profile?.preferred_language || 'cpp');
  const [topic, setTopic] = useState(topicFromUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [showQuestion, setShowQuestion] = useState(false);
  const [codeResult, setCodeResult] = useState(null);
  const [timeComplexity, setTimeComplexity] = useState(null);
  
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

  const generateQuestion = () => {
    setIsLoading(true);
    
    // In a real app, this would call the Gemini AI SDK
    setTimeout(() => {
      setQuestion(sampleQuestion);
      setCode(defaultCodes[language] || '');
      setShowQuestion(true);
      setIsLoading(false);
    }, 1500);
  };

  const runCode = () => {
    setIsLoading(true);
    
    // In a real app, this would evaluate the code using the AI SDK
    setTimeout(() => {
      // Sample result
      setCodeResult({
        output: "[0, 1]",
        error: null,
        passed: true
      });
      
      setTimeComplexity({
        complexity: "O(n)",
        explanation: "Your solution uses a hash map to achieve O(n) time complexity, which is optimal for this problem."
      });
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
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
                />
              </div>
              
              <button
                className="btn-primary w-full flex items-center justify-center"
                onClick={generateQuestion}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Question Section */}
            <div className="card">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white">{question.title}</h2>
                <span className="bg-green-600 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                  {question.difficulty}
                </span>
              </div>
              
              <div className="prose prose-invert max-w-none mb-4">
                <pre className="whitespace-pre-wrap text-gray-300 text-sm">
                  {question.description}
                </pre>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1">Constraints:</h3>
                <pre className="bg-gray-800 p-2 rounded text-xs text-gray-300 whitespace-pre-wrap">
                  {question.constraints}
                </pre>
              </div>
              
              <div className="flex items-center text-sm text-gray-400">
                <Clock size={16} className="mr-1" />
                <span>Expected Time Complexity: {question.timeComplexity}</span>
              </div>
            </div>
            
            {/* Code Editor Section */}
            <div>
              <CodeEditor
                code={code}
                setCode={setCode}
                language={language}
                onRun={runCode}
                result={codeResult}
                isLoading={isLoading}
              />
              
              {timeComplexity && (
                <div className="card mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <BarChart2 className="mr-2 text-indigo-400" />
                    Time Complexity Analysis
                  </h3>
                  
                  <div className="mb-4">
                    <p className="text-gray-300">{timeComplexity.explanation}</p>
                  </div>
                  
                  <div className="h-72">
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