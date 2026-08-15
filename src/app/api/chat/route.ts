import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AppData } from '@/lib/types';

const systemPrompt = `You are Momentum AI — an exceptionally smart, warm, proactive coding mentor and full-stack engineering assistant for Aman's "Momentum" Developer Tracker.

### ABOUT AMAN & MOMENTUM:
- **Profile**: Aman is a Computer Science Engineering student (3rd Semester) mastering Data Structures & Algorithms (Striver's A2Z Sheet in C++) and Backend Engineering (Node.js, Express, MongoDB, PostgreSQL, REST APIs, System Design).
- **Primary Goal**: Solve and master 190+ high-quality DSA problems by the target date, while building production-grade backend projects.
- **Marking & Rating Guidelines (1 to 10)**:
  - **College Days (Mon–Fri)**:
    • 10/10 — 1+ DSA problem solved + backend topic covered & implemented
    • 9/10  — 1 solid DSA problem or good backend progress
    • 8/10  — Revision only or light session
    • 7/10  — Minimal effort / below expectations
  - **Weekend Days (Sat–Sun)**:
    • 10/10 — 2+ DSA problems + deep backend development
    • 9/10  — 1–2 DSA + backend progress
    • 8/10  — 1 DSA or backend only
    • 7/10  — Light session
  - **Freeze / Rest Days**: 2 freeze days allowed per month (recorded with null rating / ice icon).

### YOUR ROLE & BEHAVIOR:
1. **Natural AI Conversation**:
   - Act as a world-class AI peer and senior mentor (like Claude or ChatGPT).
   - Talk naturally, intelligently, and empathetically. Answer ANY question: explain complex algorithms (Sliding Window, Binary Search, Trees, Dynamic Programming, Graphs), write clean code in C++/JS/TS, debug backend APIs, explain database design, discuss CS fundamentals (OS, DBMS, CN), plan schedules, or chat casually.
   - Use clean Markdown formatting with clear headings, code blocks with language tags, bullet points, and math where appropriate.

2. **Real-time Tracker Integration & Data Mutations**:
   - You have full live access to Aman's tracker state (DSA sheet progress, weekly logs, academic marks, backend roadmap, schedule, overview targets).
   - When the user asks you to log a session, mark problems done/revisit/pending, adjust ratings/hours, change goals, edit dates, update backend roadmap, record exam marks, or delete logs, you MUST evaluate the request, formulate a natural reply, and append a \`\`\`json stateMutations block at the very end.
   - **If the user is just asking questions, chatting, debugging, or seeking explanations without modifying data, DO NOT include the json block.**

### DATA MUTATION SCHEMA:
When modifying data, append this JSON block at the end of your response:

\`\`\`json
{
  "stateMutations": {
    "addDayLog": {
      "date": "Aug 10",
      "day": "Mon",
      "topic": "DSA: Two Sum ✓ · Backend: MongoDB CRUD",
      "rating": 9,
      "mood": 4,
      "hours": 3
    },
    "updateDayLog": [
      { "date": "Aug 10", "rating": 10, "hours": 4, "topic": "Updated topic" }
    ],
    "deleteDayLog": ["Aug 5"],
    "addNewWeek": {
      "label": "Week 16",
      "range": "Aug 10 – Aug 16"
    },
    "updateProgress": [
      { "name": "Two Sum", "status": "done", "confidence": 9 },
      { "name": "3 Sum", "status": "partial", "confidence": 6 }
    ],
    "updateBackend": [
      { "id": "wk3", "status": "done" }
    ],
    "updateAcademics": {
      "updateMarks": [{ "examLabel": "2nd Mid-Term", "subject": "DBMS", "obtained": 28 }]
    },
    "updateSchedule": [
      { "day": "Monday", "dsaSlot": "7:00–9:00 PM (2 probs)" }
    ],
    "updateOverview": {
      "targetGoal": 190,
      "targetDate": "2026-08-15",
      "freezesAllowed": 2
    }
  }
}
\`\`\`
Note: All mutation fields are optional. Only include the fields that need updating based on user intent.`;

const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-flash-latest",
  "gemini-3.7-flash",
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite"
];

