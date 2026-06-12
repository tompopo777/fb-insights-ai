import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
    // return Response.json({ ok: true })
  try {
    const { uploadId } = await request.json()

    if (!uploadId) {
      return Response.json({ error: 'uploadId is required' }, { status: 400 })
    }

    const existingAnalysis = await db.analysis.findUnique({
      where: { uploadId },
    })

    if (existingAnalysis) {
      return Response.json({
        summary: existingAnalysis.summary,
        recommendations: existingAnalysis.recommendations,
      })
    }

    const posts = await db.post.findMany({
      where: { uploadId },
    })

    if (posts.length === 0) {
      return Response.json({ error: 'No posts found for this upload' }, { status: 404 })
    }

    const postSummary = posts.map((post) => ({
      date: post.dateTime.toLocaleDateString(),
      type: post.postType,
      title: post.title.slice(0, 100),
      impressions: post.impressions,
      likes: post.likes,
      comments: post.comments,
      shares: post.shares,
      clicks: post.clicks,
    }))

    const prompt = `
You are a social media analyst. Analyze the following Facebook post data and provide:
1. A summary of the overall performance
2. Specific recommendations to improve engagement and CTR

Data:
${JSON.stringify(postSummary, null, 2)}

Respond in JSON format with two fields:
- "summary": overall performance summary (2-3 paragraphs)
- "recommendations": specific actionable recommendations (2-3 paragraphs)
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0].message.content
    if (!content) {
      return Response.json({ error: 'No response from OpenAI' }, { status: 500 })
    }

    const parsed = JSON.parse(content)

    await db.analysis.create({
      data: {
        uploadId,
        summary: parsed.summary,
        recommendations: parsed.recommendations,
      },
    })

    return Response.json({
      summary: parsed.summary,
      recommendations: parsed.recommendations,
    })

  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Analysis failed' }, { status: 500 })
  }
}