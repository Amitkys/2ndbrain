import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        </body>
    </html>
  )
}