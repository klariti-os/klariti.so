"use client";

import React from "react";
import { Challenge, ChallengeType } from "@/services/challenges";
import { useAuth } from "@/contexts/AuthContext";

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin?: (id: number) => void;
  onToggle?: (id: number) => void;
  showActions?: boolean;
  variant?: "default" | "compact";
}

export default function ChallengeCard({
  challenge,
  onJoin,
  onToggle,
  showActions = true,
  variant = "default",
}: ChallengeCardProps) {
  const { user } = useAuth();
  const isCreator = user?.id === challenge.creator_id;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = () => {
    if (challenge.completed) {
      return (
        <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100/70 text-green-700 rounded border border-green-200/40 font-mono">
          ✓ Done
        </span>
      );
    }

    if (challenge.challenge_type === ChallengeType.TOGGLE) {
      return challenge.toggle_details?.is_active ? (
        <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100/70 text-blue-700 rounded border border-blue-200/40 font-mono">
          🔵 Active
        </span>
      ) : (
        <span className="px-1.5 py-0.5 text-xs font-medium bg-slate-100/70 text-slate-600 rounded border border-slate-200/40 font-mono">
          ⚪ Off
        </span>
      );
    }

    if (challenge.challenge_type === ChallengeType.TIME_BASED && challenge.time_based_details) {
      const now = new Date();
      const start = new Date(challenge.time_based_details.start_date);
      const end = new Date(challenge.time_based_details.end_date);

      if (now < start) {
        return (
          <span className="px-1.5 py-0.5 text-xs font-medium bg-yellow-100/70 text-yellow-700 rounded border border-yellow-200/40 font-mono">
            ⏳ Soon
          </span>
        );
      }
      if (now > end) {
        return (
          <span className="px-1.5 py-0.5 text-xs font-medium bg-slate-100/70 text-slate-600 rounded border border-slate-200/40 font-mono">
            ⏹️ Ended
          </span>
        );
      }
      return (
        <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100/70 text-green-700 rounded border border-green-200/40 font-mono">
          ▶️ Live
        </span>
      );
    }

    return null;
  };

  if (variant === "compact") {
    return (
      <div className="p-2.5 bg-white/40 backdrop-blur-md border border-white/20 rounded-lg hover:border-slate-300/40 transition-all shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-xs text-slate-900 truncate font-mono">
                {challenge.name}
              </h3>
              {getStatusBadge()}
            </div>
            {challenge.description && (
              <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-mono">
                {challenge.description}
              </p>
            )}
          </div>
          {showActions && (
            <div className="flex items-center gap-2">
              {/* Toggle Switch for Toggle-Type Challenges (Creators & Participants) */}
              {challenge.challenge_type === ChallengeType.TOGGLE && onToggle && (
                <button
                  onClick={() => onToggle(challenge.id)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 ${
                    challenge.toggle_details?.is_active
                      ? "bg-blue-500/80 backdrop-blur-sm border border-blue-400/40"
                      : "bg-slate-300/60 backdrop-blur-sm border border-slate-400/40"
                  }`}
                  title={challenge.toggle_details?.is_active ? "Turn off" : "Turn on"}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      challenge.toggle_details?.is_active ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              )}
              
              {/* Join Button */}
              {onJoin && !isCreator && (
                <button
                  onClick={() => onJoin(challenge.id)}
                  className="px-2.5 py-1 text-xs bg-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 text-white rounded-md transition-all duration-200 whitespace-nowrap shadow-sm border border-white/20 font-mono"
                >
                  Join
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group p-3 bg-white/40 backdrop-blur-md border border-white/20 rounded-lg hover:border-slate-300/40 hover:bg-white/50 transition-all duration-200 shadow-sm">
      {/* Single Row Layout - Notion Style */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: Title & Info */}
        <div className="flex-1 min-w-0 flex items-center gap-3">
          {/* Title & Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm text-slate-900 truncate font-mono">
                {challenge.name}
              </h3>
              {getStatusBadge()}
              {isCreator && (
                <span className="px-1.5 py-0.5 bg-purple-100/70 backdrop-blur-sm text-purple-700 rounded text-xs font-mono border border-purple-200/40">
                  You
                </span>
              )}
            </div>
            {challenge.description && (
              <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-mono">
                {challenge.description}
              </p>
            )}
          </div>

          {/* Metadata Pills */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {/* Type Badge */}
            <span className="px-2 py-0.5 bg-slate-100/60 backdrop-blur-sm text-slate-700 rounded text-xs font-mono border border-slate-200/40">
              {challenge.challenge_type === ChallengeType.TIME_BASED ? "⏰ Timed" : "🔀 Toggle"}
            </span>

            {/* Time Info */}
            {challenge.challenge_type === ChallengeType.TIME_BASED &&
              challenge.time_based_details && (
                <span className="px-2 py-0.5 bg-slate-100/60 backdrop-blur-sm text-slate-600 rounded text-xs font-mono border border-slate-200/40">
                  {formatDate(challenge.time_based_details.start_date)} - {formatDate(challenge.time_based_details.end_date)}
                </span>
              )}

            {/* Strict Mode */}
            {challenge.strict_mode && (
              <span className="px-2 py-0.5 bg-orange-100/60 backdrop-blur-sm text-orange-700 rounded text-xs font-mono border border-orange-200/40">
                🔒 Strict
              </span>
            )}

            {/* Website Count */}
            {challenge.distracting_websites && challenge.distracting_websites.length > 0 && (
              <span className="px-2 py-0.5 bg-blue-100/60 backdrop-blur-sm text-blue-700 rounded text-xs font-mono border border-blue-200/40">
                🚫 {challenge.distracting_websites.length} sites
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        {showActions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Toggle Switch for Toggle-Type Challenges (Creators & Participants) */}
            {challenge.challenge_type === ChallengeType.TOGGLE && onToggle && (
              <button
                onClick={() => onToggle(challenge.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${
                  challenge.toggle_details?.is_active
                    ? "bg-blue-500/80 backdrop-blur-sm border border-blue-400/40"
                    : "bg-slate-300/60 backdrop-blur-sm border border-slate-400/40"
                }`}
                title={challenge.toggle_details?.is_active ? "Turn off challenge" : "Turn on challenge"}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    challenge.toggle_details?.is_active ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            )}
            
            {/* Join Button for Non-Creators */}
            {onJoin && !isCreator && (
              <button
                onClick={() => onJoin(challenge.id)}
                className="px-3 py-1.5 text-xs bg-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 text-white rounded-md transition-all duration-200 shadow-sm border border-white/20 font-mono"
              >
                Join
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
