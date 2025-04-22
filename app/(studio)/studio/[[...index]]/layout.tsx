import type React from "react"
export const metadata = {
  title: "Sanity Studio",
  description: "Admin dashboard for the documentation site",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
