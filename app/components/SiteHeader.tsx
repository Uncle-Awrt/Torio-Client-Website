'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './SiteHeader.module.css'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/docs', label: 'Documentation' }, // または 'Documentation'
]

export default function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          TorioGhost Client
        </Link>
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}