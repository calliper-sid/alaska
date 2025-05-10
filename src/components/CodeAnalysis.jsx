import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Award, Clock, AlertTriangle, CheckCircle, Code, Bug, Lightbulb } from 'lucide-react';

const CodeAnalysis = ({ evaluation, complexity, onClose }) => {
  const complexityData = [
    { name: 'Your Solution', value: complexity?.value || 0, complexity: complexity?.notation || 'O(n)', color: '#8884d8' },
    { name: 'Optimal', value: 1, complexity: 'O(n)', color: '#82ca9d' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Code Analysis</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Line by Line Analysis */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Code className="mr-2 text-indigo-400" />
                Line by Line Analysis
              </h3>
              <div className="space-y-4">
                {evaluation?.analysis?.lineByLine?.map((line, index) => (
                  <div key={index} className="p-3 bg-gray-700 rounded-md">
                    <div className="flex items-start mb-2">
                      <span className="text-gray-400 mr-2">Line {line.lineNumber}:</span>
                      <code className="text-gray-300">{line.code}</code>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{line.explanation}</p>
                    {line.potentialIssues?.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-red-400 mb-1">Potential Issues:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-300">
                          {line.potentialIssues.map((issue, i) => (
                            <li key={i}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {line.suggestions?.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-green-400 mb-1">Suggestions:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-300">
                          {line.suggestions.map((suggestion, i) => (
                            <li key={i}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Time Complexity */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Clock className="mr-2 text-indigo-400" />
                Time Complexity
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complexityData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
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
              <div className="mt-4">
                <p className="text-gray-300">{complexity?.explanation}</p>
                {complexity?.breakdown && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-indigo-400 mb-1">Breakdown:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-300">
                      {complexity.breakdown.operations.map((op, i) => (
                        <li key={i}>
                          {op.operation}: {op.complexity} - {op.explanation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Test Results */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                {evaluation?.evaluation?.passed ? (
                  <CheckCircle className="mr-2 text-green-400" />
                ) : (
                  <AlertTriangle className="mr-2 text-red-400" />
                )}
                Test Results
              </h3>
              <div className="space-y-4">
                {evaluation?.evaluation?.testResults.map((test, index) => (
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
                      {test.error && (
                        <div className="mt-2">
                          <p className="text-red-400">Error: {test.error}</p>
                          <p className="text-gray-400">Line: {test.lineNumber}</p>
                          <p className="text-gray-400">Type: {test.errorType}</p>
                          <p className="text-gray-400">{test.errorDescription}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-gray-700 rounded-md">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Success Rate</span>
                  <span className="text-white">{evaluation?.evaluation?.summary?.successRate}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full" 
                    style={{ width: `${evaluation?.evaluation?.summary?.successRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Code Quality */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Award className="mr-2 text-indigo-400" />
                Code Quality
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Readability</span>
                    <span className="text-gray-400">{evaluation?.analysis?.codeQuality?.readability}/10</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full" 
                      style={{ width: `${evaluation?.analysis?.codeQuality?.readability * 10}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Efficiency</span>
                    <span className="text-gray-400">{evaluation?.analysis?.codeQuality?.efficiency}/10</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full" 
                      style={{ width: `${evaluation?.analysis?.codeQuality?.efficiency * 10}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Best Practices</span>
                    <span className="text-gray-400">{evaluation?.analysis?.codeQuality?.bestPractices}/10</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full" 
                      style={{ width: `${evaluation?.analysis?.codeQuality?.bestPractices * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Edge Cases and Potential Bugs */}
              {(evaluation?.analysis?.codeQuality?.edgeCases?.length > 0 || 
                evaluation?.analysis?.codeQuality?.potentialBugs?.length > 0) && (
                <div className="mt-4 space-y-4">
                  {evaluation?.analysis?.codeQuality?.edgeCases?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-yellow-400 mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Edge Cases to Consider
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-300">
                        {evaluation.analysis.codeQuality.edgeCases.map((edgeCase, i) => (
                          <li key={i}>{edgeCase}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {evaluation?.analysis?.codeQuality?.potentialBugs?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center">
                        <Bug className="w-4 h-4 mr-1" />
                        Potential Bugs
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-300">
                        {evaluation.analysis.codeQuality.potentialBugs.map((bug, i) => (
                          <li key={i}>{bug}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Suggestions */}
              {evaluation?.analysis?.codeQuality?.suggestions?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-green-400 mb-2 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-1" />
                    Improvement Suggestions
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-300">
                    {evaluation.analysis.codeQuality.suggestions.map((suggestion, i) => (
                      <li key={i}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeAnalysis; 