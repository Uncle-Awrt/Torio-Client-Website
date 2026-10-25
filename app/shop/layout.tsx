import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop | Torio Client - Editions, Cape Cloud Slots & Perks',
  description:
    'Browse upcoming Torio Client editions, custom cape cloud upload slots, and VIP supporter perks for Minecraft Bedrock.',
  openGraph: {
    title: 'Torio Client Store (Coming Soon)',
    description:
      'Browse upcoming Torio Client editions, custom cape cloud upload slots, and VIP supporter perks for Minecraft Bedrock.',
    type: 'website',
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
