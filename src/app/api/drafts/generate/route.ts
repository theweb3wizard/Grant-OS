import { NextResponse } from 'next/server'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { projectName, grantName, grantEcosystem, description, oneLiner, metrics } = await req.json()

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI draft generation is not configured. You can write your draft manually.' },
        { status: 501 }
      )
    }

    const metricsStr = metrics ? Object.entries(metrics).filter(([_, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n') : 'No metrics provided'

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an expert grant writer helping a project apply for a Web3 grant. Write a compelling, detailed application based on the project description and metrics provided.`
          },
          {
            role: 'user',
            content: `Project Name: ${projectName}\nOne Liner: ${oneLiner}\nDescription: ${description}\nMetrics:\n${metricsStr}\n\nGrant: ${grantName} (${grantEcosystem})\n\nWrite a complete grant application draft.`
          }
        ],
        temperature: 0.7,
        stream: true,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Groq API error:', errText)
      return NextResponse.json(
        { error: 'AI generation failed. Please try again or write manually.' },
        { status: 502 }
      )
    }

    return new Response(response.body, {
      headers: { 'Content-Type': 'text/event-stream' },
    })
  } catch (error) {
    console.error('Draft generation error:', error)
    return NextResponse.json(
      { error: 'AI draft generation is unavailable. You can write your draft manually.' },
      { status: 500 }
    )
  }
}
