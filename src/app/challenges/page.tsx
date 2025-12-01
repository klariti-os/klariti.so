"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { NextPage } from "next";
import ChallengeList from "@/components/challenges/ChallengeList";
import CreateChallengeForm from "@/components/challenges/CreateChallengeForm";
import ChallengeStats from "@/components/challenges/ChallengeStats";

const ChallengesPage: NextPage = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <ProtectedRoute>
      <div className="px-6 pb-20">
        <main className="w-full max-w-6xl mx-auto mt-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Challenges
            </h1>
            <p className="text-slate-600">
              Create, join, and manage your productivity challenges
            </p>
          </div>

          {/* Stats Widget */}
          <div className="mb-8">
            <ChallengeStats key={refreshKey} />
          </div>

          {/* Create Challenge Section */}
          {showCreateForm ? (
            <div className="mb-8 p-6 bg-white border border-slate-200 rounded-lg shadow-lg">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  Create New Challenge
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Set up a new challenge to improve your focus and productivity
                </p>
              </div>
              <CreateChallengeForm
                onSuccess={handleCreateSuccess}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          ) : null}

          {/* Challenge List */}
          <ChallengeList
            key={refreshKey}
            onCreateClick={() => setShowCreateForm(true)}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default ChallengesPage;
