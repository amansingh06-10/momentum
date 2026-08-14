import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `You are an expert AI assistant and pair programming partner for Aman. You can converse on ANY topic naturally, thoroughly, and intelligently in Markdown (e.g. explaining code, debugging algorithms, computer science, DSA concepts, math, backend design, or general chat).

CONTEXT (Aman's Momentum Tracker):
Aman is a 3rd Sem CSE student learning DSA (Striver's A2Z sheet) and Backend Engineering (Node.js, Express, MongoDB, PostgreSQL).
Target: 190/474 DSA problems solved.

INSTRUCTIONS:
1. Provide a direct, helpful, and articulate answer to the user's question or greeting using Markdown.
2. ONLY IF the user explicitly logs a study session, updates DSA progress, modifies backend roadmap items, or changes overall target goals, append a JSON block at the VERY END of your response inside a \`\`\`json block:

\`\`\`json
{
  "stateMutations": {
    "addDayLog": {
      "date": "Aug 10",
      "day": "Mon",
      "topic": "DSA & Backend",
      "rating": 9,
      "mood": 4,
      "hours": 3
    },
    "updateProgress": [
      { "sectionKey": "strings", "topicId": "isomorphic-strings", "status": "done", "confidence": 9 }
    ],
    "updateBackend": [
      { "id": "phase-1", "status": "done" }
    ],
    "updateOverview": {
      "targetGoal": 200,
      "targetDate": "2026-08-15"
    }
  }
}
\`\`\`

If NO tracker state update is requested, do NOT output any JSON block. Simply answer the user's question directly and naturally.`;

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
  throw lastError || new Error("Gemini models unavailable");
}

export async function POST(req: Request) {
  let prompt: string = "";
  let model: string = "";
  let currentData: any = null;

  try {
    const body = await req.json();
    prompt = body.prompt;
    model = body.model;
    currentData = body.currentData;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || '';

    const userMessage = `CURRENT TRACKER STATE:
${JSON.stringify(currentData, null, 2)}

USER QUESTION / INPUT: "${prompt}"`;

    let rawResponseText = "";

    try {
      rawResponseText = await callGemini(systemPrompt, userMessage, apiKey);
    } catch (apiErr: any) {
      console.error("Gemini API Error:", apiErr);
      return NextResponse.json({
        message: `I encountered an issue connecting to the AI model. Details: ${apiErr?.message || "Service Busy"}. Please try sending your prompt again.`,
        stateMutations: null
      });
    }

    let displayMessage = rawResponseText;
    let stateMutations: any = null;

    // Check if JSON block exists at the end of the text
    const jsonMatch = rawResponseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.stateMutations) {
          stateMutations = parsed.stateMutations;
        } else if (parsed.addDayLog || parsed.updateProgress || parsed.updateOverview) {
          stateMutations = parsed;
        }
        displayMessage = rawResponseText.replace(/```json\s*[\s\S]*?\s*```/, '').trim();
      } catch (e) {
        // ignore parse error
      }
    } else {
      // If output was purely JSON
      const firstBrace = rawResponseText.indexOf('{');
      const lastBrace = rawResponseText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        try {
          const fullJsonStr = rawResponseText.substring(firstBrace, lastBrace + 1);
          const parsed = JSON.parse(fullJsonStr);
          if (parsed.message) displayMessage = parsed.message;
          if (parsed.stateMutations) stateMutations = parsed.stateMutations;
        } catch (e) {
          // treat as plain text
        }
      }
    }

    // Apply state mutations if present
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
        console.error("Error applying state mutations:", err);
      }
    }

    return NextResponse.json({
      message: displayMessage,
      stateMutations: stateMutations
    });

  } catch (error: any) {
    return NextResponse.json({
      message: `An unexpected error occurred: ${error.message}`,
      stateMutations: null
    });
  }
}
