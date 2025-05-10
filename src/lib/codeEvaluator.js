// Code evaluation utility that uses JSON for data transfer
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Helper function to retry failed API calls
const retryOperation = async (operation, maxRetries = 3) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${i + 1} failed:`, error);
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw lastError;
};

// Function to evaluate code and return results in JSON format
export const evaluateCode = async (code, language, testCases) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert code evaluator specializing in ${language}.
    Evaluate the following code against the provided test cases.
    Analyze the code line by line and provide detailed feedback.
    Return the results in JSON format.
    
    Code to evaluate:
    ${code}
    
    Test cases:
    ${JSON.stringify(testCases, null, 2)}
    
    Provide the response in this exact JSON format:
    {
      "evaluation": {
        "passed": boolean,
        "testResults": [
          {
            "testCase": number,
            "input": string,
            "expectedOutput": string,
            "actualOutput": string,
            "passed": boolean,
            "error": string | null,
            "lineNumber": number,
            "errorType": string | null,
            "errorDescription": string | null
          }
        ],
        "summary": {
          "totalTests": number,
          "passedTests": number,
          "failedTests": number,
          "successRate": number
        }
      },
      "analysis": {
        "lineByLine": [
          {
            "lineNumber": number,
            "code": string,
            "explanation": string,
            "complexity": string,
            "potentialIssues": string[],
            "suggestions": string[]
          }
        ],
        "timeComplexity": {
          "notation": string,
          "explanation": string,
          "breakdown": {
            "operations": [
              {
                "operation": string,
                "complexity": string,
                "explanation": string
              }
            ],
            "worstCase": string,
            "bestCase": string,
            "averageCase": string
          }
        },
        "spaceComplexity": {
          "notation": string,
          "explanation": string,
          "breakdown": {
            "dataStructures": [
              {
                "structure": string,
                "space": string,
                "explanation": string
              }
            ],
            "auxiliarySpace": string,
            "totalSpace": string
          }
        },
        "codeQuality": {
          "readability": number,
          "efficiency": number,
          "bestPractices": number,
          "suggestions": string[],
          "edgeCases": string[],
          "potentialBugs": string[]
        }
      }
    }`;

    const result = await retryOperation(async () => {
      const response = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });
      return response;
    });

    const text = result.response.text();
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      const evaluation = JSON.parse(cleanText);
      return evaluation;
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Cleaned Text:', cleanText);
      throw new Error('Failed to parse evaluation response: Invalid JSON format');
    }
  } catch (error) {
    console.error('Error evaluating code:', error);
    throw new Error('Failed to evaluate code: ' + error.message);
  }
};

// Function to analyze code complexity
export const analyzeComplexity = async (code, language) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert in algorithm analysis specializing in ${language}.
    Analyze the time and space complexity of the following code.
    Return the results in JSON format.
    
    Code to analyze:
    ${code}
    
    Provide the response in this exact JSON format:
    {
      "complexity": {
        "time": {
          "notation": string,
          "explanation": string,
          "breakdown": {
            "operations": [
              {
                "operation": string,
                "complexity": string,
                "explanation": string
              }
            ],
            "worstCase": string,
            "bestCase": string,
            "averageCase": string
          }
        },
        "space": {
          "notation": string,
          "explanation": string,
          "breakdown": {
            "dataStructures": [
              {
                "structure": string,
                "space": string,
                "explanation": string
              }
            ],
            "auxiliarySpace": string,
            "totalSpace": string
          }
        }
      },
      "optimization": {
        "suggestions": string[],
        "potentialImprovements": string[],
        "tradeoffs": string[]
      }
    }`;

    const result = await retryOperation(async () => {
      const response = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });
      return response;
    });

    const text = result.response.text();
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      const analysis = JSON.parse(cleanText);
      return analysis;
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Cleaned Text:', cleanText);
      throw new Error('Failed to parse complexity analysis: Invalid JSON format');
    }
  } catch (error) {
    console.error('Error analyzing complexity:', error);
    throw new Error('Failed to analyze complexity: ' + error.message);
  }
}; 