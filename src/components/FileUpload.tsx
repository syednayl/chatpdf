'use client'
import { uploadToS3 } from '@/lib/s3'
import { useMutation } from '@tanstack/react-query'
import { Inbox, Loader2 } from 'lucide-react'
import React from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import { useRouter } from 'next/navigation'

// https://github.com/aws/aws-sdk-js-v3/issues/4126

const FileUpload = () => {
  const router = useRouter()
  const [uploading, setUploading] = React.useState(false)
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      file_key,
      file_name
    }: {
      file_key: string
      file_name: string
    }) => {
      const response = await axios.post('/api/create-chat', {
        file_key,
        file_name
      })
      return response.data
    }
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: async acceptedFiles => {
      const file = acceptedFiles[0]
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb!
        // toast.error('File too large')
        return
      }

      try {
        setUploading(true)
        const data = await uploadToS3(file)
        console.log('meow', data)
        if (!data?.file_key || !data.file_name) {
          // toast.error('Something went wrong')
          return
        }
        mutate(data, {
          onSuccess: ({ chat_id }) => {
            // toast.success('Chat created!')
            router.push(`/chat/${chat_id}`)
          },
          onError: err => {
            // toast.error('Error creating chat')
            console.error(err)
          }
        })
      } catch (error) {
        console.log('BIG PROBLEM: ', error)
      } finally {
        setUploading(false)
      }
    }
  })
  return (
    <div className='rounded-xl bg-gray-400 p-2'>
      <div
        {...getRootProps({
          className:
            'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col'
        })}
      >
        <input {...getInputProps()} />
        {uploading || isLoading ? (
          <>
            {/* loading state */}
            <Loader2 className='h-10 w-10 animate-spin text-yellow-500' />
            <p className='mt-2 text-sm text-slate-400'>Buckle Up!</p>
          </>
        ) : (
          <>
            <Inbox className='h-10 w-10 text-yellow-400' />
            <p className='mt-2 text-sm text-slate-400'>Drag your W8 here</p>
          </>
        )}
      </div>
    </div>
  )
}

export default FileUpload
