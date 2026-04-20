'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const TREND_COLORS = { Growing: '#22c55e', Stable: '#f59e0b', Declining: '#ef4444' }
const UPSIDE_COLORS = { High: '#22c55e', Medium: '#f59e0b', Low: '#6b7280' }

export default function Dashboard() {
  const router = useRouter()
  const [matches, setMatches] = useState([])
  const [profile, setProfile] = useState(null)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    const m = localStorage.getItem('tae_matches')
    const p = localStorage.getItem('tae_profile')
    if (m) setMatches(JSON.parse(m))
    if (p) setProfile(JSON.parse(p))
  }, [])

  if (!matches.length) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px' }}>No matches yet</h2>
      <button className="btn-primary" onClick={() => router.push('/onboarding')}>Build Your Profile →</button>
    </main>
  )

  const match = matches[selected]

  return (
    <main style={{ minHeight: '100vh', padding: '32px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Georgia, serif' }}>
            {profile?.name ? `${profile.name}'s` : 'Your'} Career Matches
          </h1>
          <p style={{ color: '#6b9e7e', marginTop: '4px' }}>{profile?.location} · {matches.length} paths identified</p>
        </div>
        <button onClick={() => router.push('/onboarding')} style={{ background: 'transparent', border: '1px solid #1e3028', color: '#6b9e7e', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>
          ↺ Retake Profile
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {matches.map((m, i) => (
            <div key={i} onClick={() => setSelected(i)} className="card" style={{ cursor: 'pointer', border: selected === i ? '1px solid #22c55e' : '1px solid #1e3028', transition: 'all 0.2s', background: selected === i ? 'rgba(34,197,94,0.06)' : 'var(--surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: '#6b9e7e', background: '#111a15', border: '1px solid #1e3028', padding: '2px 8px', borderRadius: '999px' }}>{m.category}</span>
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#22c55e', fontFamily: 'Georgia, serif' }}>{m.matchScore}%</span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{m.title}</h3>
              <p style={{ fontSize: '12px', color: '#6b9e7e' }}>${m.avgMonthlyUSD?.toLocaleString()}/mo · {m.demandTrend}</p>
            </div>
          ))}
        </div>

        <div className="card" style={{ position: 'sticky', top: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#6b9e7e', textTransform: 'uppercase', letterSpacing: '1px' }}>{match.category}</span>
              <h2 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Georgia, serif', marginTop: '4px' }}>{match.title}</h2>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#22c55e', fontFamily: 'Georgia, serif', lineHeight: 1 }}>{match.matchScore}%</div>
              <div style={{ fontSize: '11px', color: '#6b9e7e', marginTop: '2px' }}>match score</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Monthly Avg', value: `$${match.avgMonthlyUSD?.toLocaleString()}` },
              { label: 'Demand', value: match.demandTrend, color: TREND_COLORS[match.demandTrend] },
              { label: 'Upside', value: match.upsidePotential, color: UPSIDE_COLORS[match.upsidePotential] },
              { label: 'Time to Transition', value: match.timeToTransition },
              { label: 'Remote Viable', value: match.remoteViable ? '✓ Yes' : '✗ No', color: match.remoteViable ? '#22c55e' : '#ef4444' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '14px', border: '1px solid #1a2820' }}>
                <div style={{ fontSize: '11px', color: '#6b9e7e', marginBottom: '4px' }}>{s.label}</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: s.color || '#e8f5ee' }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '13px', color: '#6b9e7e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Why This Matches You</h4>
            <p style={{ lineHeight: '1.7', color: '#c8e8d4', fontSize: '15px' }}>{match.whyMatch}</p>
          </div>

          {match.topSkillsNeeded?.length > 0 && (
            <div>
              <h4 style={{ fontSize: '13px', color: '#6b9e7e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Top Skills to Develop</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {match.topSkillsNeeded.map(s => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
