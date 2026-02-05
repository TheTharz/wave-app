'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { estimateService } from '@/lib/services/estimate.service';
import { customerService } from '@/lib/services/customer.service';
import { itemService } from '@/lib/services/item.service';
import type { Customer } from '@/lib/types/customer';
import type { Item } from '@/lib/types/item';
import Link from 'next/link';

interface EstimateItem {
  item_id: number;
  item_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_id?: number;
}

export default function NewEstimatePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  
  const [businessDetailsOpen, setBusinessDetailsOpen] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [estimateNumber, setEstimateNumber] = useState('4530');
  const [customerRef, setCustomerRef] = useState('');
  const [issueDate, setIssueDate] = useState('2026-02-05');
  const [expiryDate, setExpiryDate] = useState('2026-03-07');
  const [notes, setNotes] = useState('');
  const [footerNote, setFooterNote] = useState('');
  const [items, setItems] = useState<EstimateItem[]>([]);
  const [currency, setCurrency] = useState('CAD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user && user.id.toString() !== userId) {
      router.push(`/${user.id}/estimates/add`);
    }
  }, [user, userId, router]);

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const handleAddItemClick = async () => {
    setShowItemModal(true);
    setLoadingItems(true);
    try {
      const response = await itemService.getItems(1, 100);
      setAvailableItems(response.items);
    } catch (err: any) {
      setError(err.message || 'Failed to load items');
    } finally {
      setLoadingItems(false);
    }
  };

  const handleSelectItem = (item: Item) => {
    setItems([...items, {
      item_id: item.id,
      item_name: item.name,
      description: item.description,
      quantity: 1,
      unit_price: item.price,
      tax_id: item.taxes.length > 0 ? item.taxes[0].id : undefined,
    }]);
    setShowItemModal(false);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof EstimateItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleAddCustomerClick = async () => {
    setShowCustomerModal(true);
    setLoadingCustomers(true);
    try {
      const response = await customerService.getCustomers(1, 100);
      setCustomers(response.customers);
    } catch (err: any) {
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    setCustomerId(customer.id);
    setSelectedCustomer(customer);
    setShowCustomerModal(false);
  };

  const handleSubmit = async () => {
    setError('');
    
    if (!customerId) {
      setError('Please select a customer');
      return;
    }

    if (items.length === 0) {
      setError('Please add at least one item');
      return;
    }

    setIsSubmitting(true);

    try {
      const estimateData = {
        customer_id: customerId,
        issue_date: issueDate,
        expiry_date: expiryDate,
        notes,
        footer_note: footerNote,
        items: items.map(item => ({
          item_id: item.item_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      };

      await estimateService.createEstimate(estimateData);
      router.push(`/${userId}/estimates`);
    } catch (err: any) {
      setError(err.message || 'Failed to create estimate');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-wave-200 border-t-wave-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Same as other pages */}
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
          <Link href={`/${userId}/estimates/add`} className="mb-3 flex w-full items-center gap-2 rounded-lg bg-wave-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-wave-700">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create new
          </Link>

          <div className="space-y-1">
            <Link href={`/${userId}/dashboard`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-60 flex-1">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-6">
          <h1 className="text-3xl font-normal text-gray-900">New estimate</h1>
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-wave-600 px-4 py-2 text-sm font-medium text-wave-600 hover:bg-wave-50">
              Preview
            </button>
            <div className="relative">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-wave-600 px-4 py-2 text-sm font-medium text-white hover:bg-wave-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save and continue'}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
              {error}
            </div>
          )}

          {/* Business Details Section */}
          <div className="mb-6">
            <button
              onClick={() => setBusinessDetailsOpen(!businessDetailsOpen)}
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-6 py-4 text-left hover:bg-gray-50"
            >
              <span className="text-sm text-gray-700">Business address and contact details, title, summary, and logo</span>
              <svg 
                className={`h-5 w-5 text-gray-400 transition-transform ${businessDetailsOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Main Form */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="grid grid-cols-2 gap-8 p-8">
              {/* Left Column - Customer */}
              <div>
                {selectedCustomer ? (
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wave-100 text-wave-700">
                        <span className="text-lg font-semibold">{selectedCustomer.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{selectedCustomer.name}</h3>
                        <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                        {selectedCustomer.phone && (
                          <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleAddCustomerClick}
                      className="text-sm text-wave-600 hover:text-wave-700"
                    >
                      Change customer
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddCustomerClick}
                    className="flex items-center gap-2 text-wave-600 hover:text-wave-700"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-gray-300">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Add customer</span>
                  </button>
                )}
              </div>

              {/* Right Column - Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Estimate number</label>
                  <input
                    type="text"
                    value={estimateNumber}
                    onChange={(e) => setEstimateNumber(e.target.value)}
                    className="w-32 rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-wave-500 focus:outline-none focus:ring-1 focus:ring-wave-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Customer ref</label>
                  <input
                    type="text"
                    value={customerRef}
                    onChange={(e) => setCustomerRef(e.target.value)}
                    className="w-32 rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-wave-500 focus:outline-none focus:ring-1 focus:ring-wave-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-32 rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-wave-500 focus:outline-none focus:ring-1 focus:ring-wave-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Valid until</label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-32 rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-wave-500 focus:outline-none focus:ring-1 focus:ring-wave-500"
                    />
                  </div>
                  <p className="mt-1 text-right text-xs text-gray-500">Within 30 days</p>
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="border-t border-gray-200 p-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Items</h3>
                <button className="flex items-center gap-1 text-sm text-wave-600 hover:text-wave-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit columns
                </button>
              </div>

              {/* Items Table */}
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-600">
                    <th className="pb-3 font-medium">Items</th>
                    <th className="pb-3 text-center font-medium">Quantity</th>
                    <th className="pb-3 text-right font-medium">Price</th>
                    <th className="pb-3 text-right font-medium">Amount</th>
                    <th className="w-10 pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3">
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={item.item_name}
                            onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                            placeholder="Item name"
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm font-medium focus:border-wave-500 focus:outline-none focus:ring-1 focus:ring-wave-500"
                          />
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            placeholder="Description"
                            className="w-full rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-600 focus:border-wave-500 focus:outline-none focus:ring-1 focus:ring-wave-500"
                          />
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                          min="1"
                          className="w-20 rounded border border-gray-300 px-3 py-2 text-center text-sm focus:border-wave-500 focus:outline-none focus:ring-1 focus:ring-wave-500"
                        />
                      </td>
                      <td className="py-3 text-right">
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => updateItem(index, 'unit_price', Number(e.target.value))}
                          min="0"
                          step="0.01"
                          className="w-28 rounded border border-gray-300 px-3 py-2 text-right text-sm focus:border-wave-500 focus:outline-none focus:ring-1 focus:ring-wave-500"
                        />
                      </td>
                      <td className="py-3 text-right text-sm font-medium text-gray-900">
                        ${(item.quantity * item.unit_price).toFixed(2)}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => removeItem(index)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={handleAddItemClick}
                className="mt-4 flex items-center gap-2 text-sm font-medium text-wave-600 hover:text-wave-700"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add item
              </button>

              {/* Totals */}
              <div className="mt-8 flex justify-end">
                <div className="w-96 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <button className="flex items-center gap-1 text-sm text-wave-600 hover:text-wave-700">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add discount
                  </button>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">Total</span>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 focus:border-wave-500 focus:outline-none focus:ring-1 focus:ring-wave-500"
                      >
                        <option value="CAD">CAD ($) - Canadian dollar</option>
                        <option value="USD">USD ($) - US dollar</option>
                        <option value="EUR">EUR (€) - Euro</option>
                      </select>
                    </div>
                    <span className="text-lg font-bold text-gray-900">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Request deposit
                </button>
              </div>
            </div>

            {/* Footer Note Section */}
            <div className="border-t border-gray-200 p-8">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Footer note
              </label>
              <textarea
                value={footerNote}
                onChange={(e) => setFooterNote(e.target.value)}
                placeholder="Add terms, payment instructions, or other notes..."
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-wave-500 focus:outline-none focus:ring-1 focus:ring-wave-500"
              />
              <p className="mt-2 text-xs text-gray-500">
                This note will appear at the bottom of your estimate
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Customer Selection Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">Select Customer</h2>
              <button
                onClick={() => setShowCustomerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-6">
              {loadingCustomers ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-wave-200 border-t-wave-600"></div>
                </div>
              ) : customers.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <p>No customers found</p>
                  <p className="mt-2 text-sm">Create a customer first to add them to estimates</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {customers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => handleSelectCustomer(customer)}
                      className="flex w-full items-center gap-4 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-wave-500 hover:bg-wave-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wave-100 text-wave-700">
                        <span className="text-lg font-semibold">{customer.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{customer.name}</h3>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                        {customer.phone && (
                          <p className="text-sm text-gray-500">{customer.phone}</p>
                        )}
                      </div>
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Item Selection Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">Select Item</h2>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-6">
              {loadingItems ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-wave-200 border-t-wave-600"></div>
                </div>
              ) : availableItems.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <p>No items found</p>
                  <p className="mt-2 text-sm">Create an item first to add them to estimates</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className="flex w-full items-center gap-4 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-wave-500 hover:bg-wave-50"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        {item.description && (
                          <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                        )}
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-sm font-semibold text-gray-900">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.taxes.length > 0 && (
                            <span className="text-xs text-gray-500">
                              Tax: {item.taxes.map(t => t.name).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
