import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Extraction Run Tracking Software for Cannabis Labs | ExtractMetrics',
  description:
    'Track extraction runs, yields, output, solvent usage, and cost data in one dashboard. See why cannabis labs use ExtractMetrics instead of spreadsheets.',
  alternates: {
    canonical: '/extraction-run-tracking-software',
  },
}

const featurePoints = [
  {
    title: 'Track every run in one place',
    description:
      'Capture run dates, batch details, output, yield, solvent usage, and key notes in a single workflow.',
  },
  {
    title: 'Monitor yield and output trends',
    description:
      'See how production is performing over time so your team can spot changes in efficiency and consistency.',
  },
  {
    title: 'Understand cost data clearly',
    description:
      'Bring together labor, materials, utilities, and other inputs to evaluate cost per gram with more confidence.',
  },
]

const spreadsheetComparison = [
  'Disconnected records and manual version control',
  'Harder to compare runs, yields, output, and solvent usage over time',
  'Limited visibility into cost data and cost per gram',
  'More time spent updating sheets instead of improving operations',
]

const softwareComparison = [
  'Centralized extraction run tracking built for lab workflows',
  'Consistent reporting across runs, yield, output, and process data',
  'Clearer visibility into solvent usage and production costs',
  'Faster decisions with one dashboard instead of multiple spreadsheets',
]

export default function ExtractionRunTrackingSoftwarePage() {
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

        <section className="grid gap-14 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Built for cannabis extraction labs
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
              Extraction Run Tracking Software for Cannabis Labs
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
              ExtractMetrics gives cannabis labs a simple way to track runs, yields, output,
              solvent usage, and cost data without relying on disconnected spreadsheets.
            </p>
            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
              Built for day-to-day production workflows, the software helps hydrocarbon labs keep
              cleaner records, compare performance over time, and understand cost per gram with
              less manual work.
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

          <div className="lg:pl-4">
            <Image
              src="/dashboard-preview.png"
              alt="ExtractMetrics dashboard for extraction run tracking software"
              width={1200}
              height={800}
              className="h-auto w-full rounded-xl border border-zinc-200 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.28)]"
            />
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
              What the software helps you manage
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              ExtractMetrics is designed to give cannabis labs clearer visibility into production
              performance so teams can move from record-keeping to operational improvement.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {featurePoints.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-zinc-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="rounded-[2rem] border border-zinc-200 bg-zinc-50 px-6 py-8 sm:px-8 sm:py-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
                Software vs spreadsheets
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-600">
                Many labs start with spreadsheets, but they become harder to maintain as run
                volume grows and reporting needs get more detailed.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-zinc-950">Spreadsheets</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
                  {spreadsheetComparison.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-zinc-950">ExtractMetrics</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
                  {softwareComparison.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="rounded-[2rem] bg-zinc-950 px-6 py-12 text-white sm:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight">
                Start tracking extraction runs with clearer visibility
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-300">
                Create an account to centralize production data, monitor yield and output, and
                understand cost per gram in one dashboard.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
              >
                Sign Up
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
            <Link href="/" className="transition hover:text-zinc-950">
              Home
            </Link>
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
