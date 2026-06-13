import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { UIProvider } from '../context/UIContext';
import CartDrawer from '../components/CartDrawer';
import CheckoutModal from '../components/CheckoutModal';
import OrdersDrawer from '../components/OrdersDrawer';
import QuickViewModal from '../components/QuickViewModal';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Brocus Solution — Premium E-Commerce Experience',
  description: 'A modern, full-stack production-ready e-commerce store built with Next.js, Tailwind CSS, Express, and MongoDB.',
  keywords: 'ecommerce, shopping, nextjs, react, express, mongodb',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <AuthProvider>
          <CartProvider>
            <UIProvider>
              <div className="flex flex-col min-h-screen">
                {children}
              </div>
              
              {/* Global SPA Modals & Drawers */}
              <CartDrawer />
              <CheckoutModal />
              <OrdersDrawer />
              <QuickViewModal />
              
              <Toaster
                position="top-right"
                toastOptions={{
                  className: 'glass dark:bg-slate-900 dark:text-white dark:border-slate-800 text-sm font-semibold rounded-xl p-4 shadow-lg border border-slate-200/80',
                  duration: 3000,
                  success: {
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#FFFFFF',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#FFFFFF',
                    },
                  },
                }}
              />
            </UIProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
