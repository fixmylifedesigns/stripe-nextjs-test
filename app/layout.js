import './globals.css'

export const metadata = {
  title: 'Stripe Product Store',
  description: 'Buy products using Stripe',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}