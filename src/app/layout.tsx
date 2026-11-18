import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import { OrderProvider } from '@/context/OrderContext';

export const metadata: Metadata = {
  title: 'Grey Dot. Coffee Shop | Drive-Thru & To-Go Menu',
  description: 'Digital express menu and live drive-thru dispatch for Grey Dot Coffee Shop, ITC Mantra, Ram Chowk, Mota Varachha, Surat. Pay at window upon collection.',
  keywords: ['Grey Dot Coffee Shop', 'Drive-Thru Coffee Surat', 'Mota Varachha Cafe', 'Cold Brew Surat', 'Takeaway Coffee'],
  authors: [{ name: 'Grey Dot. Coffee Shop' }],
  metadataBase: new URL('https://greydotcoffee.vercel.app'),
  openGraph: {
    title: 'Grey Dot. Coffee Shop | Drive-Thru & Takeaway Menu',
    description: 'Order cold coffees, frappes, shakes, pizzas & fries ahead from your car at Grey Dot Mota Varachha.',
    url: 'https://greydotcoffee.vercel.app',
    siteName: 'Grey Dot. Coffee Shop',
    images: [
      {
        url: '/grey_dot_logo_straight.png',
        width: 800,
        height: 600,
        alt: 'Grey Dot. Coffee Shop Surat',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grey Dot. Coffee Shop — Drive-Thru & To-Go Menu',
    description: 'Order cold coffee, frappes & fast bites ahead at Grey Dot Mota Varachha, Surat.',
    images: ['/grey_dot_logo_straight.png'],
  },
  icons: {
    icon: '/grey_dot_logo_straight.png',
    apple: '/grey_dot_logo_straight.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#6ec6f1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-concrete-100 dark:bg-noir-base text-concrete-900 dark:text-zinc-100 transition-colors selection:bg-brand-sky selection:text-black">
        <ThemeProvider>
          <CartProvider>
            <OrderProvider>
              {children}
            </OrderProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
