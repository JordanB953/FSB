// src/app/home/page.tsx
'use client'

import Link from 'next/link'
import AuthenticatedNavigation from '../components/AuthenticatedNavigation'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <AuthenticatedNavigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">
          Create financial statements for a new company
        </h1>
        
        <div className="flex justify-center mb-12">
          <Link 
            href="/start"
            className="text-blue-600 text-xl hover:underline"
          >
            Start
          </Link>
        </div>

        <div className="border-t pt-8">
          <Link 
            href="https://www.youtube.com/tutorial" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-xl hover:underline block text-center"
          >
            How to use the Financial Statement Builder
          </Link>
        </div>
      </div>
    </div>
  )
}