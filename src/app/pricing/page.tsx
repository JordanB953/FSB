import Navigation from '@/app/components/PublicNavigation'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center space-y-8">
          <h2 className="text-2xl">
            1 credit allows you to convert 1 PDF page of bank,
            credit card, or loan statements
          </h2>

          <p className="text-xl">
            We gift all users 5 credits to test the Financial
            Statement Builder.
          </p>

          <p className="text-xl">
            Afterwards, you select a subscription plan.
          </p>

          <div className="mt-12">
            <Link 
              href="/auth"
              className="text-blue-600 text-xl hover:underline"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}