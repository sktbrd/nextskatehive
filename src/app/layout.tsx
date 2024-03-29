import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { Share_Tech_Mono } from "next/font/google"

import Favicon from "@/components/FaviconLinks"
import Navbar from "@/components/Navbar"
import { getWebsiteURL } from "@/lib/utils"
import { ColorModeScript, Flex } from "@chakra-ui/react"
import { Providers } from "./providers"

const share_tech_mono = Share_Tech_Mono({ subsets: ["latin"], weight: "400" })

export const metadata: Metadata = {
  // metadataBase: new URL(getWebsiteURL()),
  title: "Skatehive App",
  description: "Digital hive for underground bees",
  openGraph: {
    images: `${getWebsiteURL()}/default_banner.png`,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <head>
        <Favicon />
      </head>
      <body className={share_tech_mono.className}>
        <ColorModeScript initialColorMode="dark" />
        <Providers>
          <Navbar />
          <Flex px={[1, 3]} pt={0} overflow="visible">
            {children}
          </Flex>
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
