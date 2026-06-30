import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Create Account | ExtractMetrics',
  description:
    'Create your ExtractMetrics account to start tracking extraction runs, yields, and cost per gram.',
  alternates: {
    canonical: '/signup',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function SignupLayout({ children }: { children: ReactNode }) {
  return children
}
