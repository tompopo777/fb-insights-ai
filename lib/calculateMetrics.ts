export function calculateCTR(clicks: number, impressions: number): number {
    if (impressions === 0) return 0
    return parseFloat(((clicks / impressions) * 100).toFixed(2))
}

export function calculateEngagementRate(likes: number, comments: number, shares: number, impressions: number): number {
    if (impressions === 0) return 0
    return parseFloat(((likes + comments + shares) / impressions * 100).toFixed(2))
}
