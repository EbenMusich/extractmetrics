import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'ExtractMetrics | Cannabis Extraction Software for Run, Yield, and Cost Tracking',
  description:
    'Track extraction runs, yields, output, and cost per gram in one dashboard. Built for cannabis extraction labs that want clearer visibility than spreadsheets.',
  alternates: {
    canonical: '/',
  },
}

const valueProps = [
  {
    title: 'Track extraction runs',
    description:
      'Log production runs, batch details, output, and solvent usage in one searchable system built for hydrocarbon lab workflows.',
  },
  {
    title: 'Monitor yield and output',
    description:
      'Review yield trends and finished output over time so your team can see which processes produce the strongest returns.',
  },
  {
    title: 'Understand cost per gram',
    description:
      'Combine labor, materials, utilities, and other inputs to understand the true cost per gram behind every extraction run.',
  },
  {
    title: 'Improve lab decision-making',
    description:
      'Compare source material, output type, and process performance to spot what is helping or hurting margins.',
  },
]

const workflowSteps = [
  'Log each extraction run with core production data.',
  'Track yield, output, solvent usage, and cost inputs in one dashboard.',
  'Review trends and outliers across batches, material, and process performance.',
  'Use the data to improve hydrocarbon lab workflows, sourcing, and margins.',
]

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'ExtractMetrics',
      url: 'https://extractmetrics.com',
    },
    {
      '@type': 'WebSite',
      name: 'ExtractMetrics',
      url: 'https://extractmetrics.com',
      description:
        'Cannabis extraction software for tracking production runs, yield, output, and cost per gram.',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'ExtractMetrics',
      url: 'https://extractmetrics.com',
      operatingSystem: 'Web',
      applicationCategory: 'BusinessApplication',
      description:
        'Cannabis extraction software for tracking production runs, yield, output, and cost per gram.',
    },
  ],
}

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
              Built for cannabis extraction and hydrocarbon lab workflows
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
              Cannabis Extraction Software for Run, Yield, and Cost Tracking
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
              ExtractMetrics helps cannabis extraction labs log production runs, track yield,
              monitor output, and understand cost per gram in one simple dashboard.
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

            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600">
              Need a closer look at run-level workflows? Explore{' '}
              <Link
                href="/extraction-run-tracking-software"
                className="font-medium text-zinc-950 underline underline-offset-4"
              >
                extraction run tracking software for cannabis labs
              </Link>
              .
            </p>
          </div>

          <div className="lg:pl-4">
            <Image
              src="/dashboard-preview.png"
              alt="ExtractMetrics dashboard showing extraction run analytics"
              width={1200}
              height={800}
              className="h-auto w-full rounded-xl border border-zinc-200 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.28)]"
            />
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">Why teams use ExtractMetrics</h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Practical cannabis extraction software for labs that need clearer visibility into
              run performance, production efficiency, and profitability than spreadsheets can
              provide.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {valueProps.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
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
                A simple workflow designed for day-to-day extraction operations, from run
                tracking to yield and cost analysis.
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
              <p className="mt-4 text-sm leading-6 text-zinc-400">
                Prefer a quick overview first? Read more about{' '}
                <Link
                  href="/extraction-run-tracking-software"
                  className="font-medium text-white underline underline-offset-4"
                >
                  extraction run tracking software
                </Link>
                .
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
            <Link href="/extraction-run-tracking-software" className="transition hover:text-zinc-950">
              Run Tracking Software
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
