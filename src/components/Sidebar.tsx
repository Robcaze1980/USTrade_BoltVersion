import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart2,
  Globe,
  LineChart,
  CreditCard,
  FileText,
  History,
  Users,
  Bell,
  Search,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Trade Analysis', icon: BarChart2, href: '/trade-analysis' },
  { name: 'Market Insights', icon: LineChart, href: '/market-insights' },
  { name: 'Global Trends', icon: Globe, href: '/global-trends' },
  { name: 'Plans & Billing', icon: CreditCard, href: '/subscription' },
  { name: 'Usage & Reports', icon: FileText, href: '/reports' },
  { name: 'Activity History', icon: History, href: '/history' },
  { name: 'HS Code Manager', icon: Search, href: '/hs-codes' },
  { name: 'Team Access', icon: Users, href: '/team' },
  { name: 'Notifications', icon: Bell, href: '/notifications' },
]

const bottomMenuItems = [
  { name: 'Settings', icon: Settings, href: '/settings' },
  { name: 'Help & Support', icon: HelpCircle, href: '/support' },
]

export default function Sidebar() {
  const location = useLocation()

  const MenuItem = ({ icon: Icon, name, href }: { icon: any, name: string, href: string }) => {
    const isActive = location.pathname === href
    return (
      <Link
        to={href}
        className={`
          flex items-center px-4 py-3 
          transition-colors duration-300
          ${isActive ? 'text-[#322fef]' : 'text-gray-700 hover:text-[#322fef]'}
        `}
      >
        <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-[#322fef]' : 'text-gray-500'}`} />
        <span className="flex-1">{name}</span>
      </Link>
    )
  }

  return (
    <div className="w-[280px] h-screen bg-gray-100 flex flex-col fixed left-0 top-0 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <Link to="/" className="flex items-center">
          <Globe className="w-6 h-6 text-[#322fef]" />
          <span className="ml-2 text-gray-900 text-lg font-semibold">Trade Navigator</span>
        </Link>
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto pt-2">
        {menuItems.map(item => (
          <MenuItem key={item.href} {...item} />
        ))}
      </div>

      {/* Bottom Menu */}
      <div className="border-t border-gray-200 bg-gray-50 pt-2">
        {bottomMenuItems.map(item => (
          <MenuItem key={item.href} {...item} />
        ))}
        <div
          className="flex items-center px-4 py-3 text-red-600 cursor-pointer hover:text-red-700 transition-colors duration-300"
          onClick={() => {/* Add logout handler */}}
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  )
}