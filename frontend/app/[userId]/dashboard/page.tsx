'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import Link from 'next/link';

export default function DashboardPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [salesPaymentsOpen, setSalesPaymentsOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user && user.id.toString() !== userId) {
      router.push(`/${user.id}/dashboard`);
    }
  }, [user, userId, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-wave-200 border-t-wave-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 flex h-screen w-60 flex-col border-r border-gray-200 bg-white">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
          <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none">
            <path d="M8 20C8 13.37 13.37 8 20 8C26.63 8 32 13.37 32 20C32 26.63 26.63 32 20 32C13.37 32 8 26.63 8 20Z" fill="#0EA5E9"/>
            <path d="M20 8C13.37 8 8 13.37 8 20H12C12 15.58 15.58 12 20 12V8Z" fill="#0284C7"/>
            <path d="M28 20C28 15.58 24.42 12 20 12V16C22.21 16 24 17.79 24 20H28Z" fill="#38BDF8"/>
          </svg>
          <span className="text-xl font-bold text-wave-600">wave</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <button className="mb-3 flex w-full items-center gap-2 rounded-lg bg-wave-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-wave-700">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create new
          </button>

          <div className="space-y-1">
            <Link href={`/${userId}/dashboard`} className="flex items-center gap-3 rounded-lg bg-wave-50 px-3 py-2 text-sm font-medium text-wave-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            
            {/* Sales & Payments with Dropdown */}
            <div>
              <button 
                onClick={() => setSalesPaymentsOpen(!salesPaymentsOpen)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Sales & Payments
                </div>
                <svg 
                  className={`h-4 w-4 transition-transform ${salesPaymentsOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {salesPaymentsOpen && (
                <div className="ml-8 mt-1 space-y-1 border-l-2 border-wave-200 pl-3">
                  <Link href={`/${userId}/estimates`} className="block rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-wave-700">
                    Estimates
                  </Link>
                  <a href="#" className="block rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-wave-700">
                    Invoices
                  </a>
                  <a href="#" className="block rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-wave-700">
                    Payments Setup
                  </a>
                  <a href="#" className="block rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-wave-700">
                    Recurring Invoices
                  </a>
                  <a href="#" className="block rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-wave-700">
                    Checkouts
                  </a>
                  <a href="#" className="block rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-wave-700">
                    Customer Statements
                  </a>
                  <a href="#" className="block rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-wave-700">
                    Customers
                  </a>
                  <a href="#" className="block rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-wave-700">
                    Products & Services
                  </a>
                </div>
              )}
            </div>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Purchases
            </a>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Receipts
            </a>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Accounting
            </a>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Banking
            </a>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Payroll
            </a>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Reports
            </a>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Wave Advisors
            </a>
            <a href="#" className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                Perks
              </div>
              <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-800">New</span>
            </a>
          </div>
        </nav>

        {/* Bottom CTA */}
        <div className="border-t border-gray-200 p-4">
          <div className="rounded-lg bg-gradient-to-br from-wave-50 to-blue-50 p-3">
            <div className="mb-2 flex items-center gap-2">
              <svg className="h-6 w-6 text-wave-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className="mb-2 text-xs font-medium text-gray-900">Accept credit cards & bank payments</p>
            <button className="text-xs font-semibold text-wave-600 hover:text-wave-700">
              Set up now →
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-60 flex-1">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
          <h1 className="text-3xl font-normal text-gray-900">{getGreeting()}</h1>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Help us improve the dashboard
            </button>
            <button className="rounded-lg bg-wave-600 px-4 py-2 text-sm font-medium text-white hover:bg-wave-700">
              Send feedback
            </button>
            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Switch back
            </button>
            <button onClick={logout} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Sign out
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-normal text-gray-900">Insights for you</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Viewing</span>
              <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50">
                <option>Big picture</option>
                <option>Detail view</option>
                <option>Summary</option>
              </select>
            </div>
          </div>

          {/* Insights Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Card 1 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="h-3 w-32 animate-pulse rounded bg-gray-200"></div>
                <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
              </div>
              <div className="mb-6 h-40 animate-pulse rounded bg-gray-100"></div>
              <div className="h-3 w-48 animate-pulse rounded bg-gray-200"></div>
            </div>

            {/* Card 2 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="h-3 w-40 animate-pulse rounded bg-gray-200"></div>
                <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
              </div>
              <div className="mb-6 h-40 animate-pulse rounded bg-gray-100"></div>
              <div className="h-3 w-36 animate-pulse rounded bg-gray-200"></div>
            </div>

            {/* Card 3 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="h-3 w-28 animate-pulse rounded bg-gray-200"></div>
                <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
              </div>
              <div className="mb-6 h-40 animate-pulse rounded bg-gray-100"></div>
              <div className="h-3 w-44 animate-pulse rounded bg-gray-200"></div>
            </div>

            {/* Card 4 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="h-3 w-36 animate-pulse rounded bg-gray-200"></div>
                <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
              </div>
              <div className="mb-6 h-40 animate-pulse rounded bg-gray-100"></div>
              <div className="h-3 w-40 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
