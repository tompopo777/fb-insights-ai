import { db } from '@/lib/db'
import AnalysisPage from '@/components/AnalysisPage'

export default async function Analysis() {
  const uploads = await db.upload.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fileName: true,
      createdAt: true,
    },
  })

  return <AnalysisPage uploads={uploads} />
}