# Momentum

A modern, production-ready study and developer tracker web application for CSE students. Built with Next.js 15 (App Router), Tailwind CSS v4, and integrated AI chat logging (Gemini, Moonshot, Zhipu).

## Features
- **Neon Tokyo Dark Mode**: Dark Neomorphism UI with cyan/magenta accents.
- **AI Auto-Logging**: Natural language session logging via an integrated floating assistant.
- **Local Persistence**: State automatically persists to `localStorage`.
- **DSA Tracking**: Comprehensive tracker for Striver's A2Z sheet.
- **Backend Roadmap**: Progress tracker for Node.js, Express, PostgreSQL, MongoDB.

## Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # Choose whichever provider(s) you intend to use
   GEMINI_API_KEY=your_gemini_key_here
   MOONSHOT_API_KEY=your_moonshot_key_here
   ZHIPU_API_KEY=your_zhipu_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Vercel Deployment

1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com) and click **Add New... > Project**.
3. Import your GitHub repository.
4. **Important**: In the deployment settings, add your Environment Variables (`GEMINI_API_KEY`, etc.).
5. Click **Deploy**. Vercel will automatically detect the Next.js framework and build the project.
