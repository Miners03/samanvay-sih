import { supabase } from './client';
import { mapApplicationToProject } from './projectMapper';
import { Project } from '@/lib/types';

export async function fetchApplicantProject(userId: string): Promise<Project | null> {
  const { data: app, error: appError } = await supabase
    .from('applications')
    .select('*')
    .eq('applicant_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (appError || !app) return null;

  const { data: approvalRows } = await supabase
    .from('application_approvals')
    .select('*')
    .eq('application_id', app.id)
    .order('id', { ascending: true });

  const { data: deptRows } = await supabase.from('departments').select('dept_tag, display_name');
  const deptNameByTag: Record<string, string> = {};
  (deptRows ?? []).forEach(d => { deptNameByTag[d.dept_tag] = d.display_name; });

  const approvalIds = (approvalRows ?? []).map(a => a.id);
  const { data: queryRows } = approvalIds.length
    ? await supabase.from('queries').select('*').in('application_approval_id', approvalIds)
    : { data: [] as any[] };

  return mapApplicationToProject(app, approvalRows ?? [], deptNameByTag, queryRows ?? []);
}

export async function createApplication(userId: string, industryId: string, businessName: string, submittedData: Record<string, any>) {
  const { data, error } = await supabase
    .from('applications')
    .insert({ applicant_id: userId, industry_id: industryId, business_name: businessName, submitted_data: submittedData })
    .select()
    .single();

  if (error) throw error;
  return data; // the on_application_created trigger auto-generates application_approvals from the industry template
}

export async function fetchIndustries() {
  const { data, error } = await supabase.from('industries').select('industry_id, industry_name').order('industry_name');
  if (error) throw error;
  return data ?? [];
}