import type { Metadata } from 'next'
import './globals.css'
import { GameProvider } from '@/contexts/gamecontext'

export const metadata: Metadata = {
  title: 'Doodle Frenzy - Draw and Guess Game',
  description: 'A real-time multiplayer drawing and guessing game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  )
}
