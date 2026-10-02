import { supabase } from './supabase';
// or if you are using alias imports from the project root:
// import { supabase } from '@/lib/supabase';
export async function signInAndGetRole(email: string, password: string) {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    throw new Error(authError?.message ?? 'Login failed');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, id')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('Logged in, but no profile/role found for this user.');
  }

  return { user: authData.user, role: profile.role as 'applicant' | 'officer' | 'admin' };
}