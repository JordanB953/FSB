'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function PublicNavigation() {
  const pathname = usePathname()

  return (
    <div className="flex justify-between items-center p-4">
      <div></div> {/* Empty div for flex spacing */}
      <div className="space-x-4">
        <Link 
          href="/about" 
          className={`${pathname === '/about' ? 'text-black' : 'text-blue-600'}`}
        >
          About
        </Link>
        <span>|</span>
        <Link 
          href="/pricing" 
          className={`${pathname === '/pricing' ? 'text-black' : 'text-blue-600'}`}
        >
          Pricing
        </Link>
        <span>|</span>
        <Link 
          href="/auth" 
          className={`${pathname === '/auth' ? 'text-black' : 'text-blue-600'}`}
        >
          Login
        </Link>
        <span>|</span>
        <select className="bg-transparent">
          <option>English</option>
          <option>Español</option>
        </select>
      </div>
    </div>
  )
}