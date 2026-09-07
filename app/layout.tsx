import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context/AppContext';
import { ToastContainer } from '@/components/common/Toast';

export const metadata: Metadata = {
  title: 'Samanvay | Integrated Approval & Compliance Management Platform',
  description: 'Simplifying approvals. Coordinating departments. Enabling transparent progress for Indian enterprise establishment and statutory compliance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <div className="gov-tricolor-strip w-full fixed top-0 left-0 z-50" />
        <AppProvider>
          <div className="flex-1 flex flex-col pt-[3px]">
            {children}
          </div>
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
