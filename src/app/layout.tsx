import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GrantOS | Win More Web3 Grants",
    template: "%s | GrantOS"
  },
  description: "Track ecosystem rounds, generate tailored applications with AI, and never miss a reporting milestone. GrantOS is the free Web3 grant CRM for Ethereum, Solana, and L2 ecosystems.",
  metadataBase: new URL("https://grantos.io"),
  openGraph: {
    title: "GrantOS | Win More Web3 Grants",
    description: "Track ecosystem rounds, generate tailored applications with AI, and never miss a reporting milestone. Free Web3 grant CRM.",
    url: "https://grantos.io",
    siteName: "GrantOS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrantOS | Win More Web3 Grants",
    description: "Track ecosystem rounds, generate tailored applications with AI, and never miss a reporting milestone. Free Web3 grant CRM.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "GrantOS",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "Track Web3 grant rounds, generate tailored applications with AI, and manage reporting milestones. Free grant CRM for Ethereum, Solana, and L2 ecosystems.",
  url: "https://grantos.io",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
