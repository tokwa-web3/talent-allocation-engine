'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PSYCH_TYPES = ['Analytical', 'Creative', 'Leader', 'Supporter', 'Builder', 'Communicator']
const SKILL_SUGGESTIONS = ['JavaScript', 'Python', 'Sales', 'Marketing', 'Design', 'Management', 'Writing', 'Finance', 'Teaching', 'Engineering', 'Healthcare', 'Data Analysis', 'Customer Service', 'Operations']

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', location: '', age: '', education: '',
    skills: [], skillInput: '',
    psychType: '', workStyle: '', goals: '', salary: ''
  })

  const addSkill = (skill) => {
    const s = skill.trim()
    if (s && !form.skills.includes(s)) {
      setForm(f => ({ ...f, skills: [...f.skills, s], skillInput: '' }))
    }
  }

  const removeSkill = (skill) => setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      localStorage.setItem('tae_profile', JSON.stringify(form))
      localStorage.setItem('tae_matches', JSON.stringify(data.matches))
      router.push('/dashboard')
    } catch (e) {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#6b9e7e', fontSize: '13px' }}>Step {step} of 3</span>
          <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: '600' }}>{Math.round((step/3)*100)}% complete</span>
        </div>
        <div style={{ height: '4px', background: '#1a2820', borderRadius: '2px' }}>
          <div style={{ height: '100%', width: `${(step/3)*100}%`, background: '#22c55e', borderRadius: '2px', transition: 'width 0.4s' }} />
        </div>
      </div>

      <div className="card" style={{ width: '100%', maxWidth: '600px' }}>

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>Who are you?</h2>
            <p style={{ color: '#6b9e7e', marginBottom: '32px' }}>Basic profile — we need this to factor in local economy data.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#6b9e7e' }}>Full Name</label>
                <input className="input-field" placeholder="e.g. Juan dela Cruz" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#6b9e7e' }}>Location (City, Country)</label>
                <input className="input-field" placeholder="e.g. Manila, Philippines" value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#6b9e7e' }}>Age</label>
                  <input className="input-field" type="number" placeholder="25" value={form.age} onChange={e => setForm(f => ({...f, age: e.target.value}))} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#6b9e7e' }}>Education Level</label>
                  <select className="input-field" value={form.education} onChange={e => setForm(f => ({...f, education: e.target.value}))} style={{ cursor: 'pointer' }}>
                    <option value="">Select...</option>
                    <option>High School</option>
                    <option>Vocational / Tech</option>
                    <option>Some College</option>
                    <option>Bachelor's Degree</option>
                    <option>Master's Degree</option>
                    <option>Doctorate</option>
                    <option>Self-taught</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>What can you do?</h2>
            <p style={{ color: '#6b9e7e', marginBottom: '32px' }}>Add your skills — technical, soft, or industry-specific.</p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input
                className="input-field"
                placeholder="Type a skill and press Enter"
                value={form.skillInput}
                onChange={e => setForm(f => ({...f, skillInput: e.target.value}))}
                onKeyDown={e => { if (e.key === 'Enter') addSkill(form.skillInput) }}
                style={{ flex: 1 }}
              />
              <button className="btn-primary" onClick={() => addSkill(form.skillInput)} style={{ padding: '12px 20px' }}>Add</button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {SKILL_SUGGESTIONS.filter(s => !form.skills.includes(s)).map(s => (
                <button key={s} onClick={() => addSkill(s)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1e3028', color: '#6b9e7e', padding: '5px 12px', borderRadius: '999px', cursor: 'pointer', fontSize: '13px' }}>+ {s}</button>
              ))}
            </div>

            {form.skills.length > 0 && (
              <div>
                <p style={{ fontSize: '13px', color: '#6b9e7e', marginBottom: '10px' }}>Your skills ({form.skills.length})</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {form.skills.map(s => (
                    <span key={s} className="tag">{s} <button onClick={() => removeSkill(s)}>×</button></span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>How do you work?</h2>
            <p style={{ color: '#6b9e7e', marginBottom: '32px' }}>Psychology and goals — this is what separates a job match from a life match.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '13px', color: '#6b9e7e' }}>Personality Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {PSYCH_TYPES.map(t => (
                    <button key={t} onClick={() => setForm(f => ({...f, psychType: t}))} style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${form.psychType === t ? '#22c55e' : '#1e3028'}`, background: form.psychType === t ? 'rgba(34,197,94,0.1)' : 'transparent', color: form.psychType === t ? '#22c55e' : '#6b9e7e', cursor: 'pointer', fontSize: '14px' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#6b9e7e' }}>Work Style Preference</label>
                <select className="input-field" value={form.workStyle} onChange={e => setForm(f => ({...f, workStyle: e.target.value}))} style={{ cursor: 'pointer' }}>
                  <option value="">Select...</option>
                  <option>Remote / Fully Online</option>
                  <option>Hybrid</option>
                  <option>On-site / In-person</option>
                  <option>Freelance / Independent</option>
                  <option>I'm flexible</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#6b9e7e' }}>Career Goal (in your own words)</label>
                <textarea className="input-field" rows={3} placeholder="e.g. I want to earn more while working remotely and build something of my own eventually." value={form.goals} onChange={e => setForm(f => ({...f, goals: e.target.value}))} style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#6b9e7e' }}>Target Monthly Income (USD)</label>
                <input className="input-field" type="number" placeholder="e.g. 3000" value={form.salary} onChange={e => setForm(f => ({...f, salary: e.target.value}))} />
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', gap: '12px' }}>
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} style={{ background: 'transparent', border: '1px solid #1e3028', color: '#6b9e7e', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer' }}>← Back</button>
          ) : <div />}

          {step < 3 ? (
            <button className="btn-primary" onClick={() => setStep(s => s + 1)}>Continue →</button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Analyzing your profile...' : 'Find My Best Paths →'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
