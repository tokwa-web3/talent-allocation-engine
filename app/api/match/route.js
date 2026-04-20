import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const profile = await req.json()

    const prompt = `You are the Talent Allocation Engine — an expert career intelligence system.

Analyze this profile and return the 5 best career paths based on:
1. Their current skills
2. Their psychology and personality type  
3. Their location and local economy context
4. Current demand trends in the job market
5. Wage trajectory and earning potential upside

USER PROFILE:
- Name: ${profile.name}
- Location: ${profile.location}
- Age: ${profile.age}
- Education: ${profile.education}
- Skills: ${profile.skills.join(', ')}
- Personality Type: ${profile.psychType}
- Work Style: ${profile.workStyle}
- Career Goal: ${profile.goals}
- Target Monthly Income (USD): ${profile.salary}

Return ONLY a valid JSON array with exactly 5 objects. No markdown, no backticks, no explanation — just the raw JSON array.
Each object must have exactly these keys:
{
  "title": "Job title",
  "category": "Industry category",
  "matchScore": 87,
  "upsidePotential": "High",
  "avgMonthlyUSD": 4500,
  "demandTrend": "Growing",
  "timeToTransition": "3-6 months",
  "whyMatch": "2-3 sentence explanation",
  "topSkillsNeeded": ["skill1", "skill2", "skill3"],
  "remoteViable": true
}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
        })
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      console.error('Gemini API error:', errText)
      return NextResponse.json({ error: 'Gemini API failed', detail: errText }, { status: 500 })
    }

    const data = await response.json()
    const text = data.candidates[0].content.parts[0].text.trim()
    const cleaned = text.replace(/```json|```/g, '').trim()
    const matches = JSON.parse(cleaned)

    return NextResponse.json({ matches })

  } catch (error) {
    console.error('Match API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
