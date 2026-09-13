// types/query.ts
export interface ApprovalQuery {
  id: string
  application_approval_id: string
  category: string
  message: string
  required_document_key: string | null
  response_deadline: string | null
  awaiting: 'applicant' | 'officer'
  applicant_response: string | null
  responded_at: string | null
  resolved: boolean
  created_at: string
}