export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-6">
        {/* Header & Quick Info */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome, [User Name]!
            </h1>
          </div>
          <div className="flex items-center">
            {/* Profile Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-4"></div>
            {/* Subscription Summary Card */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-500">Current Plan: Basic</p>
              <p className="text-sm text-gray-500">20 HS Codes Subscribed</p>
              <p className="text-sm text-gray-500">Next Billing Date: 2025-04-11</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trade Snapshot */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Trade Snapshot
            </h2>
            {/* Key metrics and mini chart */}
            <p className="text-sm text-gray-500">
              Total Trade Volume: [Value]
            </p>
            <p className="text-sm text-gray-500">Recent Trends: [Trends]</p>
            <button className="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2">
              View Full Trade Data
            </button>
          </div>

          {/* Market Highlights */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Market Highlights
            </h2>
            {/* Top insights and market movers */}
            <p className="text-sm text-gray-500">
              [Trending commodities and market movers]
            </p>
            <button className="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2">
              View Deeper Analysis
            </button>
          </div>

          {/* HS Codes Overview Widget */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              HS Codes Overview
            </h2>
            {/* List of HS codes and summary metrics */}
            <p className="text-sm text-gray-500">
              [List of HS codes and summary metrics]
            </p>
            <button className="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2">
              View Details
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Recent Activity
            </h2>
            {/* Recent queries, saved reports, or system logs */}
            <p className="text-sm text-gray-500">
              [Recent queries, saved reports, or system logs]
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
