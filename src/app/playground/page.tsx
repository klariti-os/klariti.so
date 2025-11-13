"use client";

import PillButton from "@/components/PillButton"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { Metadata, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"

const ToolsPage: NextPage = () => {
  const { user } = useAuth();
  
  return (
    <ProtectedRoute>
      <div className="px-6">
        <main className="w-full max-w-2xl mx-auto mt-10 mb-20">
          {user && (
            <div className="mb-6 p-4 bg-white/30 backdrop-blur-sm rounded-lg">
              <p className="text-sm text-slate-600 font-mono">
                Welcome back, <span className="font-bold">{user.username}</span>! 👋
              </p>
            </div>
          )}
          
          <h1 className="text-xl font-medium">Playground</h1>
          <p className="mt-4 ">Testing and viewing demos and protypes</p>

          <div className="mt-6">
            <div className="flex flex-col max-w-3xl space-y-2">
        
              <Link legacyBehavior href="playground/ios">
                  <PillButton>Klariti iOS app mockup</PillButton>
              </Link>

            </div> 
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default ToolsPage