async function callGemini(
  systemInstruction: string,
  userMessage: string,
  apiKey: string,
  preferredModel?: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Put preferred model first if valid
  const modelQueue = preferredModel && GEMINI_MODELS.includes(preferredModel)
    ? [preferredModel, ...GEMINI_MODELS.filter(m => m !== preferredModel)]
    : GEMINI_MODELS;

  let lastError: any = null;
  for (const modelName of modelQueue) {
    try {
      const aiModel = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction,
      });
      const result = await aiModel.generateContent(userMessage);
      const text = result.response.text();
      if (text && text.trim().length > 0) return text;
    } catch (e: any) {
      lastError = e;
      // Continue to next model on 429 quota or 404 model errors
      continue;
    }
  }
  throw lastError || new Error("Gemini API service temporarily unavailable.");
}

function normalizeId(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function recalculateWeekAverage(days: any[]): number {
  const ratedDays = days.filter((d: any) => d.rating !== null && d.rating !== undefined && !isNaN(Number(d.rating)));
  if (ratedDays.length === 0) return 0;
  const sum = ratedDays.reduce((acc: number, d: any) => acc + Number(d.rating), 0);
  return Number((sum / ratedDays.length).toFixed(1));
}

// Universal State Mutation Engine
export function applyStateMutations(currentData: AppData, mutations: any): AppData {
  if (!mutations || typeof mutations !== 'object') return currentData;

  // Direct full replacement if provided
  if (mutations.replaceFullState && typeof mutations.replaceFullState === 'object') {
    return { ...currentData, ...mutations.replaceFullState };
  }

  // Deep clone data to avoid in-place corruption
  let updatedData: AppData = JSON.parse(JSON.stringify(currentData));

  const {
    addDayLog,
    updateDayLog,
    editDayLog,
    deleteDayLog,
    addNewWeek,
    deleteWeek,
    updateWeek,
    updateProgress,
    updateTopic,
    markTopicsDone,
    updateBackend,
    addBackendPhase,
    deleteBackendPhase,
    updateAcademics,
    updateSchedule,
    updateOverview
  } = mutations;

  // 1. Handle New Week Creation
  if (addNewWeek) {
    const newWeekObj = {
      label: addNewWeek.label || `Week ${(updatedData.weeks?.length || 0) + 1}`,
      range: addNewWeek.range || "Ongoing",
      average: 0,
      days: Array.isArray(addNewWeek.days) ? addNewWeek.days : []
    };
    if (!updatedData.weeks) updatedData.weeks = [];
    updatedData.weeks.unshift(newWeekObj);
  }

  // 2. Handle Delete Week
  if (deleteWeek) {
    if (updatedData.weeks) {
      if (typeof deleteWeek === 'number') {
        updatedData.weeks.splice(deleteWeek, 1);
      } else if (typeof deleteWeek === 'string') {
        updatedData.weeks = updatedData.weeks.filter(w => w.label.toLowerCase() !== deleteWeek.toLowerCase());
      }
    }
  }

  // 3. Handle Update Week metadata
  if (updateWeek && updatedData.weeks) {
    const weekItems = Array.isArray(updateWeek) ? updateWeek : [updateWeek];
    weekItems.forEach((wItem: any) => {
      const week = updatedData.weeks.find(w => w.label.toLowerCase() === (wItem.label || "").toLowerCase());
      if (week) {
        if (wItem.newLabel) week.label = wItem.newLabel;
        if (wItem.range) week.range = wItem.range;
      }
    });
  }

  // 4. Handle Add / Update Day Log
  if (addDayLog) {
    const logsToAdd = Array.isArray(addDayLog) ? addDayLog : [addDayLog];
    if (!updatedData.weeks || updatedData.weeks.length === 0) {
      updatedData.weeks = [{
        label: "Week 1",
        range: "Current",
        average: 0,
        days: []
      }];
    }

    logsToAdd.forEach((item: any) => {
      if (!item || !item.date) return;
      const targetDate = item.date.trim().toLowerCase();
      let found = false;

      // Check if day already exists in any week and update it
      for (const week of updatedData.weeks) {
        const dayIdx = week.days.findIndex(d => d.date.trim().toLowerCase() === targetDate);
        if (dayIdx !== -1) {
          week.days[dayIdx] = {
            ...week.days[dayIdx],
            ...item,
            rating: item.rating !== undefined ? item.rating : week.days[dayIdx].rating,
            hours: item.hours !== undefined ? Number(item.hours) : week.days[dayIdx].hours,
            mood: item.mood !== undefined ? Number(item.mood) : week.days[dayIdx].mood,
          };
          week.average = recalculateWeekAverage(week.days);
          found = true;
          break;
        }
      }

      // If not found, add to latest week (top of days)
      if (!found && updatedData.weeks[0]) {
        const newDay = {
          date: item.date,
          day: item.day || new Date().toLocaleDateString('en-US', { weekday: 'short' }),
          topic: item.topic || "Self study & practice",
          rating: item.rating !== undefined ? item.rating : 9,
          mood: item.mood !== undefined ? Number(item.mood) : 4,
          hours: item.hours !== undefined ? Number(item.hours) : 2,
        };
        updatedData.weeks[0].days.unshift(newDay);
        updatedData.weeks[0].average = recalculateWeekAverage(updatedData.weeks[0].days);
      }
    });
  }

  // 5. Handle Explicit updateDayLog / editDayLog
  const explicitDayUpdates = updateDayLog || editDayLog;
  if (explicitDayUpdates && updatedData.weeks) {
    const logsToUpdate = Array.isArray(explicitDayUpdates) ? explicitDayUpdates : [explicitDayUpdates];
    logsToUpdate.forEach((item: any) => {
      if (!item || !item.date) return;
      const targetDate = item.date.trim().toLowerCase();
      for (const week of updatedData.weeks) {
        const dayIdx = week.days.findIndex(d => d.date.trim().toLowerCase() === targetDate);
        if (dayIdx !== -1) {
          if (item.rating !== undefined) week.days[dayIdx].rating = item.rating;
          if (item.hours !== undefined) week.days[dayIdx].hours = Number(item.hours);
          if (item.topic !== undefined) week.days[dayIdx].topic = item.topic;
          if (item.mood !== undefined) week.days[dayIdx].mood = Number(item.mood);
          if (item.day !== undefined) week.days[dayIdx].day = item.day;
          week.average = recalculateWeekAverage(week.days);
          break;
        }
      }
    });
  }

  // 6. Handle deleteDayLog
  if (deleteDayLog && updatedData.weeks) {
    const datesToDelete = Array.isArray(deleteDayLog) ? deleteDayLog : [deleteDayLog];
    datesToDelete.forEach((dateTarget: any) => {
      const targetStr = (typeof dateTarget === 'string' ? dateTarget : dateTarget?.date || "").trim().toLowerCase();
      if (!targetStr) return;
      for (const week of updatedData.weeks) {
        const initialLen = week.days.length;
        week.days = week.days.filter(d => d.date.trim().toLowerCase() !== targetStr);
        if (week.days.length !== initialLen) {
          week.average = recalculateWeekAverage(week.days);
        }
      }
    });
  }

  // 7. Universal Topic & DSA Progress Mutations
  const topicUpdates = updateProgress || updateTopic || markTopicsDone;
  if (topicUpdates && updatedData.progress) {
    const items = Array.isArray(topicUpdates) ? topicUpdates : [topicUpdates];
    
    items.forEach((item: any) => {
      if (!item) return;
      const searchTarget = (item.name || item.topicName || item.topicId || item.id || "").trim();
      if (!searchTarget) return;

      const targetNorm = normalizeId(searchTarget);
      const targetLower = searchTarget.toLowerCase();
      let matched = false;

      // Search across all progress sections
      for (const [sectionKey, section] of Object.entries(updatedData.progress)) {
        if (!section || !Array.isArray(section.topics)) continue;

        for (const topic of section.topics) {
          const tNorm = normalizeId(topic.id || topic.name);
          const tNameLower = topic.name.toLowerCase();

          if (
            tNorm === targetNorm ||
            tNameLower === targetLower ||
            tNameLower.includes(targetLower) ||
            targetLower.includes(tNameLower)
          ) {
            if (item.status) topic.status = item.status;
            if (item.confidence !== undefined) topic.confidence = Number(item.confidence);
            else if (item.status === 'done' && (topic.confidence === 0 || !topic.confidence)) {
              topic.confidence = 8;
            }
            matched = true;
            break;
          }
        }
        if (matched) break;
      }

      // If topic doesn't exist and sectionKey is provided, create it
      if (!matched && item.sectionKey && updatedData.progress[item.sectionKey]) {
        const newTopic = {
          id: targetNorm,
          name: searchTarget,
          status: item.status || 'done',
          confidence: item.confidence !== undefined ? Number(item.confidence) : 8,
          difficulty: item.difficulty || 'medium'
        };
        updatedData.progress[item.sectionKey].topics.push(newTopic);
        updatedData.progress[item.sectionKey].total = updatedData.progress[item.sectionKey].topics.length;
      }
    });
  }

  // 8. Handle Backend Roadmap Mutations
  if (updateBackend && updatedData.backendRoadmap) {
    const backendItems = Array.isArray(updateBackend) ? updateBackend : [updateBackend];
    backendItems.forEach((bItem: any) => {
      const searchId = (bItem.id || bItem.week || bItem.label || "").trim().toLowerCase();
      const phase = updatedData.backendRoadmap.find(p => 
        p.id.toLowerCase() === searchId || 
        p.week.toLowerCase() === searchId || 
        p.label.toLowerCase().includes(searchId)
      );

      if (phase) {
        if (bItem.status) phase.status = bItem.status;
        if (bItem.label) phase.label = bItem.label;
        if (bItem.period) phase.period = bItem.period;
        if (Array.isArray(bItem.topics)) phase.topics = bItem.topics;
        if (bItem.project !== undefined) phase.project = bItem.project;
      }
    });
  }

  if (addBackendPhase && updatedData.backendRoadmap) {
    updatedData.backendRoadmap.push({
      id: addBackendPhase.id || `wk${updatedData.backendRoadmap.length + 1}`,
      week: addBackendPhase.week || `Week ${updatedData.backendRoadmap.length + 1}`,
      label: addBackendPhase.label || "New Phase",
      period: addBackendPhase.period || "Upcoming",
      status: addBackendPhase.status || "pending",
      topics: Array.isArray(addBackendPhase.topics) ? addBackendPhase.topics : [],
      project: addBackendPhase.project || null
    });
  }

  if (deleteBackendPhase && updatedData.backendRoadmap) {
    const target = deleteBackendPhase.toLowerCase();
    updatedData.backendRoadmap = updatedData.backendRoadmap.filter(p => 
      p.id.toLowerCase() !== target && p.week.toLowerCase() !== target && p.label.toLowerCase() !== target
    );
  }

  // 9. Handle Academics Mutations
  if (updateAcademics && updatedData.academics) {
    if (updateAcademics.maxMarks !== undefined) {
      updatedData.academics.maxMarks = Number(updateAcademics.maxMarks);
    }
    if (Array.isArray(updateAcademics.exams)) {
      updatedData.academics.exams = updateAcademics.exams;
    }
    if (Array.isArray(updateAcademics.updateMarks)) {
      updateAcademics.updateMarks.forEach((m: any) => {
        const exam = updatedData.academics.exams.find(e => 
          (m.examLabel && e.label.toLowerCase().includes(m.examLabel.toLowerCase())) ||
          (m.examIndex !== undefined && updatedData.academics.exams[m.examIndex] === e)
        );
        if (exam) {
          const markObj = exam.marks.find(subj => subj.subject.toLowerCase() === m.subject.toLowerCase());
          if (markObj) {
            markObj.obtained = Number(m.obtained);
          } else {
            exam.marks.push({ subject: m.subject, obtained: Number(m.obtained) });
          }
        }
      });
    }
  }

  // 10. Handle Schedule Mutations
  if (updateSchedule && updatedData.schedule) {
    const schedItems = Array.isArray(updateSchedule) ? updateSchedule : [updateSchedule];
    schedItems.forEach((sItem: any) => {
      const searchDay = (sItem.day || "").trim().toLowerCase();
      const sched = updatedData.schedule.find(s => 
        s.day.toLowerCase() === searchDay || 
        s.day.toLowerCase().startsWith(searchDay.substring(0, 3))
      );
      if (sched) {
        if (sItem.type) sched.type = sItem.type;
        if (sItem.hours) sched.hours = sItem.hours;
        if (sItem.commute) sched.commute = sItem.commute;
        if (sItem.dsaSlot) sched.dsaSlot = sItem.dsaSlot;
        if (sItem.backendSlot) sched.backendSlot = sItem.backendSlot;
      }
    });
  }

  // 11. Handle Overview / Goals Mutations
  if (updateOverview) {
    if (updateOverview.targetGoal !== undefined) updatedData.targetGoal = Number(updateOverview.targetGoal);
    if (updateOverview.targetDate !== undefined) updatedData.targetDate = updateOverview.targetDate;
    if (updateOverview.freezesAllowed !== undefined) updatedData.freezesAllowed = Number(updateOverview.freezesAllowed);
    if (updateOverview.freezesUsedThisMonth !== undefined) updatedData.freezesUsedThisMonth = Number(updateOverview.freezesUsedThisMonth);
  }

  return updatedData;
}

export async function POST(req: Request) {
  let prompt: string = "";
  let messages: any[] = [];
  let currentData: any = null;
  let model: string = "gemini-3.5-flash";

  try {
    const body = await req.json();
    prompt = body.prompt || "";
    messages = body.messages || body.history || [];
    currentData = body.currentData;
    if (body.model) model = body.model;

    if (!prompt && (!messages || messages.length === 0)) {
      return NextResponse.json({ error: 'Prompt or conversation history is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      return NextResponse.json({
        message: "Gemini API key is not configured. Please set GEMINI_API_KEY in .env.local",
        stateMutations: null
      });
    }

    // Build multi-turn conversational context
    let conversationHistoryText = "";
    if (Array.isArray(messages) && messages.length > 0) {
      conversationHistoryText = messages
        .filter(m => m.role !== 'system')
        .slice(-12) // Keep last 12 turns for sharp context
        .map(m => `${m.role === 'user' ? 'USER' : 'ASSISTANT'}: ${m.content}`)
        .join("\n\n");
    }

    const userMessage = `CURRENT TRACKER STATE:
${JSON.stringify(currentData, null, 2)}

${conversationHistoryText ? `CONVERSATION HISTORY:\n${conversationHistoryText}\n\n` : ''}LATEST USER REQUEST:
"${prompt || (messages.length > 0 ? messages[messages.length - 1].content : '')}"`;

    let rawResponseText = "";
    try {
      rawResponseText = await callGemini(systemPrompt, userMessage, apiKey, model);
    } catch (apiErr: any) {
      console.error("Gemini API Error:", apiErr);
      return NextResponse.json({
        message: `I encountered an issue connecting to the AI service: ${apiErr?.message || "Service Busy"}. Please try again.`,
        stateMutations: null
      });
    }

    let displayMessage = rawResponseText;
    let stateMutations: any = null;

    // Extract JSON block if present
    const jsonMatch = rawResponseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.stateMutations) {
          stateMutations = parsed.stateMutations;
        } else if (
          parsed.addDayLog ||
          parsed.updateDayLog ||
          parsed.deleteDayLog ||
          parsed.updateProgress ||
          parsed.updateTopic ||
          parsed.markTopicsDone ||
          parsed.updateBackend ||
          parsed.updateAcademics ||
          parsed.updateSchedule ||
          parsed.updateOverview ||
          parsed.replaceFullState
        ) {
          stateMutations = parsed;
        }
        displayMessage = rawResponseText.replace(/```(?:json)?\s*[\s\S]*?\s*```/, '').trim();
      } catch (e) {
        // Fallback if inside block parsing fails
      }
    }

    // Secondary search for raw JSON if not in code fence
    if (!stateMutations) {
      const firstBrace = rawResponseText.lastIndexOf('{"stateMutations"');
      if (firstBrace !== -1) {
        const lastBrace = rawResponseText.lastIndexOf('}');
        if (lastBrace > firstBrace) {
          try {
            const jsonStr = rawResponseText.substring(firstBrace, lastBrace + 1);
            const parsed = JSON.parse(jsonStr);
            if (parsed.stateMutations) stateMutations = parsed.stateMutations;
            displayMessage = rawResponseText.substring(0, firstBrace).trim();
          } catch (e) {
            // Ignore
          }
        }
      }
    }

    // Apply state mutations to currentData if any exist
    if (stateMutations && currentData) {
      try {
        const updatedData = applyStateMutations(currentData, stateMutations);
        stateMutations.updatedData = updatedData;
      } catch (err) {
        console.error("Error applying state mutations:", err);
      }
    }

    return NextResponse.json({
      message: displayMessage || "Done.",
      stateMutations: stateMutations
    });

  } catch (error: any) {
    console.error("Chat route unhandled error:", error);
    return NextResponse.json({
      message: `Error processing request: ${error.message}`,
      stateMutations: null
    });
  }
}
