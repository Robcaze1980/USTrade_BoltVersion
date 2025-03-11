export default function Subscription() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
      <p className="mt-4 text-gray-600">
        Manage your subscription plan and billing details.
      </p>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Current Plan
        </h2>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-500">Plan Name: Basic</p>
          <p className="text-sm text-gray-500">Cost: $9.99/month</p>
          <p className="text-sm text-gray-500">Max HS Codes Allowed: 20</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Usage Statistics
        </h2>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-500">HS Codes Subscribed: 15</p>
          <p className="text-sm text-gray-500">Queries Executed: 120</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Manage Subscription
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Upgrade Plan
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Downgrade Plan
          </button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Cancel Subscription
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Billing History
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">2025-03-11</td>
                <td className="px-6 py-4 whitespace-nowrap">Subscription Payment</td>
                <td className="px-6 py-4 whitespace-nowrap">$9.99</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">2025-02-11</td>
                <td className="px-6 py-4 whitespace-nowrap">Subscription Payment</td>
                <td className="px-6 py-4 whitespace-nowrap">$9.99</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">2025-01-11</td>
                <td className="px-6 py-4 whitespace-nowrap">Subscription Payment</td>
                <td className="px-6 py-4 whitespace-nowrap">$9.99</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
