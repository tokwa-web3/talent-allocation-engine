import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const profile = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key missing' }, { status: 500 })
    }

    const prompt = `You are the Talent Allocation Engine — an expert career intelligence system.

A user has submitted their profile. Analyze it deeply and return the 5 best career paths for them based on:
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

Return ONLY a valid JSON array (no markdown, no explanation, no backticks) with exactly 5 objects.
Each object must have these exact keys:
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

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic API error:', errText)
      return NextResponse.json({ error: 'Anthropic API failed', detail: errText }, { status: 500 })
    }

    const data = await response.json()
    
    if (!data.content || !data.content[0]) {
      return NextResponse.json({ error: 'Empty response from Claude' }, { status: 500 })
    }

    const text = data.content[0].text.trim()
    const cleaned = text.replace(/```json|```/g, '').trim()
    const matches = JSON.parse(cleaned)

    return NextResponse.json({ matches })

  } catch (error) {
    console.error('Match API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
