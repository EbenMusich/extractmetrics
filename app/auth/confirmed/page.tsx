import { Suspense } from 'react'
import ConfirmedContent from './confirmed-content'

export default function AuthConfirmedPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-white px-6 text-zinc-950">
          <div className="w-full max-w-lg rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Email confirmed
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
              Loading...
            </h1>
          </div>
        </main>
      }
    >
      <ConfirmedContent />
    </Suspense>
  )
}
