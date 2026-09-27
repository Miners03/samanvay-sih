import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type ApprovalRow = Record<string, unknown> & { id?: unknown }

const referenceKeys = ['reference_id', 'referenceId', 'application_ref', 'applicationRef', 'display_id', 'displayId']

function getReference(row: ApprovalRow) {
  for (const key of referenceKeys) {
    if (typeof row[key] === 'string') return row[key] as string
  }
  return undefined
}

/** Resolves the registry's display/reference ID to application_approvals.id (the UUID PK). */
export function useApprovalIdentities() {
  const [rows, setRows] = useState<ApprovalRow[]>([])

  useEffect(() => {
    let mounted = true
    void supabase.from('application_approvals').select('*').then(({ data, error }) => {
      if (error) {
        console.error('Failed to fetch application approval identities', error)
        return
      }
      if (mounted) setRows((data ?? []) as ApprovalRow[])
    })
    return () => { mounted = false }
  }, [])

  return useMemo(() => {
    const byReference = new Map<string, string>()
    rows.forEach(row => {
      const reference = getReference(row)
      if (typeof row.id === 'string' && reference) byReference.set(reference, row.id)
    })
    return { getUuid: (referenceId: string) => byReference.get(referenceId) }
  }, [rows])
}

