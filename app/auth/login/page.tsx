'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function LoginPage() {
  const [mode, setMode] = useState<'login'|'signup'>('login')
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleAuth() {
    setError(''); setLoading(true)
    const redirectTo = ${location.origin}/auth/callback
    if (mode === 'signup') {
      if (!displayName.trim()) { setError('Please enter your name.'); setLoading(false); return }
      const { error: err } = await supabase.auth.signUp({
        email, password: Math.random().toString(36) + Math.random().toString(36),
        options: { emailRedirectTo: redirectTo, data: { display_name: displayName.trim() } }
      })
      if (err) setError(err.message)
      else setSent(true)
    } else {
      const { error: err } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } })
      if (err) setError(err.message)
      else setSent(true)
    }
    setLoading(false)
  }

  const inp: React.CSSProperties = { width:'100%', padding:'12px 14px', borderRadius:10, border:'1.5px solid #334155', background:'#0f172a', color:'#f8fafc', fontSize:14, outline:'none', marginBottom:14 }

  if (sent) return (
    <div style={{minHeight:'100vh',background:'#0f172a',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{background:'#1e293b',borderRadius:20,padding:40,maxWidth:400,width:'100%',textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>📧</div>
        <div style={{fontSize:20,fontWeight:900,color:'#f8fafc',marginBottom:8}}>Check your email</div>
        <div style={{fontSize:14,color:'#94a3b8'}}>Magic link sent to <strong style={{color:'#f8fafc'}}>{email}</strong></div>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#0f172a',display:'flex',alignItems:'center',justifyContent:'center
