"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getAllChallenges,
  getMyChallenges,
  getMyCreatedChallenges,
  joinChallenge,
  toggleChallengeStatus,
  Challenge,
  ChallengeType,
} from "@/services/challenges";
import ChallengeCard from "./ChallengeCard";
import ChallengeDetailModal from "./ChallengeDetailModal";
import { useChallengeWebSocket } from "@/hooks/useChallengeWebSocket";

type TabType = "all" | "my-challenges" | "created";

interface ChallengeListProps {
  activeTab?: TabType;
  onCreateClick?: () => void;
}

export default function ChallengeList({
  activeTab = "all",
  onCreateClick,
}: ChallengeListProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>(activeTab);
  const [joinedChallengeIds, setJoinedChallengeIds] = useState<Set<number>>(new Set());
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Cache state to store challenges for each tab
  const [challengesCache, setChallengesCache] = useState<Record<TabType, Challenge[] | null>>({
    "all": null,
    "my-challenges": null,
    "created": null
  });

  // Helper to update cache for all tabs when a challenge changes
  const updateAllCaches = useCallback((updater: (challenges: Challenge[]) => Challenge[]) => {
    setChallengesCache(prevCache => {
      const newCache = { ...prevCache };
      (Object.keys(newCache) as TabType[]).forEach(tab => {
        if (newCache[tab]) {
          newCache[tab] = updater(newCache[tab]!);
        }
      });
      return newCache;
    });
    
    // Also update current view
    setChallenges(prev => updater(prev));
  }, []);

  // Handle real-time challenge updates via WebSocket
  const handleChallengeUpdate = useCallback((challengeId: number, isActive: boolean, updatedChallenge: Challenge) => {
    console.log("WebSocket update received:", challengeId, isActive);
    
    updateAllCaches(currentList => 
      currentList.map(challenge => {
        if (challenge.id === challengeId) {
          return {
            ...challenge,
            ...updatedChallenge,
            toggle_details: updatedChallenge.toggle_details || challenge.toggle_details,
          };
        }
        return challenge;
      })
    );
  }, [updateAllCaches]);

  // Connect to WebSocket for real-time updates
  const { isConnected } = useChallengeWebSocket({
    onChallengeToggled: handleChallengeUpdate,
    onConnect: () => console.log("Connected to challenge updates"),
    onDisconnect: () => console.log("Disconnected from challenge updates"),
  });

  const loadChallenges = async (forceRefresh = false) => {
    // If we have cached data and not forcing refresh, use it
    if (!forceRefresh && challengesCache[currentTab]) {
      setChallenges(challengesCache[currentTab]!);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let data: Challenge[];
      console.log("Loading challenges for tab:", currentTab);
      switch (currentTab) {
        case "my-challenges":
          data = await getMyChallenges();
          break;
        case "created":
          data = await getMyCreatedChallenges();
          break;
        default:
          data = await getAllChallenges();
          
          // Also fetch user's joined challenges to know which ones to hide Join button for
          try {
            const myJoinedChallenges = await getMyChallenges();
            const joinedIds = new Set(myJoinedChallenges.map(c => c.id));
            setJoinedChallengeIds(joinedIds);
          } catch (err) {
            console.error("Failed to fetch joined challenges:", err);
          }
      }
      
      // Update cache and current view
      setChallengesCache(prev => ({
        ...prev,
        [currentTab]: data
      }));
      setChallenges(data);
    } catch (err: any) {
      console.error("Error loading challenges:", err);
      setError(err.message || "Failed to load challenges");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  const handleJoinChallenge = async (challengeId: number) => {
    try {
      await joinChallenge(challengeId);
      // Force reload to get fresh state including the new join
      await loadChallenges(true);
      
      // Also invalidate other tabs since join status changed
      setChallengesCache(prev => ({
        ...prev,
        "my-challenges": null // Will force refresh when visiting this tab
      }));
    } catch (err: any) {
      alert(err.message || "Failed to join challenge");
    }
  };

  const handleToggleChallenge = async (challengeId: number) => {
    try {
      // Optimistically update the UI and Cache first
      updateAllCaches(currentList => 
        currentList.map(challenge => {
          if (challenge.id === challengeId && challenge.toggle_details) {
            return {
              ...challenge,
              toggle_details: {
                ...challenge.toggle_details,
                is_active: !challenge.toggle_details.is_active,
              },
            };
          }
          return challenge;
        })
      );

      // Then make the API call
      await toggleChallengeStatus(challengeId);
    } catch (err: any) {
      // On error, revert by reloading
      alert(err.message || "Failed to toggle challenge");
      await loadChallenges(true);
    }
  };

  const handleCardClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedChallenge(null), 300); // Clear after animation
  };


  const [searchQuery, setSearchQuery] = useState("");
  const [showEnded, setShowEnded] = useState(false);

  // Filter challenges based on search query and ended status
  const filteredChallenges = challenges.filter((challenge) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      challenge.name.toLowerCase().includes(query) ||
      challenge.description?.toLowerCase().includes(query);
    
    if (!matchesSearch) return false;

    // Filter out ended challenges unless showEnded is true
    if (!showEnded) {
      if (challenge.completed) return false;
      
      // For time-based challenges, check if end date has passed
      if (challenge.challenge_type === ChallengeType.TIME_BASED && challenge.time_based_details) {
        const endDate = new Date(challenge.time_based_details.end_date);
        if (endDate < new Date()) return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Connection Status Indicator */}
      {isConnected && (
        <div className="flex items-center gap-2 text-xs text-green-600 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live updates enabled
        </div>
      )}

      {/* Controls Header: Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCurrentTab("all")}
            className={`px-4 py-2 rounded-lg font-medium font-mono transition-all duration-300 ${
              currentTab === "all"
                ? "bg-slate-700/50 backdrop-blur-sm text-white shadow-md border border-white/20"
                : "bg-slate-100/40 backdrop-blur-sm text-slate-700 hover:bg-slate-200/50 border border-slate-300/20"
            }`}
          >
            All Challenges
          </button>
          <button
            onClick={() => setCurrentTab("my-challenges")}
            className={`px-4 py-2 rounded-lg font-medium font-mono transition-all duration-300 ${
              currentTab === "my-challenges"
                ? "bg-slate-700/50 backdrop-blur-sm text-white shadow-md border border-white/20"
                : "bg-slate-100/40 backdrop-blur-sm text-slate-700 hover:bg-slate-200/50 border border-slate-300/20"
            }`}
          >
            My Challenges
          </button>
          <button
            onClick={() => setCurrentTab("created")}
            className={`px-4 py-2 rounded-lg font-medium font-mono transition-all duration-300 ${
              currentTab === "created"
                ? "bg-slate-700/50 backdrop-blur-sm text-white shadow-md border border-white/20"
                : "bg-slate-100/40 backdrop-blur-sm text-slate-700 hover:bg-slate-200/50 border border-slate-300/20"
            }`}
          >
            Created by Me
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Show Ended Toggle */}
          <button
            onClick={() => setShowEnded(!showEnded)}
            className={`px-3 py-2 rounded-lg font-medium font-mono text-sm transition-all duration-300 border ${
              showEnded
                ? "bg-slate-700/50 text-white border-white/20"
                : "bg-[#18181B]/40 text-gray-400 border-white/10 hover:text-white"
            }`}
          >
            {showEnded ? "Hide Ended" : "Show Ended"}
          </button>

          {/* Search Input */}
          <div className="relative flex-1 md:w-64 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-white/50"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#18181B]/40 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent font-mono text-sm transition-all"
            />
          </div>

          {onCreateClick && (
            <button
              onClick={onCreateClick}
              className="px-4 py-2 bg-green-600/80 backdrop-blur-sm hover:bg-green-700/80 text-white font-medium font-mono rounded-lg transition-all duration-300 shadow-md border border-white/20 whitespace-nowrap"
            >
              + New
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white/20 border-r-white/80"></div>
          <p className="mt-4 text-gray-400 font-mono">Loading challenges...</p>
        </div>
      )}

      {/* Error State - Glass Card */}
      {error && (
        <div className="p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-lg text-red-400 shadow-md">
          <p className="font-medium font-mono">Error loading challenges</p>
          <p className="text-sm mt-1 font-mono">{error}</p>
          <button
            onClick={() => loadChallenges(true)}
            className="mt-3 text-sm text-red-400 hover:text-red-300 underline font-mono"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State - Glass Card */}
      {!isLoading && !error && filteredChallenges.length === 0 && (
        <div className="text-center py-16 bg-[#18181B]/40 backdrop-blur-sm rounded-xl border border-white/5">
          <div className="text-6xl mb-6 opacity-50">
            {searchQuery ? "🔍" : "🎯"}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 font-mono">
            {searchQuery
              ? "No challenges found"
              : currentTab === "created"
              ? "No challenges created yet"
              : currentTab === "my-challenges"
              ? "No challenges joined yet"
              : "No challenges available"}
          </h3>
          <p className="text-gray-400 mb-8 font-mono text-sm max-w-md mx-auto">
            {searchQuery
              ? `No results matching "${searchQuery}"`
              : currentTab === "created"
              ? "Create your first challenge to get started!"
              : currentTab === "my-challenges"
              ? "Join a challenge to start tracking your progress"
              : "Be the first to create a challenge!"}
          </p>
          {onCreateClick && !searchQuery && (
            <button
              onClick={onCreateClick}
              className="px-6 py-3 bg-green-600/80 hover:bg-green-600 text-white font-medium font-mono rounded-lg transition-all duration-300 shadow-lg shadow-green-900/20 border border-white/10"
            >
              Create Challenge
            </button>
          )}
        </div>
      )}

      {/* Challenge Grid - Responsive Grid Layout */}
      {!isLoading && !error && filteredChallenges.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => {
            const hasJoined = joinedChallengeIds.has(challenge.id);
            return (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onJoin={currentTab === "all" && !hasJoined ? handleJoinChallenge : undefined}
                onToggle={
                  currentTab === "created" || currentTab === "my-challenges" 
                    ? handleToggleChallenge 
                    : undefined
                }
                onClick={handleCardClick}
                showActions={true}
              />
            );
          })}
        </div>
      )}
      <ChallengeDetailModal
        challenge={selectedChallenge}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

