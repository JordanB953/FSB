'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function AuthenticatedNavigation() {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-end items-center space-x-4">
          <Link 
            href="/home"
            className="text-blue-600 hover:underline"
          >
            Home
          </Link>
          
          <span className="text-gray-500">|</span>
          
          <Link 
            href="/account"
            className="text-blue-600 hover:underline"
          >
            Account
          </Link>
          
          <span className="text-gray-500">|</span>
          
          <button
            onClick={handleLogout}
            className="text-blue-600 hover:underline"
          >
            Log out
          </button>
          
          <span className="text-gray-500">|</span>
          
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="text-gray-900 hover:underline flex items-center"
            >
              English
              <svg 
                className="w-4 h-4 ml-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </button>

            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg">
                <button
                  onClick={() => {
                    // Handle language change
                    setIsLanguageOpen(false)
                  }}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                >
                  English
                </button>
                <button
                  onClick={() => {
                    // Handle language change
                    setIsLanguageOpen(false)
                  }}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                >
                  Español
                </button>
                {/* Add more languages as needed */}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}