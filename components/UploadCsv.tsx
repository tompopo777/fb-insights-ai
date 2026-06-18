'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface UploadCsvProps {
    onSuccess?: () => void
}

export default function UploadCsv({ onSuccess }: UploadCsvProps) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [duplicateFile, setDuplicateFile] = useState<File | null>(null)
    const router = useRouter()

    async function uploadFile(file: File, replace = false) {
        setUploading(true)
        setError('')

        const formData = new FormData()
        formData.append('file', file)
        formData.append('replace', replace ? 'true' : 'false')

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })

        const data = await res.json()

        if (res.ok) {
            setDuplicateFile(null)
            router.refresh()
            onSuccess?.()
        } else if (res.status === 409) {
            setDuplicateFile(file)
        } else {
            setError(data.error ?? 'Upload failed')
        }

        setUploading(false)
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        e.target.value = ''

        if (!file) return

        await uploadFile(file)
    }

    async function handleReplace() {
        if (!duplicateFile) return
        await uploadFile(duplicateFile, true)
    }

    function handleCancel() {
        setDuplicateFile(null)
        setError('')
    }

    return (
        <div className="space-y-3">
            <input
                type="file"
                accept=".csv"
                onChange={handleUpload}
                disabled={uploading}
            />
            {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {duplicateFile && (
                <div className="space-y-2 rounded-md border p-3">
                    <p className="text-sm">&quot;{duplicateFile.name}&quot; already exists. Replace it?</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCancel} disabled={uploading}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleReplace} disabled={uploading}>
                            {uploading ? 'Replacing...' : 'Replace'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
