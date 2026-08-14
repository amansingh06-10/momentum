import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `You are the core logic engine for Aman's "Momentum" Developer Tracker. Your job is to process natural language daily logs and return EXACTLY a JSON response containing state updates. No markdown, no pleasantries, only valid JSON.

USER CONTEXT:
Aman is a CSE student (3rd Sem) following Striver's A2Z DSA sheet and learning backend (Node.js, Express, PostgreSQL, MongoDB).
Target: 190/474 problems by Aug 15, 2026.

STREAK RULES:
- 2 freeze days allowed per calendar month (freeze protects streak without study).
- Weeks run Wednesday to Tuesday. New week opens on Wed.

RATING SYSTEM (1 to 10):
COLLEGE DAYS (Mon–Fri):
- 10/10 — 1+ DSA problem + backend topic covered
- 9/10  — 1 DSA problem only, good quality
- 8/10  — Revision only or very light session
- 7/10  — Minimal effort, barely showed up

WEEKEND DAYS (Sat–Sun) — STRICT:
- 10/10 — 2+ DSA problems + backend work
- 9/10  — 1-2 DSA + backend topic
- 8/10  — 1 DSA or backend only
- 7/10  — Light session, below expectations

RATING FACTORS: 1. Problems solved & diff, 2. Topics learned, 3. Backend output, 4. Hours (context only), 5. Mood/energy.

YOUR TASK:
When Aman logs a session, ask for missing details if necessary (hours, mood 1-5, topics).
If he provides the log, determine the rating based on the rules. Update the state by returning JSON in this exact format:

{
  "message": "A summary of what you did, the rating (and why), streak info, and progress toward 190 target.",
  "stateMutations": {
    "addDayLog": {
      "date": "Aug 10", 
      "day": "Mon", 
      "topic": "DSA: Isomorphic String. Backend: Routes.", 
      "rating": 9, 
      "mood": 4, 
      "hours": 3
    },
    "markTopicsDone": [
      { "sectionKey": "strings", "topicId": "isomorphic-strings" }
    ]
  }
}

If no data needs mutation (e.g. you are just answering a question), omit stateMutations.`;

export async function POST(req: Request) {
  try {
    const { prompt, model, currentData } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let rawResponseText = "";

    const userMessage = `Current Data context: Target=${currentData?.targetGoal}. 
    User input: "${prompt}"`;

    if (model === 'gemini') {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const aiModel = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt 
      });
      const result = await aiModel.generateContent(userMessage);
      rawResponseText = result.response.text();
    } 
    else if (model === 'claude') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 1024,
          system: systemPrompt,
          messages: [
            { role: "user", content: userMessage }
          ],
          temperature: 0.2
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      rawResponseText = data.content?.[0]?.text || "";
    }
    else if (model === 'kimi') {
      const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MOONSHOT_API_KEY}`
        },
        body: JSON.stringify({
          model: "moonshot-v1-8k",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: 0.2
        })
      });
      const data = await response.json();
      rawResponseText = data.choices?.[0]?.message?.content || "";
    }
    else if (model === 'glm') {
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`
        },
        body: JSON.stringify({
          model: "glm-4-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: 0.2
        })
      });
      const data = await response.json();
      rawResponseText = data.choices?.[0]?.message?.content || "";
    } else {
      return NextResponse.json({ error: 'Unsupported model selected.' }, { status: 400 });
    }

    // Clean markdown if AI ignored instructions
    let jsonStr = rawResponseText.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/^```json\n/, '').replace(/\n```$/, '');
    }

    try {
      const parsedData = JSON.parse(jsonStr);
      
      // Perform state mutation on currentData
      const updatedData = { ...currentData };
      if (parsedData.stateMutations) {
        const { addDayLog, markTopicsDone } = parsedData.stateMutations;
        
        // Add entry to current week
        if (addDayLog && updatedData.weeks && updatedData.weeks.length > 0) {
          updatedData.weeks[0].days.push(addDayLog);
          
          // Recalculate average
          const weekDays = updatedData.weeks[0].days.filter((d: any) => d.rating !== null);
          const sum = weekDays.reduce((a: number, d: any) => a + d.rating, 0);
          updatedData.weeks[0].average = weekDays.length > 0 ? Number((sum / weekDays.length).toFixed(1)) : 0;
        }

        // Mark topics as done
        if (markTopicsDone && markTopicsDone.length > 0) {
          markTopicsDone.forEach((item: any) => {
             const section = updatedData.progress[item.sectionKey];
             if (section) {
                const topic = section.topics.find((t: any) => t.id === item.topicId);
                if (topic) {
                   topic.status = 'done';
                   topic.confidence = Math.max(8, topic.confidence || 0);
                }
             }
          });
        }
        
        parsedData.stateMutations.updatedData = updatedData;
      }

      return NextResponse.json(parsedData);
    } catch (parseError) {
      console.error("Failed to parse AI JSON:", rawResponseText);
      return NextResponse.json({ 
        message: rawResponseText, 
        error: "AI responded but format was not strictly JSON. Could not mutate state." 
      });
    }

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
