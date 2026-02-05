'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-wave-50 to-wave-100">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-wave-500 to-wave-600 shadow-lg shadow-wave-500/50">
            <svg className="h-12 w-12 text-white" viewBox="0 0 40 40" fill="none">
              <path d="M8 20C8 13.37 13.37 8 20 8C26.63 8 32 13.37 32 20C32 26.63 26.63 32 20 32C13.37 32 8 26.63 8 20Z" fill="currentColor"/>
              <path d="M20 8C13.37 8 8 13.37 8 20H12C12 15.58 15.58 12 20 12V8Z" fill="white" opacity="0.8"/>
              <path d="M28 20C28 15.58 24.42 12 20 12V16C22.21 16 24 17.79 24 20H28Z" fill="white" opacity="0.6"/>
            </svg>
          </div>
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-wave-200 border-t-wave-600"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wave-50 via-white to-wave-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="h-10 w-10" viewBox="0 0 40 40" fill="none">
                <path d="M8 20C8 13.37 13.37 8 20 8C26.63 8 32 13.37 32 20C32 26.63 26.63 32 20 32C13.37 32 8 26.63 8 20Z" fill="#0EA5E9"/>
                <path d="M20 8C13.37 8 8 13.37 8 20H12C12 15.58 15.58 12 20 12V8Z" fill="#0284C7"/>
                <path d="M28 20C28 15.58 24.42 12 20 12V16C22.21 16 24 17.79 24 20H28Z" fill="#38BDF8"/>
              </svg>
              <span className="text-2xl font-bold text-wave-600">wave</span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Link
                  href={`/${user.id}/dashboard`}
                  className="rounded-lg bg-wave-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-wave-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-wave-600 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg bg-wave-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-wave-700 transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
            Business finances made
            <span className="block text-wave-600">simple & powerful</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Create professional estimates, track payments, and manage your business finances
            all in one place. Built for small businesses and freelancers.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            {user ? (
              <Link
                href={`/${user.id}/dashboard`}
                className="rounded-lg bg-wave-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-wave-700 transition-all hover:shadow-xl"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="rounded-lg bg-wave-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-wave-700 transition-all hover:shadow-xl"
                >
                  Get started free
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-wave-100">
              <svg className="h-6 w-6 text-wave-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Professional Estimates</h3>
            <p className="mt-2 text-gray-600">
              Create beautiful, professional estimates in minutes. Customize with your branding and send to clients instantly.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-wave-100">
              <svg className="h-6 w-6 text-wave-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Payment Tracking</h3>
            <p className="mt-2 text-gray-600">
              Track payments and outstanding balances. Get notified when clients view or pay their invoices.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-wave-100">
              <svg className="h-6 w-6 text-wave-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Financial Insights</h3>
            <p className="mt-2 text-gray-600">
              Get a clear view of your business finances with real-time reports and insights into your cash flow.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="mt-32 rounded-3xl bg-gradient-to-br from-wave-500 to-wave-600 px-8 py-16 text-center shadow-xl">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to simplify your finances?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-wave-50">
              Join thousands of small businesses using Wave to manage their finances better.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-block rounded-lg bg-white px-8 py-4 text-base font-semibold text-wave-600 shadow-lg hover:bg-gray-50 transition-colors"
              >
                Get started now
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-32">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none">
                <path d="M8 20C8 13.37 13.37 8 20 8C26.63 8 32 13.37 32 20C32 26.63 26.63 32 20 32C13.37 32 8 26.63 8 20Z" fill="#0EA5E9"/>
                <path d="M20 8C13.37 8 8 13.37 8 20H12C12 15.58 15.58 12 20 12V8Z" fill="#0284C7"/>
                <path d="M28 20C28 15.58 24.42 12 20 12V16C22.21 16 24 17.79 24 20H28Z" fill="#38BDF8"/>
              </svg>
              <span className="text-xl font-bold text-wave-600">wave</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2026 Wave. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
