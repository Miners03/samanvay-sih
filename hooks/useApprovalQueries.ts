import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ApprovalQuery } from '@/lib/types/query'

export function useApprovalQueries(approvalId: string) {
  const [queries, setQueries] = useState<ApprovalQuery[]>([])

  useEffect(() => {
    if (!approvalId) {
      setQueries([])
      return
    }

    const fetchQueries = async () => {
      const { data, error } = await supabase
        .from('queries')
        .select('*')
        .eq('application_approval_id', approvalId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to fetch approval queries', error)
        return
      }

      setQueries(data ?? [])
    }

    void fetchQueries()

    const channel = supabase
      .channel(`queries-${approvalId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queries',
          filter: `application_approval_id=eq.${approvalId}`,
        },
        () => void fetchQueries()
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [approvalId])

  return queries
}
