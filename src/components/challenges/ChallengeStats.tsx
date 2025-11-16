"use client";

import React, { useEffect, useState } from "react";
import { getMyChallenges, getMyCreatedChallenges } from "@/services/challenges";

interface ChallengeStats {
  totalJoined: number;
  activeJoined: number;
  completedJoined: number;
  totalCreated: number;
  activeCreated: number;
}

export default function ChallengeStats() {
  const [stats, setStats] = useState<ChallengeStats>({
    totalJoined: 0,
    activeJoined: 0,
    completedJoined: 0,
    totalCreated: 0,
    activeCreated: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [joined, created] = await Promise.all([
        getMyChallenges(),
        getMyCreatedChallenges(),
      ]);

      const activeJoined = joined.filter(
        (c) =>
          !c.completed &&
          (c.toggle_details?.is_active ||
            (c.time_based_details &&
              new Date(c.time_based_details.start_date) <= new Date() &&
              new Date(c.time_based_details.end_date) >= new Date()))
      ).length;

      const completedJoined = joined.filter((c) => c.completed).length;

      const activeCreated = created.filter(
        (c) =>
          !c.completed &&
          (c.toggle_details?.is_active ||
            (c.time_based_details &&
              new Date(c.time_based_details.start_date) <= new Date() &&
              new Date(c.time_based_details.end_date) >= new Date()))
      ).length;

      setStats({
        totalJoined: joined.length,
        activeJoined,
        completedJoined,
        totalCreated: created.length,
        activeCreated,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white/40 backdrop-blur-sm border border-white/20 rounded-lg animate-pulse shadow-md"
          >
            <div className="h-8 bg-slate-300/50 rounded mb-2"></div>
            <div className="h-4 bg-slate-200/50 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="display grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard
        value={stats.totalJoined}
        label="Challenges Joined"
        color="blue"
        icon="🎯"
      />
      <StatCard
        value={stats.activeJoined}
        label="Active"
        color="green"
        icon="🔥"
      />
      <StatCard
        value={stats.completedJoined}
        label="Completed"
        color="purple"
        icon="✅"
      />
      <StatCard
        value={stats.totalCreated}
        label="Created"
        color="orange"
        icon="⭐"
      />
      <StatCard
        value={stats.activeCreated}
        label="Active Created"
        color="pink"
        icon="🚀"
      />
    </div>
  );
}

interface StatCardProps {
  value: number;
  label: string;
  color: "blue" | "green" | "purple" | "orange" | "pink";
  icon: string;
}

function StatCard({ value, label, color, icon }: StatCardProps) {
  const colorClasses = {
    blue: "from-blue-100/60 to-blue-200/60 border-blue-300/40 text-blue-800",
    green: "from-green-100/60 to-green-200/60 border-green-300/40 text-green-800",
    purple: "from-purple-100/60 to-purple-200/60 border-purple-300/40 text-purple-800",
    orange: "from-orange-100/60 to-orange-200/60 border-orange-300/40 text-orange-800",
    pink: "from-pink-100/60 to-pink-200/60 border-pink-300/40 text-pink-800",
  };

  return (
    <div
      className={`p-4 bg-gradient-to-br backdrop-blur-md ${colorClasses[color]} border rounded-xl transition-all duration-300 hover:scale-105 shadow-md`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl font-bold font-mono">{value}</div>
        <div className="text-2xl">{icon}</div>
      </div>
      <div className="text-sm font-medium opacity-90 font-mono">{label}</div>
    </div>
  );
}
