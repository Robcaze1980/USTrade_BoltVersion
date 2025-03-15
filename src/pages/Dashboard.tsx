import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { BarChart3, TrendingUp, Package, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

interface HSCode {
  id: string
  hs_code_description: string
}

interface TradeStats {
  value: number
  volume: number
  year_val: number
  month_val: number
  trade_flow: string
  hs_code_id?: string
}

interface UserProfile {
  id: string
  email: string
  full_name: string | null
}

interface Subscription {
  plan_type: string
  status: string
  current_period_end: string
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [hsCodes, setHsCodes] = useState<HSCode[]>([])
  const [tradeStats, setTradeStats] = useState<TradeStats[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      setLoading(true)

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) {
        throw new Error('No authenticated user found')
      }

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
        // Don't throw here, continue with other data
      } else {
        setProfile(profileData)
      }

      // Fetch subscription data
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        console.error('Subscription fetch error:', subscriptionError)
      } else {
        setSubscription(subscriptionData)
      }

      // Fetch user's HS codes
      const { data: userHsCodes, error: hsCodesError } = await supabase
        .from('user_hs_codes')
        .select(`
          hs_codes (
            id,
            hs_code_description
          )
        `)
        .eq('user_id', user.id)

      if (hsCodesError) {
        console.error('HS codes fetch error:', hsCodesError)
      } else {
        const codes = userHsCodes?.map(item => item.hs_codes).filter(Boolean) || []
        setHsCodes(codes)

        // Only fetch trade stats if we have HS codes
        if (codes.length > 0) {
          const hsCodeIds = codes.map(code => code.id)
          
          const { data: tradeStatsData, error: tradeStatsError } = await supabase
            .from('trade_stats')
            .select('*')
            .in('hs_code_id', hsCodeIds)
            .order('year_val', { ascending: false })
            .order('month_val', { ascending: false })
            .limit(10)

          if (tradeStatsError) {
            console.error('Trade stats fetch error:', tradeStatsError)
          } else {
            setTradeStats(tradeStatsData || [])
          }
        }
      }

    } catch (error: any) {
      console.error('Dashboard data fetch error:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const welcomeName = profile?.full_name || profile?.email?.split('@')[0] || 'Guest'

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {welcomeName}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's your latest trade overview
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <QuickStatCard
          title="Active HS Codes"
          value={hsCodes.length.toString()}
          icon={<Package className="h-6 w-6" />}
          description="Monitored codes"
        />
        <QuickStatCard
          title="Subscription"
          value={subscription?.plan_type || 'Free'}
          icon={<Calendar className="h-6 w-6" />}
          description={`Status: ${subscription?.status || 'Inactive'}`}
        />
        <QuickStatCard
          title="Total Trade Value"
          value={`$${formatNumber(calculateTotalTradeValue(tradeStats))}`}
          icon={<BarChart3 className="h-6 w-6" />}
          description="Last 30 days"
        />
        <QuickStatCard
          title="Trade Growth"
          value={`${calculateTradeGrowth(tradeStats)}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          description="Year over year"
        />
      </div>

      {/* HS Codes Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your HS Codes</h2>
        {hsCodes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hsCodes.map((code) => (
              <HSCodeCard
                key={code.id}
                code={code}
                stats={tradeStats.filter(stat => stat.hs_code_id === code.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-600">
              You haven't added any HS codes yet. 
              <a href="/hs-codes" className="text-blue-600 hover:text-blue-700 ml-1">
                Add your first HS code
              </a>
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

function QuickStatCard({ title, value, icon, description }: {
  title: string
  value: string
  icon: React.ReactNode
  description: string
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="rounded-full p-2 bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </Card>
  )
}

function HSCodeCard({ code, stats }: { 
  code: HSCode
  stats: TradeStats[]
}) {
  const latestStat = stats[0] || { value: 0, volume: 0 }

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-gray-900">HS {code.id}</h3>
      <p className="text-sm text-gray-500 mt-1">{code.hs_code_description}</p>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Trade Value</span>
          <span className="text-sm font-medium">${formatNumber(latestStat.value)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Volume</span>
          <span className="text-sm font-medium">{formatNumber(latestStat.volume)} units</span>
        </div>
      </div>
      <a
        href={`/trade-analysis/${code.id}`}
        className="mt-4 block w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-center hover:bg-blue-100 transition-colors"
      >
        View Analysis
      </a>
    </Card>
  )
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    notation: 'compact',
    compactDisplay: 'short'
  }).format(num)
}

function calculateTotalTradeValue(stats: TradeStats[]): number {
  return stats.reduce((total, stat) => total + (stat.value || 0), 0)
}

function calculateTradeGrowth(stats: TradeStats[]): number {
  if (stats.length < 2) return 0
  
  const sortedStats = [...stats].sort((a, b) => {
    const dateA = new Date(a.year_val, a.month_val - 1)
    const dateB = new Date(b.year_val, b.month_val - 1)
    return dateB.getTime() - dateA.getTime()
  })

  const currentValue = sortedStats[0]?.value || 0
  const previousValue = sortedStats[1]?.value || 0

  if (previousValue === 0) return 0
  return Math.round(((currentValue - previousValue) / previousValue) * 100)
}