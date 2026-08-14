import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `You are the AI core for Aman's "Momentum" Developer Tracker. Your ONLY responsibility is evaluating logs, generating progress summaries, and modifying system data accurately based on user input. Do not add conversational fluff.

1. MARKING & RATING SYSTEM (1 to 10):
- Context: Aman is a CSE student (3rd Sem) learning DSA (Striver's A2Z Sheet) & Backend (Node.js, Express, MongoDB, PostgreSQL).
- Rules: 2 freeze days allowed per month. Weeks run Wednesday to Tuesday.
- COLLEGE DAYS (Mon–Fri):
  • 10/10 — 1+ DSA problem + backend topic covered
  • 9/10  — 1 DSA problem only, good quality
  • 8/10  — Revision only or light session
  • 7/10  — Minimal effort
- WEEKEND DAYS (Sat–Sun) — STRICT:
  • 10/10 — 2+ DSA problems + backend work
  • 9/10  — 1-2 DSA + backend topic
  • 8/10  — 1 DSA or backend only
  • 7/10  — Light session, below expectations
- Factors: Problems solved & difficulty, topics learned, backend output, hours, mood/energy.

2. SUMMARY CONTEXT:
- When asked for progress, weekly summaries, or stats, analyze CURRENT TRACKER STATE and provide exact metrics: ratings, average, total study hours, rest/freeze days used, DSA achievements, backend milestones.

3. DATA MODIFICATION / UPDATION / DELETION / ADDITION:
- When user logs a session, marks DSA problems done/in-progress, updates backend roadmap phases, changes target goals/dates, or edits/deletes past logs, you MUST return stateMutations inside a \`\`\`json block at the end of your response.

OUTPUT FORMAT:
Provide a clear, concise Markdown message. If data updates/deletions/additions are required, append:

\`\`\`json
{
  "stateMutations": {
    "addDayLog": { "date": "Aug 10", "day": "Mon", "topic": "...", "rating": 9, "mood": 4, "hours": 3 },
    "addNewWeek": { "label": "Week X" },
    "updateProgress": [{ "sectionKey": "...", "topicId": "...", "status": "done" }],
    "updateBackend": [{ "id": "...", "status": "done" }],
    "updateOverview": { "targetGoal": 190, "targetDate": "2026-08-15" },
    "updateLog": [{ "date": "Aug 10", "rating": 9, "hours": 3 }]
  }
}
\`\`\`

If no state mutations are required, omit the json block.`;

const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.7-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-lite-latest"
];

async function callGemini(systemInstruction: string, userMessage: string, apiKey: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: any = null;
  for (const modelName of GEMINI_MODELS) {
    try {
      const aiModel = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction,
      });
      const result = await aiModel.generateContent(userMessage);
      const text = result.response.text();
      if (text) return text;
    } catch (e: any) {
      lastError = e;
    }
  }
  throw lastError || new Error("Gemini API connection issue.");
}

export async function POST(req: Request) {
  let prompt: string = "";
  let currentData: any = null;

  try {
    const body = await req.json();
    prompt = body.prompt;
    currentData = body.currentData;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || '';

    const userMessage = `CURRENT TRACKER STATE:
${JSON.stringify(currentData, null, 2)}

USER REQUEST: "${prompt}"`;

    let rawResponseText = "";

    try {
      rawResponseText = await callGemini(systemPrompt, userMessage, apiKey);
    } catch (apiErr: any) {
      return NextResponse.json({
        message: `API Error: ${apiErr?.message || "Could not connect to AI"}. Please try again.`,
        stateMutations: null
      });
    }

    let displayMessage = rawResponseText;
    let stateMutations: any = null;

    // Extract JSON block if present
    const jsonMatch = rawResponseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.stateMutations) {
          stateMutations = parsed.stateMutations;
        } else if (parsed.addDayLog || parsed.updateProgress || parsed.updateOverview || parsed.updateLog) {
          stateMutations = parsed;
        }
        displayMessage = rawResponseText.replace(/```json\s*[\s\S]*?\s*```/, '').trim();
      } catch (e) {
        // ignore parse error
      }
    } else {
      const firstBrace = rawResponseText.indexOf('{');
      const lastBrace = rawResponseText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        try {
          const fullJsonStr = rawResponseText.substring(firstBrace, lastBrace + 1);
          const parsed = JSON.parse(fullJsonStr);
          if (parsed.message) displayMessage = parsed.message;
          if (parsed.stateMutations) stateMutations = parsed.stateMutations;
        } catch (e) {
          // ignore
        }
      }
    }

    // Perform state mutations
    if (stateMutations) {
      try {
        let updatedData = { ...currentData };
        if (stateMutations.replaceFullState) {
          updatedData = stateMutations.replaceFullState;
        } else {
          const { addDayLog, markTopicsDone, addNewWeek, updateProgress, updateBackend, updateOverview, updateLog } = stateMutations;
          
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

          if (updateProgress && updateProgress.length > 0) {
            updateProgress.forEach((item: any) => {
               const section = updatedData.progress[item.sectionKey];
               if (section) {
                  const topic = section.topics.find((t: any) => t.id === item.topicId);
                  if (topic) {
                     if (item.status) topic.status = item.status;
                     if (item.confidence !== undefined) topic.confidence = item.confidence;
                  }
               }
            });
          }

          if (updateBackend && updateBackend.length > 0 && updatedData.backendRoadmap) {
            updateBackend.forEach((item: any) => {
               const phase = updatedData.backendRoadmap.find((p: any) => p.id === item.id);
               if (phase) {
                  if (item.status) phase.status = item.status;
               }
            });
          }

          if (updateOverview) {
            if (updateOverview.targetGoal !== undefined) updatedData.targetGoal = updateOverview.targetGoal;
            if (updateOverview.targetDate !== undefined) updatedData.targetDate = updateOverview.targetDate;
            if (updateOverview.freezesAllowed !== undefined) updatedData.freezesAllowed = updateOverview.freezesAllowed;
            if (updateOverview.freezesUsedThisMonth !== undefined) updatedData.freezesUsedThisMonth = updateOverview.freezesUsedThisMonth;
          }

          if (updateLog && updateLog.length > 0 && updatedData.weeks) {
            updateLog.forEach((item: any) => {
               for (let w of updatedData.weeks) {
                  const day = w.days.find((d: any) => d.date === item.date);
                  if (day) {
                     if (item.rating !== undefined) day.rating = item.rating;
                     if (item.hours !== undefined) day.hours = item.hours;
                     if (item.topic !== undefined) day.topic = item.topic;
                     if (item.mood !== undefined) day.mood = item.mood;
                  }
               }
            });
          }
        }
        stateMutations.updatedData = updatedData;
      } catch (err) {
        console.error("Error mutating state:", err);
      }
    }

    return NextResponse.json({
      message: displayMessage,
      stateMutations: stateMutations
    });

  } catch (error: any) {
    return NextResponse.json({
      message: `Error processing request: ${error.message}`,
      stateMutations: null
    });
  }
}
