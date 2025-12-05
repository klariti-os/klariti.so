import { type Metadata } from "next"

import "@/styles/globals.css"
import BaseLayout from "@/components/layout/BaseLayout"
import { AuthProvider } from "@/contexts/AuthContext"

import localFont from "next/font/local";

const ppEditorial = localFont({
  src: [
    {
      path: "../../public/fonts/editorial-new/PPEditorialNew-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/editorial-new/PPEditorialNew-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/editorial-new/PPEditorialNew-Ultrabold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/editorial-new/PPEditorialNew-Ultralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/editorial-new/PPEditorialNew-UltralightItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../public/fonts/editorial-new/PPEditorialNew-UltraboldItalic.otf",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-pp-editorial",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`h-full antialiased ${ppEditorial.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-[#2a2828] selection:bg-white/10 -z-10">
        <AuthProvider>
          <BaseLayout>{children}</BaseLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
