'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Button } from '@/components/ui/button'

interface Upload {
  id: number
  fileName: string
  createdAt: Date
}

interface AnalysisResult {
  summary: string
  recommendations: string
}

interface AnalysisPageProps {
  uploads: Upload[]
}

export default function AnalysisPage({ uploads }: AnalysisPageProps) {
  const router = useRouter()
  const [selectedUploadId, setSelectedUploadId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  async function handleAnalyze() {
    if (!selectedUploadId) return

    setLoading(true)
    setResult(null)

    const res = await fetch('/api/analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadId: parseInt(selectedUploadId) }),
    })

    const data = await res.json()

    if (res.ok) {
      setResult(data)
    }

    setLoading(false)
  }

  return (
    <main className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push('/')}>
          ← Back
        </Button>
        <h1 className="text-3xl font-bold">AI Analysis</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Select a batch to analyze</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Select
            value={selectedUploadId}
            onValueChange={(value) => value && setSelectedUploadId(value)}
          >
            <SelectTrigger className="w-72">
                <SelectValue placeholder="Select a batch...">
                    {selectedUploadId
                    ? uploads.find((u) => String(u.id) === selectedUploadId)?.fileName + ` (${new Date(uploads.find((u) => String(u.id) === selectedUploadId)?.createdAt ?? '').toLocaleDateString()})`
                    : 'Select a batch...'}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {uploads.map((upload) => (
                <SelectItem key={upload.id} value={String(upload.id)}>
                  {upload.fileName} ({new Date(upload.createdAt).toLocaleDateString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAnalyze}
            disabled={!selectedUploadId || loading}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{result.summary}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{result.recommendations}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}