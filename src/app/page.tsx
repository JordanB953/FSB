'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Home() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="text-2xl font-bold">Welcome to FSB</h1>
      <button
        onClick={handleSignOut}
        className="mt-4 rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  )
}