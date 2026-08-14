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
    "addNewWeek": {
      "label": "Week 2"
    },
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
    ],
    "replaceFullState": null // ONLY use this to output an entire modified JSON state object if you are explicitly asked to edit, delete, or rewrite past data.
  }
}

If no data needs mutation (e.g. you are just answering a question), omit stateMutations.`;

export async function POST(req: Request) {
  let prompt: string = "";
  let model: string = "";
  let currentData: any = null;
  let userMessage: string = "";

  try {
    const body = await req.json();
    prompt = body.prompt;
    model = body.model;
    currentData = body.currentData;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let rawResponseText = "";

    userMessage = `CURRENT SYSTEM STATE:
${JSON.stringify(currentData, null, 2)}

USER INPUT: "${prompt}"

Remember: Analyze the CURRENT SYSTEM STATE to answer questions about previous logs, progress, or performance.`;

    if (model === 'gemini') {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const aiModel = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
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
      const response = await fetch('https://api.moonshot.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MOONSHOT_API_KEY}`
        },
        body: JSON.stringify({
          model: "kimi-k3",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: 0.2
        })
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error?.message || "Moonshot API error");
      rawResponseText = data.choices?.[0]?.message?.content || "";
    }
    else if (model === 'glm') {
      const response = await fetch('https://api.z.ai/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`
        },
        body: JSON.stringify({
          model: "glm-5.2",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: 0.2
        })
      });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error?.message || "Zhipu API error");
      rawResponseText = data.choices?.[0]?.message?.content || "";
    } else {
      return NextResponse.json({ error: 'Unsupported model selected.' }, { status: 400 });
    }
    
    // MASTER FALLBACK: If rawResponseText is empty due to silent failures, force Gemini
    if (!rawResponseText) {
       throw new Error("Provider returned empty response");
    }

    // Extract JSON block robustly
    let jsonStr = rawResponseText.trim();
    let parsedData;
    
    const firstBrace = jsonStr.indexOf('{');
    const lastBrace = jsonStr.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
      jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
      try {
        parsedData = JSON.parse(jsonStr);
      } catch (e) {
        parsedData = { message: rawResponseText };
      }
    } else {
      // If AI just answered conversationally without JSON
      parsedData = { message: rawResponseText };
    }

    try {
      // Perform state mutation on currentData
      let updatedData = { ...currentData };
      if (parsedData.stateMutations) {
        
        // Omnipotent override for modifying past data
        if (parsedData.stateMutations.replaceFullState) {
          updatedData = parsedData.stateMutations.replaceFullState;
        } else {
          const { addDayLog, markTopicsDone, addNewWeek } = parsedData.stateMutations;
          
          // Add new week if requested
          if (addNewWeek && updatedData.weeks) {
            updatedData.weeks.unshift({
              label: addNewWeek.label || "New Week",
              average: 0,
              days: []
            });
          }
          
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
    console.error("Chat API Error, initiating Gemini Fallback:", error);
    
    // MASTER FALLBACK: Use Gemini if the selected provider fails
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const aiModel = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        systemInstruction: systemPrompt 
      });
      const result = await aiModel.generateContent(userMessage);
      let fallbackText = result.response.text().trim();
      
      const firstBrace = fallbackText.indexOf('{');
      const lastBrace = fallbackText.lastIndexOf('}');
      let parsedData;
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
        fallbackText = fallbackText.substring(firstBrace, lastBrace + 1);
        try {
          parsedData = JSON.parse(fallbackText);
        } catch(e) { parsedData = { message: fallbackText }; }
      } else {
        parsedData = { message: fallbackText };
      }
      
      let updatedData = { ...currentData };
      if (parsedData.stateMutations) {
        if (parsedData.stateMutations.replaceFullState) {
          updatedData = parsedData.stateMutations.replaceFullState;
        } else {
          const { addDayLog, markTopicsDone, addNewWeek } = parsedData.stateMutations;
          
          if (addNewWeek && updatedData.weeks) {
            updatedData.weeks.unshift({
              label: addNewWeek.label || "New Week",
              average: 0,
              days: []
            });
          }
          
          if (addDayLog && updatedData.weeks && updatedData.weeks.length > 0) {
            updatedData.weeks[0].days.push(addDayLog);
            const weekDays = updatedData.weeks[0].days.filter((d: any) => d.rating !== null);
            const sum = weekDays.reduce((a: number, d: any) => a + d.rating, 0);
            updatedData.weeks[0].average = weekDays.length > 0 ? Number((sum / weekDays.length).toFixed(1)) : 0;
          }
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
        }
        parsedData.stateMutations.updatedData = updatedData;
      }
      return NextResponse.json(parsedData);
    } catch (fallbackError: any) {
      return NextResponse.json({ error: "All AI providers failed. Check your API keys." }, { status: 500 });
    }
  }
}
