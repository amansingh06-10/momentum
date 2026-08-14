"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { AppData, AppStats } from './types';
import { defaultData } from './defaultData';

interface DataContextType {
  data: AppData;
  stats: AppStats;
  updateData: (newData: AppData) => void;
  toggleTopicStatus: (sectionKey: string, topicId: string) => void;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (val: boolean) => void;
  isDataModalOpen: boolean;
  setIsDataModalOpen: (val: boolean) => void;
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
  const [now, setNow] = useState(new Date());

  useEffect(() => {
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
    setIsLoaded(true);

    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const updateData = (newData: AppData) => {
    setData(newData);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    }
  };

  const toggleTopicStatus = (sectionKey: string, topicId: string) => {
    if (isEditMode) return; // Prevent toggle if editing
    
    const nextStatusMap: Record<string, 'done' | 'partial' | 'pending'> = { 
      pending: "done", 
      done: "partial", 
      partial: "pending" 
    };
    
    const newProgress = { ...data.progress };
    const section = { ...newProgress[sectionKey] };

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
  };

  const stats = useMemo<AppStats>(() => {
    let totalTopics = 0;
    let doneTopics = 0;
    let partialTopics = 0;
    let totalConfidence = 0;
    let countedConfidenceTopics = 0;

    Object.values(data.progress || {}).forEach((section) => {
      section.topics.forEach((t) => {
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
    const ratedDays = allDays.filter(d => d.rating !== null);
    
    if (ratedDays.length > 0) streak = 12; // Example static computation
    
    const overallAvgRating = ratedDays.length > 0 
      ? (ratedDays.reduce((a, d) => a + (d.rating || 0), 0) / ratedDays.length).toFixed(1) 
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
    <DataContext.Provider value={{ data, stats, updateData, toggleTopicStatus, isEditMode, setIsEditMode, isChatOpen, setIsChatOpen, isDataModalOpen, setIsDataModalOpen }}>
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
