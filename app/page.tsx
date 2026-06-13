// UI

// FB Analytics
//              [Upload CSV] [Analyze with AI]
// --------------------------------------------- [summary]
// Total posts     Avg impressions    Avg CTR    Avg engagement
// 666             6,666              6.66%      6.66%
// --------------------------------------------- [posts]
// [Post list with metrics and AI insights]





import { db } from '@/lib/db'
import { calculateCTR, calculateEngagementRate } from '@/lib/calculateMetrics'
import Dashboard from '@/components/Dashboard'

export const revalidate = 0

export default async function Home() {
  const uploads = await db.upload.findMany({
    include: { posts: true },
    orderBy: { createdAt: 'desc' },
  })
  
  // const posts: any[] = []
  const posts = uploads.flatMap((upload) =>
    upload.posts.map((post) => ({
      ...post,
      fileName: upload.fileName,
      ctr: calculateCTR(post.clicks, post.impressions),
      engagementRate: calculateEngagementRate(
        post.likes,
        post.comments,
        post.shares,
        post.impressions
      ),
    }))
  ) 

  const summary = {
    totalPosts: posts.length,
    totalUploads: uploads.length,
    avgImpressions:
      posts.length === 0
        ? 0
        : Math.round(
          posts.reduce((sum, p) => sum + p.impressions, 0) / posts.length
        ),
    avgCTR:
      posts.length === 0
        ? 0
        : parseFloat(
          (
            posts.reduce((sum, p) => sum + p.ctr, 0) / posts.length
          ).toFixed(2)
        ),
    avgEngagement:
      posts.length === 0
        ? 0
        : parseFloat(
          (
            posts.reduce((sum, p) => sum + p.engagementRate, 0) /
            posts.length
          ).toFixed(4)
        ),
  }

  return <Dashboard posts={posts} summary={summary} />
}