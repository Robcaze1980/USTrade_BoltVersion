import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">
                US Trade Navigator
              </h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p>
                  Unlock global trade opportunities with our comprehensive platform.
                </p>
                <p>
                  Access real-time trade data, analyze market trends, and optimize
                  your import/export strategies.
                </p>
                <ul className="list-disc space-y-2">
                  <li className="pl-4">
                    Real-time trade data and analytics
                  </li>
                  <li className="pl-4">HS code subscriptions and alerts</li>
                  <li className="pl-4">Market trend analysis</li>
                  <li className="pl-4">Subscription billing and payment processing</li>
                </ul>
                <p>
                  Ready to get started?
                </p>
              </div>
              <div className="pt-6 text-base font-semibold leading-6 sm:text-lg">
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="ml-4 px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-gray-50"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
