'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'


export default function UploadCsv() {
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setMessage('')

        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })

        const data = await res.json()

        if (res.ok) {
            setMessage(`Upload Success! Upload ID: ${data.fileName}`)
            router.push('/')
            router.refresh()  
        } else {
            setMessage(`Upload failed: ${data.error}`)
        }

        setUploading(false)
    }

    return (
        <div>
            <input
                type= "file"
                accept = ".csv"
                onChange = { handleUpload }
                disabled = { uploading }
            />
            { uploading && <p>Uploading...</p>}
            { message && <p>{ message } </p> }
        </div>
  )
}