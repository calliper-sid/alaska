import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Code, Brain, CheckCircle, XCircle } from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import CodeAnalysis from '../components/CodeAnalysis';
import { evaluateCode, analyzeComplexity } from '../lib/codeEvaluator';
import { toast } from 'react-hot-toast';

const TopicSolvePage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [codeResult, setCodeResult] = useState(null);
  const [timeComplexity, setTimeComplexity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    loadQuestion();
  }, [topicId]);

  const loadQuestion = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API call to get question
      const newQuestion = {
        id: '1',
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'Easy',
        language: 'cpp',
        type: 'array',
        example: {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
        },
        testCases: [
          {
            input: '[2,7,11,15], 9',
            expectedOutput: '[0,1]'
          },
          {
            input: '[3,2,4], 6',
            expectedOutput: '[1,2]'
          }
        ],
        codeTemplate: '#include <vector>\n\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    return {};\n}'
      };
      setQuestion(newQuestion);
      setCode(newQuestion.codeTemplate || '');
      setCodeResult(null);
      setTimeComplexity(null);
    } catch (err) {
      setError('Failed to load question. Please try again.');
      toast.error('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = async () => {
    try {
      setLoading(true);
      const evaluation = await evaluateCode(code, question.language, question.testCases);
      setCodeResult(evaluation);
      setTimeComplexity(evaluation.analysis.timeComplexity);
      setShowAnalysis(true);
    } catch (err) {
      toast.error('Failed to evaluate code');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setQuestion(null);
    setCode('');
    setCodeResult(null);
    setTimeComplexity(null);
    setShowAnalysis(false);
    loadQuestion();
  };

  if (loading && !question) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-96 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-400 mb-4">{error}</div>
          <button
            onClick={loadQuestion}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Next Question
          </button>
        </div>

        {question && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">{question.title}</h2>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {question.difficulty}
                  </span>
                  <span className="flex items-center text-gray-400">
                    <Code className="w-4 h-4 mr-1" />
                    {question.language}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 mb-4">{question.description}</p>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Example:</h3>
                <div className="bg-gray-800 p-4 rounded-md">
                  <p className="text-gray-300">Input: {question.example.input}</p>
                  <p className="text-gray-300">Output: {question.example.output}</p>
                  <p className="text-gray-300">Explanation: {question.example.explanation}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-indigo-400" />
                  Your Solution
                </h3>
                <button
                  onClick={handleRunCode}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Running...' : 'Run Code'}
                </button>
              </div>
              <CodeEditor
                code={code}
                setCode={setCode}
                language={question.language}
                questionType={question.type}
              />
            </div>

            {codeResult && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Results</h3>
                  <span className={`flex items-center ${codeResult.evaluation.passed ? 'text-green-400' : 'text-red-400'}`}>
                    {codeResult.evaluation.passed ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 mr-2" />
                    )}
                    {codeResult.evaluation.passed ? 'All Tests Passed' : 'Some Tests Failed'}
                  </span>
                </div>
                <div className="space-y-4">
                  {codeResult.evaluation.testResults.map((test, index) => (
                    <div key={index} className={`p-3 rounded-md ${test.passed ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-white">Test Case {test.testCase}</span>
                        <span className={`text-sm ${test.passed ? 'text-green-400' : 'text-red-400'}`}>
                          {test.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>Input: {test.input}</p>
                        <p>Expected: {test.expectedOutput}</p>
                        <p>Actual: {test.actualOutput}</p>
                        {test.error && <p className="text-red-400">Error: {test.error}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showAnalysis && (
        <CodeAnalysis
          evaluation={codeResult}
          complexity={timeComplexity}
          onClose={() => setShowAnalysis(false)}
        />
      )}
    </div>
  );
};

export default TopicSolvePage; 