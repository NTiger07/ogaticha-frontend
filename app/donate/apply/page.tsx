'use client';

import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';

export default function ApplyDonationPage() {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [amountNeeded, setAmountNeeded] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        name,
        email,
        title,
        amountNeeded,
        description,
        phone,
      };

      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to submit');
      await res.json();
      setSuccess('Application submitted — thank you!');
      setName('');
      setEmail('');
      setTitle('');
      setAmountNeeded('');
      setDescription('');
      setPhone('');
    } catch (error) {
      console.error(error);
      setError('Submission failed — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f5] dark:bg-[#23220f]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isDesktopOpen={isDesktopSidebarOpen} onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)} />

      <main className={`${isDesktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} min-h-screen pb-20 lg:pb-8 transition-all duration-300`}>
        <header className="bg-[#4a148c] px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">Apply for Donation</h1>
                <p className="hidden lg:block text-white/80 mt-1">Provide details about the student need</p>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-10 lg:py-12">
          <div className="bg-white dark:bg-[#1a1a0b] rounded-xl p-6 lg:p-8 border border-gray-200 dark:border-[#33331a]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Your name</label>
                <input title="Your name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#4a148c] focus:border-[#4a148c]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                <input title="Email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#4a148c] focus:border-[#4a148c]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Student / Project Title</label>
                <input title="Student or project title" placeholder="e.g. Braille keyboard for Tola" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#4a148c] focus:border-[#4a148c]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Amount Needed (USD)</label>
                <input title="Amount needed in USD" placeholder="e.g. 500" value={amountNeeded} onChange={(e) => setAmountNeeded(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#4a148c] focus:border-[#4a148c]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
                <textarea title="Description" placeholder="Describe the need and how funds will be used" value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#4a148c] focus:border-[#4a148c]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Contact Phone (optional)</label>
                <input title="Contact phone" placeholder="Optional phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#4a148c] focus:border-[#4a148c]" />
              </div>

              <div className="pt-4">
                <button disabled={submitting} type="submit" className="w-full inline-flex justify-center items-center gap-2 bg-[#4a148c] hover:bg-[#3a0f6a] text-white font-bold py-2 px-4 rounded-md">
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>

              {success && <p className="text-green-600">{success}</p>}
              {error && <p className="text-red-600">{error}</p>}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
