'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'var(--bg)' }}>

      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '700px' }}>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '999px', padding: '6px 16px', marginBottom: '32px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
          <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: '500' }}>AI-Powered Career Intelligence</span>
        </div>

        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

        <h1 style={{ fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-2px', marginBottom: '24px', fontFamily: 'Georgia, serif' }}>
          Your talent,{' '}
          <span style={{ color: '#22c55e' }}>allocated</span>
          {' '}perfectly.
        </h1>

        <p style={{ fontSize: '18px', color: '#6b9e7e', lineHeight: '1.7', marginBottom: '48px', maxWidth: '520px', margin: '0 auto 48px' }}>
          We match your skill profile, psychology, and local economy to your highest-upside career path — using real demand and wage trajectory data.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => router.push('/onboarding')} style={{ fontSize: '17px', padding: '14px 36px' }}>
            Find My Best Path →
          </button>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'transparent', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', padding: '14px 36px', borderRadius: '10px', cursor: 'pointer', fontSize: '17px', transition: 'all 0.2s' }}>
            View Dashboard
          </button>
        </div>

        <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', marginTop: '80px', flexWrap: 'wrap' }}>
          {[
            { num: '500+', label: 'Career paths mapped' },
            { num: '94%', label: 'Match accuracy' },
            { num: '3×', label: 'Avg. wage uplift' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#22c55e', fontFamily: 'Georgia, serif' }}>{s.num}</div>
              <div style={{ fontSize: '13px', color: '#6b9e7e', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
