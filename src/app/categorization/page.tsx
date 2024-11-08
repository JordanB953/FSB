'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CategorizationPage() {
  const router = useRouter()

  useEffect(() => {
    // Add any initialization or verification logic here
    // You could check the upload status from your server/database
    
    // For demo purposes, simulating a delay before redirecting
    const timeout = setTimeout(() => {
      router.push('/home')
    }, 30000) // Adjust timeout as needed

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="text-center space-y-6">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            Please wait while we categorize your transactions.
          </h1>
          <p className="text-gray-600">
            Please do not refresh the page.
          </p>
        </div>
      </div>
    </div>
  )
}