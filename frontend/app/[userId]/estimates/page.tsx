'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { estimateService } from '@/lib/services/estimate.service';
import type { Estimate, EstimatesResponse } from '@/lib/types/estimate';
import Link from 'next/link';

export default function EstimatesPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(25);
  const [activeTab, setActiveTab] = useState<'active' | 'draft' | 'all'>('active');
  const [salesPaymentsOpen, setSalesPaymentsOpen] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user && user.id.toString() !== userId) {
      router.push(`/${user.id}/estimates`);
    }
  }, [user, userId, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEstimates();
    }
  }, [isAuthenticated, page, perPage]);

  const fetchEstimates = async () => {
    try {
      setIsLoading(true);
      const response: EstimatesResponse = await estimateService.getEstimates(page, perPage);
      setEstimates(response.estimates);
      setTotal(response.total);
      setTotalPages(response.total_pages);
    } catch (error) {
      console.error('Failed to fetch estimates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-wave-200 border-t-wave-600"></div>
      </div>
    );
  }

  const activeEstimates = estimates.filter(e => e.issue_date);
  const draftEstimates = estimates.filter(e => !e.issue_date);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Same as dashboard */}
      <aside className="fixed left-0 top-0 flex h-screen w-60 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
          <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none">
            <path d="M8 20C8 13.37 13.37 8 20 8C26.63 8 32 13.37 32 20C32 26.63 26.63 32 20 32C13.37 32 8 26.63 8 20Z" fill="#0EA5E9"/>
            <path d="M20 8C13.37 8 8 13.37 8 20H12C12 15.58 15.58 12 20 12V8Z" fill="#0284C7"/>
            <path d="M28 20C28 15.58 24.42 12 20 12V16C22.21 16 24 17.79 24 20H28Z" fill="#38BDF8"/>
          </svg>
          <span className="text-xl font-bold text-wave-600">wave</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <button className="mb-3 flex w-full items-center gap-2 rounded-lg bg-wave-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-wave-700">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create new
          </button>

          <div className="space-y-1">
            <Link href={`/${userId}/dashboard`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            
            <div>
              <button 
                onClick={() => setSalesPaymentsOpen(!salesPaymentsOpen)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-wave-700 bg-wave-50"
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
                  <Link href={`/${userId}/estimates`} className="block rounded bg-wave-100 px-3 py-1.5 text-sm font-medium text-wave-700">
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
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-60 flex-1">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
          <h1 className="text-3xl font-normal text-gray-900">Estimates</h1>
          <div className="flex items-center gap-3">
            <button onClick={logout} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Sign out
            </button>
            <button className="rounded-lg bg-wave-600 px-4 py-2 text-sm font-medium text-white hover:bg-wave-700">
              Create estimate
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-gray-200 bg-white px-8 py-6">
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            <svg className="h-5 w-5 text-wave-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-gray-900">0</span>
            <span>Active filters</span>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 focus:border-wave-500 focus:outline-none focus:ring-1 focus:ring-wave-500">
              <option>All customers</option>
            </select>
            <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 focus:border-wave-500 focus:outline-none focus:ring-1 focus:ring-wave-500">
              <option>All statuses</option>
            </select>
            <div className="flex gap-2">
              <input type="date" placeholder="From" className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 focus:border-wave-500 focus:outline-none focus:ring-1 focus:ring-wave-500" />
              <input type="date" placeholder="To" className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 focus:border-wave-500 focus:outline-none focus:ring-1 focus:ring-wave-500" />
            </div>
            <div className="relative">
              <input type="text" placeholder="Enter estimate #" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm placeholder-gray-400 hover:bg-gray-50 focus:border-wave-500 focus:outline-none focus:ring-1 focus:ring-wave-500" />
              <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white px-8">
          <div className="flex gap-6">
            <button 
              onClick={() => setActiveTab('active')}
              className={`border-b-2 px-1 py-3 text-sm font-medium ${activeTab === 'active' ? 'border-wave-600 text-wave-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              Active <span className="ml-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs">{activeEstimates.length}</span>
            </button>
            <button 
              onClick={() => setActiveTab('draft')}
              className={`border-b-2 px-1 py-3 text-sm font-medium ${activeTab === 'draft' ? 'border-wave-600 text-wave-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              Draft <span className="ml-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs">{draftEstimates.length}</span>
            </button>
            <button 
              onClick={() => setActiveTab('all')}
              className={`border-b-2 px-1 py-3 text-sm font-medium ${activeTab === 'all' ? 'border-wave-600 text-wave-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              All
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white px-8 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-wave-200 border-t-wave-600"></div>
            </div>
          ) : estimates.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No estimates found
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-600">
                    <th className="pb-3">Status</th>
                    <th className="pb-3">
                      Date
                      <svg className="ml-1 inline h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </th>
                    <th className="pb-3">Number</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3 text-right">Amount</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {estimates.map((estimate) => (
                    <tr key={estimate.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4">
                        <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${estimate.issue_date ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {estimate.issue_date ? 'Sent' : 'Saved'}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-900">{estimate.issue_date || '-'}</td>
                      <td className="py-4 text-sm text-gray-900">{estimate.estimate_number}</td>
                      <td className="py-4 text-sm text-gray-900">{estimate.customer.name}</td>
                      <td className="py-4 text-right text-sm text-gray-900">${estimate.total.toFixed(2)}</td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {estimate.issue_date && (
                            <button className="rounded-lg border border-wave-600 px-3 py-1.5 text-xs font-medium text-wave-600 hover:bg-wave-50">
                              Send
                            </button>
                          )}
                          <button className="rounded-lg border border-wave-600 px-3 py-1.5 text-xs font-medium text-wave-600 hover:bg-wave-50">
                            Convert to invoice
                          </button>
                          <button className="rounded p-1 hover:bg-gray-100">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Show:</span>
                  <select 
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    className="rounded border border-gray-300 bg-white px-2 py-1 text-gray-900 hover:bg-gray-50"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-gray-600">per page</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">
                    {Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)} of {total}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
