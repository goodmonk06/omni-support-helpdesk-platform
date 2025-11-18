import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
          Omni-Channel Helpdesk Platform
        </h1>
        <p className="text-lg leading-8 text-gray-600 mb-8">
          Manage support requests from email, contact forms, and chat widgets with AI-powered reply suggestions.
        </p>
        <div className="flex items-center justify-center gap-x-6">
          <Link
            href="/tickets"
            className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            View Tickets
          </Link>
          <Link
            href="/admin"
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
          >
            Admin Panel <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Multi-Channel Support</h3>
          <p className="text-gray-600">
            Collect tickets from email, web forms, and chat widgets in one unified inbox.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">AI-Powered Replies</h3>
          <p className="text-gray-600">
            Get intelligent reply suggestions powered by OpenAI to respond faster and more effectively.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Team Management</h3>
          <p className="text-gray-600">
            Assign tickets, track status, and manage your support team with ease.
          </p>
        </div>
      </div>
    </div>
  )
}
