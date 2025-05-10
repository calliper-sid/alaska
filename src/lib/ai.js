// Placeholder for AI SDK integration
// In a real app, this would use the Gemini API or similar

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCodeTemplate } from './codeTemplates';

// Initialize the Gemini AI model
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
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw lastError;
};

// Function to generate a coding question based on parameters
export const generateQuestion = async (language, topic, difficulty = "Easy") => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert programming instructor specializing in ${language}. 
    If the user asks for anything unrelated to coding or programming (such as the current time, recipes, or general knowledge), respond with: 'I can only help with coding questions and programming topics.'
    Generate a coding question that is ${difficulty?.toLowerCase() || 'easy'} difficulty level and focuses on ${topic || 'general programming concepts'}.
    The question should be well-structured, include clear examples, and have a specific solution approach.
    Do NOT include the answer or solution in any form. Only provide the question, constraints, and starter code.
    Make sure the question tests understanding of ${language} concepts and best practices.
    
    Generate a coding question with the following structure in JSON format:
    {
      "title": "A clear, concise title for the problem",
      "description": "Detailed problem description with:
        - Clear problem statement
        - Input/output format
        - At least 2-3 examples with explanations
        - Edge cases to consider",
      "difficulty": "${difficulty || 'Easy'}",
      "constraints": "List of constraints including:
        - Time complexity requirements
        - Space complexity requirements
        - Input size limits
        - Any other important constraints",
      "timeComplexity": "Expected time complexity with explanation",
      "questionType": "The type of question (array, string, tree, etc.)"
    }`;

    const result = await retryOperation(async () => {
      const response = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });
      return response;
    });

    const text = result.response.text();
    
    // Clean the response text to handle markdown formatting and escape special characters
    const cleanText = text
      .replace(/```json\n?|\n?```/g, '') // Remove markdown code blocks
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .replace(/\\([^"\\\/bfnrtu])/g, '$1') // Fix escaped characters
      .trim();
    
    try {
      // Parse and validate the response
      const question = JSON.parse(cleanText);
      
      // Validate required fields
      if (!question.title || !question.description || !question.questionType) {
        throw new Error('Invalid question format: Missing required fields');
      }
      
      // Add the code template based on language and question type
      question.code_template = getCodeTemplate(language, question.questionType);
      
      return question;
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Cleaned Text:', cleanText);
      throw new Error('Failed to parse AI response: Invalid JSON format');
    }
  } catch (error) {
    console.error('Error generating question:', error);
    throw new Error('Failed to generate question: ' + error.message);
  }
};

// Function to evaluate code submission
export const evaluateCode = async (code, language, questionId) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert code reviewer specializing in ${language}.
    Evaluate the code for correctness, efficiency, and best practices.
    Consider time complexity, space complexity, and code readability.
    
    Evaluate this ${language} code:
    ${code}
    
    Provide the response in JSON format:
    {
      "passed": boolean,
      "output": "Test case results with:
        - Input values
        - Expected output
        - Actual output
        - Pass/fail status",
      "time_complexity": "Time complexity analysis with:
        - Current complexity
        - Optimal complexity
        - Explanation",
      "space_complexity": "Space complexity analysis with:
        - Current complexity
        - Optimal complexity
        - Explanation",
      "suggestions": "List of improvement suggestions for:
        - Code efficiency
        - Best practices
        - Readability
        - Edge cases"
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
    // Clean the response text to handle markdown formatting
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error evaluating code:', error);
    throw new Error('Failed to evaluate code: ' + error.message);
  }
};

// Function to analyze code time complexity
export const analyzeComplexity = async (code, language) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert in algorithm analysis specializing in ${language}.
    Analyze the time and space complexity of the code, considering all operations and data structures used.
    
    Analyze the complexity of this ${language} code:
    ${code}
    
    Provide the response in JSON format:
    {
      "complexity": {
        "time": "Time complexity notation",
        "space": "Space complexity notation"
      },
      "explanation": "Detailed explanation including:
        - Analysis of each operation
        - Data structure usage
        - Worst case scenarios
        - Optimization opportunities"
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
    // Clean the response text to handle markdown formatting
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error analyzing complexity:', error);
    throw new Error('Failed to analyze complexity: ' + error.message);
  }
};