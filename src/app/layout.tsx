import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { MenuProvider } from '@/context/MenuContext';
import { CartProvider } from '@/context/CartContext';
import { OrderProvider } from '@/context/OrderContext';

const SITE_URL = 'https://drivethrucafe.vercel.app';

export const metadata: Metadata = {
  title: 'Grey Dot. Coffee Shop Surat | Drive-Thru & Express Menu | Lane 1 Mota Varachha',
  description: 'Order specialty Arabica coffees, thick shakes, artisan pizzas & fries ahead from your car within 3 km. Collect at Lane 1 window, ITC Mantra, Ram Chowk, Mota Varachha, Surat. Pay at counter.',
  keywords: [
    'Grey Dot Coffee Shop',
    'Grey Dot Surat',
    'Drive-Thru Coffee Surat',
    'Mota Varachha Cafe',
    'Specialty Coffee Surat',
    'Ram Chowk Coffee',
    'ITC Mantra Cafe',
    'Cold Brew Surat',
    '100% Pure Veg Cafe Surat',
    'Drive Thru Cafe Gujarat',
    'Lane 1 Coffee Window'
  ],
  authors: [{ name: 'Grey Dot. Coffee Shop Surat' }],
  creator: 'Grey Dot. Coffee Shop',
  publisher: 'Grey Dot. Coffee Shop',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Grey Dot. Coffee Shop Surat — Drive-Thru & Express To-Go Menu',
    description: 'Order specialty cold brews, frappes, shakes, pizzas & fries ahead from your car. Lane 1 window collection at Ram Chowk, Mota Varachha, Surat.',
    url: SITE_URL,
    siteName: 'Grey Dot. Coffee Shop Surat',
    images: [
      {
        url: '/grey_dot_logo_straight.png',
        width: 1200,
        height: 630,
        alt: 'Grey Dot. Coffee Shop Surat Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grey Dot. Coffee Shop Surat — Drive-Thru Menu',
    description: 'Specialty coffee & artisan fast food drive-thru at Ram Chowk, Mota Varachha, Surat. Orders accepted within 3 km.',
    images: ['/grey_dot_logo_straight.png'],
  },
  icons: {
    icon: '/grey_dot_logo_straight.png',
    apple: '/grey_dot_logo_straight.png',
  },
  other: {
    'geo.region': 'IN-GJ',
    'geo.placename': 'Surat',
    'geo.position': '21.2385;72.8788',
    'ICBM': '21.2385, 72.8788',
  },
};

export const viewport: Viewport = {
  themeColor: '#6ec6f1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Rich Structured JSON-LD Schema for Google & LLM Crawlers
  const jsonLdRestaurant = {
    '@context': 'https://schema.org',
    '@type': 'CoffeeShop',
    '@id': `${SITE_URL}/#coffeeshop`,
    name: 'Grey Dot. Coffee Shop',
    alternateName: 'Grey Dot Drive-Thru Surat',
    description: 'Surat premiere specialty drive-thru and express takeaway coffee shop at ITC Mantra, Ram Chowk, Mota Varachha.',
    url: SITE_URL,
    logo: `${SITE_URL}/grey_dot_logo_straight.png`,
    image: `${SITE_URL}/grey_dot_logo_straight.png`,
    telephone: '+919727042420',
    email: 'care@greydotcoffee.com',
    priceRange: '₹₹',
    servesCuisine: ['Coffee', 'Cafe', 'Beverages', 'Pizza', 'Italian', 'Vegetarian', 'Fast Food'],
    hasDriveThroughService: true,
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, Debit Card, UPI (Physical payment at window Lane 1)',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ITC Mantra, Ram Chowk',
      addressLocality: 'Mota Varachha, Surat',
      addressRegion: 'Gujarat',
      postalCode: '394101',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 21.2385,
      longitude: 72.8788,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '10:00',
        closes: '24:00',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+919727042420',
      contactType: 'customer service',
      email: 'care@greydotcoffee.com',
      availableLanguage: ['English', 'Gujarati', 'Hindi'],
    },
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does the Grey Dot Drive-Thru ordering process work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Browse the digital menu from your car, place your order within our 3 km perimeter, and receive an instant Live Token. Drive into Lane 1 at ITC Mantra, Ram Chowk, Mota Varachha, Surat, show your token number, collect your freshly prepared order, and pay physically at the counter.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why does Grey Dot only accept orders within 3 km?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To ensure your coffee is served boiling hot and your thick shakes stay chilled and thick, our kitchen begins preparation as you approach the lane. Orders are strictly reserved for customers within a 3.0 km radius of Ram Chowk, Surat.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does payment work at Grey Dot?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Payment is accepted physically at the drive-thru window (Lane 1). We accept Cash, all UPI apps (GPay, PhonePe, Paytm), and Credit/Debit cards upon collection.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is Grey Dot customer care phone number and email?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Customer care can be reached by phone or WhatsApp at +91 97270 42420, or via email at care@greydotcoffee.com.',
        },
      },
    ],
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdRestaurant) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body className="antialiased min-h-screen bg-concrete-100 dark:bg-noir-base text-concrete-900 dark:text-zinc-100 transition-colors selection:bg-brand-sky selection:text-black">
        <ThemeProvider>
          <MenuProvider>
            <CartProvider>
              <OrderProvider>
                {children}
              </OrderProvider>
            </CartProvider>
          </MenuProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
