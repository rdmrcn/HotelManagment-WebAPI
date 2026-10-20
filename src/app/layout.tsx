import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google"
import { AuthProvider } from "@/components/auth-provider"
import { ChatLauncher } from "@/components/chat-launcher"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { SITE_URL, AUTHOR } from "@/lib/house"
import "./globals.css"

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
})

const description =
  "Bosfor Hotels is a fictional house hotel on a hillside street in Bebek, Istanbul. Eight room types, Bosphorus-side and city-side, with live availability for the next 60 days. A portfolio demo."

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: "Bosfor Hotels · A hillside house above the Bosphorus",
    template: "%s · Bosfor Hotels",
  },
  description,
  applicationName: "Bosfor Hotels",
  authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
  creator: AUTHOR.name,
  keywords: ["Bosfor Hotels", "Bebek", "Istanbul", "Bosphorus", "hotel demo", "Next.js portfolio"],
  openGraph: {
    type: "website",
    siteName: "Bosfor Hotels",
    title: "Bosfor Hotels · A hillside house above the Bosphorus",
    description,
    url: `${SITE_URL}/`,
    locale: "en_GB",
    images: [{ url: `${SITE_URL}/og.jpg`, width: 1200, height: 630, alt: "Bosfor Hotels, a hillside house above the Bosphorus in Bebek, Istanbul." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bosfor Hotels · A hillside house above the Bosphorus",
    description,
    images: [`${SITE_URL}/og.jpg`],
  },
}

export const viewport: Viewport = {
  themeColor: "#0b2238",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <AuthProvider>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-background focus:px-4 focus:py-2"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <ChatLauncher />
        </AuthProvider>
      </body>
    </html>
  )
}
