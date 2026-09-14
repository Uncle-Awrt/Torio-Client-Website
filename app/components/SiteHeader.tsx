'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './SiteHeader.module.css'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/docs', label: 'Docs' },
]

const EXTERNAL_LINKS = [
  { href: 'https://github.com/Uncle-Awrt/Torio-Client', label: 'GitHub' },
  { href: 'https://discord.gg/xq8sWQhuXG', label: 'Discord' },
]

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export default function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <img src={`${BASE}/images/icon.png`} alt="" className={styles.brandIcon} />
          <span>Torio Client</span>
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
          <span className={styles.navDivider} aria-hidden="true" />
          {EXTERNAL_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navLink}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
