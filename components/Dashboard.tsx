'use client'

import { useState } from 'react'
import UploadCsv from '@/components/UploadCsv'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'


interface Post {
    id: number
    fileName: string
    dateTime: Date
    postType: string
    title: string
    impressions: number
    likes: number
    comments: number
    shares: number
    clicks: number
    ctr: number
    engagementRate: number
}

interface Summary {
    totalPosts: number
    totalUploads: number
    avgImpressions: number
    avgCTR: number
    avgEngagement: number
}

interface DashboardProps {
    posts: Post[]
    summary: Summary
}

export default function Dashboard({ posts, summary }: DashboardProps) {
    // posts = [];
    const router = useRouter()

    // const [orderBy, setOrderBy] = useState('date-desc')
    const [orderBy, setOrderBy] = useState<string>('date-desc')


    const sortedPosts = [...posts].sort((a, b) => {
        if (orderBy === 'date-desc') return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        if (orderBy === 'date-asc') return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
        if (orderBy === 'upload-desc') return b.id - a.id
        if (orderBy === 'upload-asc') return a.id - b.id
        return 0
    })

    return (
        <main className="p-8 space-y-6">
            {/* // Header (buttons) */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">FB Analytics</h1>
                <div className="flex gap-2">
                    <UploadCsv />
                    {/* <Button>Analyze with AI</Button> */}
                    <Button onClick={() => router.push('/analysis')}>Analyze with AI</Button>
                </div>
            </div>
            {/* // Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{summary.totalPosts}</p>
                        <p className="text-xs text-muted-foreground">across {summary.totalUploads} uploads</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg impressions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{summary.avgImpressions.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">per post</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg CTR</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{summary.avgCTR}%</p>
                        <p className="text-xs text-muted-foreground">clicks / impressions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{summary.avgEngagement}%</p>
                        <p className="text-xs text-muted-foreground">likes + comments + shares</p>
                    </CardContent>
                </Card>
            </div>

            {/* // Order Dropdown */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{summary.totalPosts} posts</p>
                <Select value={orderBy} onValueChange={(value) => value && setOrderBy(value)}>
                    <SelectTrigger className="w-48">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="date-desc">Date (newest first)</SelectItem>
                        <SelectItem value="date-asc">Date (oldest first)</SelectItem>
                        <SelectItem value="upload-desc">Upload (newest first)</SelectItem>
                        <SelectItem value="upload-asc">Upload (oldest first)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* // Posts Table */}
            {posts.length === 0 ? (
                <div className="p-8 border rounded-md text-center text-muted-foreground">
                    No posts to display. Upload a CSV to see your summary here.
                </div>  
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Batch</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Impressions</TableHead>
                            <TableHead>Likes</TableHead>
                            <TableHead>Comments</TableHead>
                            <TableHead>Shares</TableHead>
                            <TableHead>Clicks</TableHead>
                            <TableHead>CTR%</TableHead>
                            <TableHead>Eng%</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedPosts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell><Badge variant="secondary">{post.fileName}</Badge></TableCell>
                                <TableCell>{new Date(post.dateTime).toLocaleDateString()}</TableCell>
                                <TableCell>{post.postType}</TableCell>
                                <TableCell className="max-w-xs truncate">{post.title}</TableCell>
                                <TableCell>{post.impressions}</TableCell>
                                <TableCell>{post.likes}</TableCell>
                                <TableCell>{post.comments}</TableCell>
                                <TableCell>{post.shares}</TableCell>
                                <TableCell>{post.clicks}</TableCell>
                                <TableCell>{post.ctr}</TableCell>
                                <TableCell>{post.engagementRate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </main>
    )
}