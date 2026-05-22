import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()
  const groupId = profile?.group_id
  const [membersRes, shiftsRes, tagsRes, swapsRes] = await Promise.all([
    groupId ? supabase.from('members').select('*').eq('group_id', groupId) : { data: [] },
    groupId ? supabase.from('shifts').select('*').eq('group_id', groupId) : { data: [] },
    groupId ? supabase.from('shift_tags').select('*').eq('group_id', groupId) : { data: [] },
    groupId ? supabase.from('swap_requests').select('*').eq('group_id', groupId) : { data: [] },
  ])
  return (
    <DashboardClient
      profile={profile}
      members={membersRes.data ?? []}
      shifts={shiftsRes.data ?? []}
      shiftTags={tagsRes.data ?? []}
      swapRequests={swapsRes.data ?? []}
    />
  )
}
