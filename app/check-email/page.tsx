import Link from 'next/link'

export default function CheckEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-zinc-950">
      <div className="w-full max-w-lg rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Check your email
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
          Confirm your email to finish creating your account.
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          We sent a confirmation link to your inbox. Open it to finish setting up your
          ExtractMetrics account. If the link opens in this browser, we&apos;ll take you into
          the app when possible.
        </p>
        <p className="mt-3 text-sm leading-6 text-zinc-500">
          If you do not see it right away, check your spam or promotions folder.
        </p>

        <div className="mt-8">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Back to Log In
          </Link>
        </div>
      </div>
    </main>
  )
}
