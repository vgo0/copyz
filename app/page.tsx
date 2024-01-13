"use client"
import Link from 'next/link'
import DirectoryPicker from './picker'
import { useDirectoryStore } from './data';

export default function Home() {
  const directories = useDirectoryStore((state) => state.Directories.length)

  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <DirectoryPicker/>
      {directories > 0 && <Link href="/dedupe"><button className='rounded p-2 bg-blue-500'>Find Duplicates</button></Link>}
    </main>
  )
}
