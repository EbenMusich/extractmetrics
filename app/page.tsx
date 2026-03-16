import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const valueProps = [
  {
    title: 'Track extraction runs',
    description:
      'Log run details in one place so your team can keep production records organized and searchable.',
  },
  {
    title: 'Analyze yield performance',
    description:
      'Review output trends over time to understand which processes are producing the best returns.',
  },
  {
    title: 'Understand true cost per gram',
    description:
      'Combine labor, materials, utilities, and other inputs to see the real economics behind every run.',
  },
  {
    title: 'Compare strains and growers',
    description:
      'Spot which source material delivers the strongest results across yield, output type, and profitability.',
  },
]

const workflowSteps = [
  'Log each extraction run with core production data.',
  'Track output, yield, solvent usage, and cost inputs.',
  'Review dashboards to identify trends and outliers.',
  'Use the data to improve sourcing, process, and margins.',
]

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            ExtractMetrics
          </Link>

          <nav className="flex items-center gap-3 text-sm font-medium">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-zinc-950 px-4 py-2 text-white transition hover:bg-zinc-800"
            >
              Start Tracking Runs
            </Link>
          </nav>
        </header>

        <section className="grid flex-1 items-center gap-14 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Built for cannabis extraction teams
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
              Extraction Run Tracking for Cannabis Labs
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
              ExtractMetrics helps labs log extraction runs, monitor yield performance, and
              understand cost analytics so every batch is easier to evaluate and improve.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Start Tracking Runs
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                Log In
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm sm:p-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div>
                  <p className="text-sm font-semibold text-zinc-950">Dashboard Preview</p>
                  <p className="text-sm text-zinc-500">Analytics overview</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Live metrics
                </span>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl">
                <Image
                  src="/dashboard-preview.png"
                  alt="ExtractMetrics dashboard showing extraction run analytics"
                  width={1200}
                  height={800}
                  className="h-auto w-full rounded-xl border shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">Why teams use ExtractMetrics</h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Practical reporting for labs that need clearer visibility into run performance,
              production efficiency, and profitability.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {valueProps.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 h-10 w-10 rounded-2xl bg-zinc-950/5" />
                <h3 className="text-lg font-semibold text-zinc-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="rounded-[2rem] border border-zinc-200 bg-zinc-50 px-6 py-8 sm:px-8 sm:py-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">How it works</h2>
              <p className="mt-4 text-base leading-7 text-zinc-600">
                A simple workflow designed for day-to-day extraction operations.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {workflowSteps.map((step, index) => (
                <div key={step} className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <p className="text-sm font-semibold text-zinc-500">Step {index + 1}</p>
                  <p className="mt-3 text-base font-medium leading-7 text-zinc-900">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="rounded-[2rem] bg-zinc-950 px-6 py-12 text-white sm:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight">
                Start building a clearer picture of extraction performance.
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-300">
                Create an account to centralize run data, monitor key metrics, and improve
                production decisions over time.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
              >
                Start Tracking Runs
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Log In
              </Link>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-4 border-t border-zinc-200 py-8 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-zinc-950">ExtractMetrics</p>
          <div className="flex items-center gap-5">
            <Link href="/login" className="transition hover:text-zinc-950">
              Log In
            </Link>
            <Link href="/signup" className="transition hover:text-zinc-950">
              Sign Up
            </Link>
          </div>
        </footer>
      </div>
    </main>
  )
}
