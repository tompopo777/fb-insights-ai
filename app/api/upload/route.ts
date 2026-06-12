import { NextRequest } from 'next/server'
import Papa from 'papaparse'
import { db } from '@/lib/db'
import { time } from 'console'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const text = await file.text()

    const { data } = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    })

    function combineDateTime(date: string, time: string): string {
      const [month, day, year] = date.split('/').map(n => n.padStart(2, '0'))
      const fullYear = `20${year}`
      const [hours, minutes, seconds] = time.split(':').map(n => n.padStart(2, '0'))

      return `${fullYear}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`
    } 

    const posts = (data as any[]).filter(row => row['Date'] && row['Time']).map(row => ({
      dateTime: new Date(combineDateTime(row['Date'] ?? '', row['Time'] ?? '')), 
      postType: row['Post type'] ?? '', 
      title: row['Title'] ?? '', 
      impressions: parseInt(row['Impressions']) ?? 0, 
      likes: parseInt(row['Likes']) ?? 0, 
      comments: parseInt(row['Comments']) ?? 0, 
      shares: parseInt(row['Shares']) ?? 0, 
      clicks: parseInt(row['Total clicks']) ?? 0, 
    }))

    const upload = await db.upload.create({
      data: {
        fileName: file.name,
        posts: {
          create: posts,
        },
      },
    })

    return Response.json({ uploadId: upload.id, fileName: upload.fileName })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}