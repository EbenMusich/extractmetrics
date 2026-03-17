import Link from 'next/link'

export default function AuthConfirmedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-zinc-950">
      <div className="w-full max-w-lg rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Email confirmed
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
          Your email has been confirmed. You can now sign in.
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          Your ExtractMetrics account is ready. Use the button below to continue to the
          login page.
        </p>

        <div className="mt-8">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Go to Log In
          </Link>
        </div>
      </div>
    </main>
  )
}
