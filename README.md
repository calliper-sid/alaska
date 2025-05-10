# CodeBolt - AI-Powered Coding Platform

CodeBolt is a modern coding platform that combines AI-powered mock tests with real-time competitive programming rooms. Built with React, TypeScript, and TailwindCSS.

## Features

- **Landing Page**
  - Clean login/registration interface
  - Basic username/password authentication

- **Registration Flow**
  - Comprehensive user profile creation
  - Skill level assessment
  - Programming language preferences

- **Dashboard**
  - User rating display
  - Progress tracking
  - Topic-based practice cards
  - Search functionality

- **AI Mocktest**
  - AI-generated coding questions
  - Real-time code evaluation
  - Time complexity analysis
  - Performance visualization

- **Room-based Competition**
  - Create custom coding rooms
  - Join existing rooms
  - Real-time leaderboard
  - Password protection for rooms

## Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - TailwindCSS
  - React Router v6
  - CodeMirror for code editing
  - Recharts for data visualization

- **Backend**
  - Supabase for data storage
  - Gemini AI SDK for code analysis

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/codebolt.git
   cd codebolt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── contexts/      # React contexts
├── lib/           # Utility functions and configurations
└── App.tsx        # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 