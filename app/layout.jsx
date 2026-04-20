import './globals.css'

export const metadata = {
  title: 'Talent Allocation Engine',
  description: 'Match your potential to your highest-upside opportunity',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
