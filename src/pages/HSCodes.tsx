"use client"

import { useState, useEffect } from 'react'
import { Search, Plus, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface HTSCode {
  hts10: string
  description_short: string
}

interface UserHTSCode {
  hs_code_id: string
  description_short?: string
}

export default function HSCodes() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<HTSCode[]>([])
  const [activeCodes, setActiveCodes] = useState<UserHTSCode[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUserHSCodes()
  }, [])

  const fetchUserHSCodes = async () => {
    try {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // First get the user's HS codes
      const { data: userCodes, error: userCodesError } = await supabase
        .from('user_hs_codes')
        .select('hs_code_id')
        .eq('user_id', user.id)

      if (userCodesError) throw userCodesError

      if (!userCodes || userCodes.length === 0) {
        setActiveCodes([])
        return
      }

      // Then get the descriptions for those codes
      const { data: descriptions, error: descriptionsError } = await supabase
        .from('hts_concordance')
        .select('hts10, description_short')
        .in('hts10', userCodes.map(code => code.hs_code_id))

      if (descriptionsError) throw descriptionsError

      // Combine the data
      const codesWithDescriptions = userCodes.map(userCode => ({
        hs_code_id: userCode.hs_code_id,
        description_short: descriptions?.find(d => d.hts10 === userCode.hs_code_id)?.description_short
      }))

      setActiveCodes(codesWithDescriptions)
    } catch (error: any) {
      toast.error('Failed to fetch your HTS codes')
      console.error('Error fetching user HTS codes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const searchHSCodes = async () => {
    if (!searchQuery.trim()) return

    try {
      setIsSearching(true)
      setSearchResults([]) // Clear previous results

      // First try exact match
      const { data: exactMatch, error: exactError } = await supabase
        .from('hts_concordance')
        .select('hts10, description_short')
        .eq('hts10', searchQuery.trim())
        .limit(1)

      if (exactError) throw exactError

      // Then try partial matches if no exact match found
      const { data: partialMatches, error: partialError } = await supabase
        .from('hts_concordance')
        .select('hts10, description_short')
        .or(`hts10.ilike.${searchQuery}%,description_short.ilike.%${searchQuery}%`)
        .not('hts10', 'eq', searchQuery) // Exclude exact match if found
        .limit(19) // Limit to 19 to make room for exact match if found

      if (partialError) throw partialError

      // Combine results, putting exact match first if found
      const combinedResults = [
        ...(exactMatch || []),
        ...(partialMatches || [])
      ]

      if (combinedResults.length === 0) {
        toast.info('No HTS codes found matching your search')
      }

      setSearchResults(combinedResults)
    } catch (error: any) {
      toast.error('Search failed')
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const addHSCode = async (code: HTSCode) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const isCodeAdded = activeCodes.some(c => c.hs_code_id === code.hts10)
      if (isCodeAdded) {
        toast.error('This HTS code is already in your list')
        return
      }

      const { error } = await supabase
        .from('user_hs_codes')
        .insert([{
          user_id: user.id,
          hs_code_id: code.hts10
        }])

      if (error) throw error

      // Add the new code to activeCodes immediately
      setActiveCodes(prev => [...prev, {
        hs_code_id: code.hts10,
        description_short: code.description_short
      }])

      toast.success('HTS code added successfully')
      setSearchResults([])
      setSearchQuery('')
    } catch (error: any) {
      toast.error('Failed to add HTS code')
      console.error('Error adding HTS code:', error)
    }
  }

  const removeHSCode = async (codeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('user_hs_codes')
        .delete()
        .eq('user_id', user.id)
        .eq('hs_code_id', codeId)

      if (error) throw error

      // Remove the code from activeCodes immediately
      setActiveCodes(prev => prev.filter(code => code.hs_code_id !== codeId))
      toast.success('HTS code removed')
    } catch (error: any) {
      toast.error('Failed to remove HTS code')
      console.error('Error removing HTS code:', error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">HTS Code Manager</h1>

      {/* Search Section */}
      <Card className="p-6 mb-8">
        <div className="flex gap-4">
          <Input
            placeholder="Enter HTS code (e.g., 0101210010) or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchHSCodes()}
            className="flex-1"
          />
          <Button
            onClick={searchHSCodes}
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Search
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Search Results</h2>
            <div className="space-y-2">
              {searchResults.map((code) => (
                <div
                  key={code.hts10}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{code.hts10}</p>
                    <p className="text-sm text-gray-600">{code.description_short}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addHSCode(code)}
                    disabled={activeCodes.some(c => c.hs_code_id === code.hts10)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Active Codes Section */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Your HTS Codes</h2>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : activeCodes.length > 0 ? (
          <div className="space-y-2">
            {activeCodes.map((code) => (
              <div
                key={code.hs_code_id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border"
              >
                <div>
                  <p className="font-medium">{code.hs_code_id}</p>
                  <p className="text-sm text-gray-600">
                    {code.description_short || 'Description not available'}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeHSCode(code.hs_code_id)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            You haven't added any HTS codes yet. Use the search above to find and add codes.
          </p>
        )}
      </Card>
    </div>
  )
}