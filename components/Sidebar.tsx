import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold">US Trade Navigator</h1>
      </div>
      <nav className="flex-grow p-4">
        <ul>
          <li className="mb-2">
            <Link to="/dashboard" className="block hover:bg-gray-700 p-2 rounded">
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/trade-data" className="block hover:bg-gray-700 p-2 rounded">
              Trade Data Analysis
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/market-analysis" className="block hover:bg-gray-700 p-2 rounded">
              Market Analysis
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/global-trends" className="block hover:bg-gray-700 p-2 rounded">
              Global Trends
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/subscription" className="block hover:bg-gray-700 p-2 rounded">
              Subscription
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/settings" className="block hover:bg-gray-700 p-2 rounded">
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
