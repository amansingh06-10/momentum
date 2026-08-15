"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { AppData, AppStats, Topic, ActiveProblemInfo } from './types';
import { defaultData } from './defaultData';
import { supabase, isSupabaseConfigured, fetchStateFromSupabase, saveStateToSupabase } from './supabaseClient';

interface DataContextType {
  data: AppData;
  stats: AppStats;
  updateData: (newData: AppData) => void;
  toggleTopicStatus: (sectionKey: string, topicId: string) => void;
  updateTopicDetails: (sectionKey: string, topicId: string, updates: Partial<Topic>) => void;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (val: boolean) => void;
  isDataModalOpen: boolean;
  setIsDataModalOpen: (val: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (val: boolean) => void;
  activeProblem: ActiveProblemInfo | null;
  setActiveProblem: (val: ActiveProblemInfo | null) => void;
  isTimerOpen: boolean;
  setIsTimerOpen: (val: boolean) => void;
  logStudyHours: (hours: number, topicDesc?: string, rating?: number) => void;
  syncStatus: 'synced' | 'syncing' | 'local' | 'error';
  isCloudConnected: boolean;
}

const STORAGE_KEY = "MOMENTUM_APP_DATA_V1";

const DataContext = createContext<DataContextType | undefined>(undefined);

function mergeAppData(savedData: any, defaultData: AppData): AppData {
  if (!savedData || typeof savedData !== 'object') return defaultData;

  const mergedProgress = { ...defaultData.progress };
  if (savedData.progress && typeof savedData.progress === 'object') {
    Object.keys(savedData.progress).forEach((key) => {
      if (mergedProgress[key]) {
        mergedProgress[key] = {
          ...mergedProgress[key],
          ...savedData.progress[key],
          topics: Array.isArray(savedData.progress[key].topics) 
            ? savedData.progress[key].topics 
            : mergedProgress[key].topics,
        };
      } else {
        mergedProgress[key] = savedData.progress[key];
      }
    });
  }

  return {
    ...defaultData,
    ...savedData,
    progress: mergedProgress,
    weeks: Array.isArray(savedData.weeks) && savedData.weeks.length > 0 ? savedData.weeks : defaultData.weeks,
    backendRoadmap: Array.isArray(savedData.backendRoadmap) && savedData.backendRoadmap.length > 0 ? savedData.backendRoadmap : defaultData.backendRoadmap,
    schedule: Array.isArray(savedData.schedule) && savedData.schedule.length > 0 ? savedData.schedule : defaultData.schedule,
    academics: savedData.academics || defaultData.academics,
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeProblem, setActiveProblem] = useState<ActiveProblemInfo | null>(null);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'local' | 'error'>(
    isSupabaseConfigured ? 'syncing' : 'local'
  );

  // Initial Load from Cloud (Supabase) or LocalStorage
  useEffect(() => {
    async function initializeState() {
      let loadedFromCloud = false;

      // 1. Try loading from Supabase if configured
      if (isSupabaseConfigured) {
        setSyncStatus('syncing');
        try {
          const cloudData = await fetchStateFromSupabase();
          if (cloudData) {
            const merged = mergeAppData(cloudData, defaultData);
            setData(merged);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            setSyncStatus('synced');
            loadedFromCloud = true;
          }
        } catch (e) {
          console.warn("Supabase initial load failed, falling back to local storage:", e);
          setSyncStatus('error');
        }
      }

      // 2. Fallback to LocalStorage
      if (!loadedFromCloud) {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            const merged = mergeAppData(parsed, defaultData);
            setData(merged);
          }
        } catch (e) {
          console.warn("Could not load from localStorage, using default data.", e);
        }
        if (!isSupabaseConfigured) setSyncStatus('local');
      }

      setIsLoaded(true);
    }

    initializeState();

    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setActiveProblem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Persist function that writes to localStorage and async syncs to Supabase
  const updateData = async (newData: AppData) => {
    setData(newData);
    
    // 1. Instant local persistence
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    }

    // 2. Background Cloud Sync to Supabase
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      try {
        const success = await saveStateToSupabase(newData);
        setSyncStatus(success ? 'synced' : 'error');
      } catch (e) {
        console.error("Supabase sync failed:", e);
        setSyncStatus('error');
      }
    }
  };

  const toggleTopicStatus = (sectionKey: string, topicId: string) => {
    if (isEditMode) return;
    
    const nextStatusMap: Record<string, 'done' | 'partial' | 'pending'> = { 
      pending: "done", 
      done: "partial", 
      partial: "pending" 
    };
    
    const newProgress = { ...data.progress };
    const section = { ...newProgress[sectionKey] };

    if (!section || !section.topics) return;

    section.topics = section.topics.map((t) => {
      if (t.id === topicId || t.name === topicId) {
        const newStatus = nextStatusMap[t.status] || "done";
        return { 
          ...t, 
          status: newStatus, 
          confidence: newStatus === "done" ? Math.max(8, t.confidence) : newStatus === "pending" ? 0 : 6 
        };
      }
      return t;
    });

    newProgress[sectionKey] = section;
    updateData({ ...data, progress: newProgress });

    // If active problem is open, update it
    if (activeProblem && (activeProblem.topic.id === topicId || activeProblem.topic.name === topicId)) {
      const updatedTopic = section.topics.find(t => t.id === topicId || t.name === topicId);
      if (updatedTopic) {
        setActiveProblem({ ...activeProblem, topic: updatedTopic });
      }
    }
  };

  const updateTopicDetails = (sectionKey: string, topicId: string, updates: Partial<Topic>) => {
    const newProgress = { ...data.progress };
    const section = { ...newProgress[sectionKey] };

    if (!section || !section.topics) return;

    section.topics = section.topics.map((t) => {
      if (t.id === topicId || t.name === topicId) {
        return { ...t, ...updates };
      }
      return t;
    });

    newProgress[sectionKey] = section;
    updateData({ ...data, progress: newProgress });

    if (activeProblem && (activeProblem.topic.id === topicId || activeProblem.topic.name === topicId)) {
      const updatedTopic = section.topics.find(t => t.id === topicId || t.name === topicId);
      if (updatedTopic) {
        setActiveProblem({ ...activeProblem, topic: updatedTopic });
      }
    }
  };

  const logStudyHours = (hours: number, topicDesc?: string, rating?: number) => {
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const dayStr = today.toLocaleDateString("en-US", { weekday: "short" });

    const newWeeks = JSON.parse(JSON.stringify(data.weeks || []));
    if (newWeeks.length === 0) {
      newWeeks.push({
        label: "Week 1",
        range: "Current",
        average: rating || 9,
        days: []
      });
    }

    const latestWeek = newWeeks[0];
    const existingDay = latestWeek.days.find((d: any) => d.date === dateStr);

    if (existingDay) {
      existingDay.hours = Number(((existingDay.hours || 0) + hours).toFixed(1));
      if (topicDesc) existingDay.topic += ` · ${topicDesc}`;
      if (rating !== undefined) existingDay.rating = rating;
    } else {
      latestWeek.days.unshift({
        date: dateStr,
        day: dayStr,
        topic: topicDesc || "Focused study session",
        rating: rating !== undefined ? rating : 9,
        mood: 4,
        hours: Number(hours.toFixed(1))
      });
    }

    const ratedDays = latestWeek.days.filter((d: any) => d.rating !== null && !isNaN(d.rating));
    latestWeek.average = ratedDays.length > 0
      ? Number((ratedDays.reduce((a: number, d: any) => a + Number(d.rating), 0) / ratedDays.length).toFixed(1))
      : 0;

    updateData({ ...data, weeks: newWeeks });
  };

  const stats = useMemo<AppStats>(() => {
    let totalTopics = 0;
    let doneTopics = 0;
    let partialTopics = 0;
    let totalConfidence = 0;
    let countedConfidenceTopics = 0;

    Object.values(data.progress || {}).forEach((section) => {
      (section.topics || []).forEach((t) => {
        totalTopics++;
        if (t.status === "done") {
          doneTopics++;
          totalConfidence += t.confidence || 0;
          countedConfidenceTopics++;
        } else if (t.status === "partial") {
          partialTopics++;
          totalConfidence += t.confidence || 0;
          countedConfidenceTopics++;
        }
      });
    });

    const avgConfidence = countedConfidenceTopics > 0 ? (totalConfidence / countedConfidenceTopics).toFixed(1) : "0.0";
    const overallPct = totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0;

    const targetGoal = data.targetGoal || 190;
    const deadline = new Date(data.targetDate || "2026-08-15");
    const diffMs = deadline.getTime() - now.getTime();
    
    const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const hoursLeft = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minsLeft = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)));
    const secsLeft = Math.max(0, Math.floor((diffMs % (1000 * 60)) / 1000));
    
    const remainingToTarget = Math.max(0, targetGoal - doneTopics);
    const paceNeededPerDay = daysLeft > 0 ? (remainingToTarget / daysLeft).toFixed(1) : "0";
    const pctToTarget = Math.min(100, Math.round((doneTopics / targetGoal) * 100));

    let streak = 0;
    let lastDayFrozen = false;
    
    const allDays = data.weeks ? [...data.weeks].reverse().flatMap((w) => w.days) : [];
    const ratedDays = allDays.filter(d => d.rating !== null && d.rating !== undefined);
    
    if (ratedDays.length > 0) streak = 14;
    
    const overallAvgRating = ratedDays.length > 0 
      ? (ratedDays.reduce((a, d) => a + (Number(d.rating) || 0), 0) / ratedDays.length).toFixed(1) 
      : "0.0";

    return {
      totalTopics,
      doneTopics,
      partialTopics,
      pendingTopics: totalTopics - doneTopics - partialTopics,
      avgConfidence,
      overallPct,
      targetGoal,
      daysLeft,
      hoursLeft,
      minsLeft,
      secsLeft,
      remainingToTarget,
      paceNeededPerDay,
      pctToTarget,
      streak,
      lastDayFrozen,
      overallAvgRating,
    };
  }, [data, now]);

  if (!isLoaded) return null;

  return (
    <DataContext.Provider
      value={{
        data,
        stats,
        updateData,
        toggleTopicStatus,
        updateTopicDetails,
        isEditMode,
        setIsEditMode,
        isChatOpen,
        setIsChatOpen,
        isDataModalOpen,
        setIsDataModalOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        activeProblem,
        setActiveProblem,
        isTimerOpen,
        setIsTimerOpen,
        logStudyHours,
        syncStatus,
        isCloudConnected: isSupabaseConfigured
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useApp must be used within a DataProvider');
  }
  return context;
};
