import { NextRequest } from 'next/server'
import Papa from 'papaparse'
import { db } from '@/lib/db'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const raw = searchParams.get('id')
    const uploadId = raw ? parseInt(raw, 10) : NaN

    if (isNaN(uploadId)) {
      return Response.json({ error: 'Valid upload id is required' }, { status: 400 })
    }

    const upload = await db.upload.findUnique({ where: { id: uploadId } })
    if (!upload) {
      return Response.json({ error: 'Upload not found' }, { status: 404 })
    }

    await db.$transaction(async (tx) => {
      await tx.analysis.deleteMany({ where: { uploadId } })
      await tx.post.deleteMany({ where: { uploadId } })
      await tx.upload.delete({ where: { id: uploadId } })
    })

    return Response.json({ ok: true })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Delete failed' }, { status: 500 })
  }
}

type FacebookPostRow = Record<string, string | undefined>

const REQUIRED_COLUMNS = [
  'Date',
  'Time',
  'Post type',
  'Title',
  'Impressions',
  'Likes',
  'Comments',
  'Shares',
  'Total clicks',
]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const replace = formData.get('replace') === 'true'
    const existingUploads = await db.upload.findMany({
      where: { fileName: file.name },
      select: { id: true },
    })
    const existingUploadIds = existingUploads.map(upload => upload.id)

    if (existingUploadIds.length > 0 && !replace) {
      return Response.json({ duplicate: true, fileName: file.name }, { status: 409 })
    }

    const text = await file.text()

    const { data, meta } = Papa.parse<FacebookPostRow>(text, {
      header: true,
      skipEmptyLines: true,
    })

    const firstRow = meta.fields ?? []
    const missingColumns = REQUIRED_COLUMNS.filter(
      column => !firstRow.includes(column)
    )

    if (missingColumns.length > 0) {
      return Response.json(
        { error: `Invalid CSV format. Missing columns: ${missingColumns.join(', ')}` },
        { status: 400 }
      )
    }

    if (existingUploadIds.length > 0) {
      await db.$transaction(async tx => {
        await tx.analysis.deleteMany({
          where: { uploadId: { in: existingUploadIds } },
        })
        await tx.post.deleteMany({
          where: { uploadId: { in: existingUploadIds } },
        })
        await tx.upload.deleteMany({
          where: { id: { in: existingUploadIds } },
        })
      })
    }

    function combineDateTime(date: string, time: string): string {
      const [month, day, year] = date.split('/').map(n => n.padStart(2, '0'))
      const fullYear = `20${year}`
      const [hours, minutes, seconds] = time.split(':').map(n => n.padStart(2, '0'))

      return `${fullYear}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`
    } 

    const posts = data.filter(row => row['Date'] && row['Time']).map(row => ({
      dateTime: new Date(combineDateTime(row['Date'] ?? '', row['Time'] ?? '')), 
      postType: row['Post type'] ?? '', 
      title: row['Title'] ?? '', 
      impressions: parseInt(row['Impressions'] ?? '') ?? 0, 
      likes: parseInt(row['Likes'] ?? '') ?? 0, 
      comments: parseInt(row['Comments'] ?? '') ?? 0, 
      shares: parseInt(row['Shares'] ?? '') ?? 0, 
      clicks: parseInt(row['Total clicks'] ?? '') ?? 0, 
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
