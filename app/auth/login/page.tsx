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
    <div style={{minHeight:'100vh',background:'#0f172a',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{background:'#1e293b',borderRadius:20,padding:'40px 36px',width:'100%',maxWidth:420}}>
        <div style={{fontSize:40,marginBottom:12}}>📋</div>
        <div style={{fontSize:26,fontWeight:900,color:'#f8fafc',marginBottom:4}}>Rota App</div>
        <div style={{fontSize:13,color:'#64748b',marginBottom:32}}>Team shift schedule manager</div>
        {error && <div style={{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:8,padding:'10px 14px',color:'#dc2626',fontSize:13,marginBottom:16}}>⚠️ {error}</div>}
        {mode === 'signup' && (
          <>
            <label style={{fontSize:11,fontWeight:700,color:'#64748b',textTransform:'uppercase' as const,letterSpacing:1,display:'block',marginBottom:6}}>Your full name</label>
            <input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="As it appears in the rota" style={inp} />
          </>
        )}
        <label style={{fontSize:11,fontWeight:700,color:'#64748b',textTransform:'uppercase' as const,letterSpacing:1,display:'block',marginBottom:6}}>Email address</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@hospital.com" style={inp} onKeyDown={e=>e.key==='Enter'&&handleAuth()} />
        <button onClick={handleAuth} disabled={loading||!email}
          style={{width:'100%',padding:13,borderRadius:10,border:'none',background:!email?'#334155':'#3b82f6',color:'#fff',fontWeight:700,fontSize:15,cursor:!email?'default':'pointer',marginBottom:16,opacity:loading?0.7:1}}>
          {loading?'Sending…':mode==='login'?'Send magic link ✉️':'Create account →'}
        </button>
        <div style={{textAlign:'center',fontSize:13,color:'#64748b'}}>
          {mode==='login'
            ?<>No account? <span onClick={()=>setMode('signup')} style={{color:'#3b82f6',cursor:'pointer',fontWeight:600}}>Sign up</span></>
            :<>Have account? <span onClick={()=>setMode('login')} style={{color:'#3b82f6',cursor:'pointer',fontWeight:600}}>Sign in</span></>
          }
        </div>
      </div>
    </div>
  )
}
