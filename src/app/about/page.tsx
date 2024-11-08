// app/about/page.tsx
import Navigation from '@/app/components/PublicNavigation'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold mb-8">
          Welcome to the<br />
          Financial Statement Builder
        </h1>

        <p className="text-xl mb-8">
          Easily convert PDF bank, credit card, and loan statements
          into an income statement, cash flow statement, and balance
          sheet.
        </p>

        <p className="text-lg mb-12">
          Our mission is to help you create and maintain accurate
          financial statements. To learn more about the Financial
          Statement Builder (FSB) and our team, please see the video
          below.
        </p>

        <div className="mb-8">
          {/* YouTube video embed placeholder */}
          <div className="aspect-video bg-gray-200 max-w-2xl mx-auto">
            [embedded YouTube video]
          </div>
        </div>

        <p className="text-sm text-gray-600 italic">
          *Disclaimer: Financial statements created by the FSB are not
          GAAP compliant. FSB has not verified and cannot attest to
          the completeness or accuracy of the financial statements
          produced.
        </p>
      </main>
    </div>
  )
}