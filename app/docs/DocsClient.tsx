'use client'

import { useState, useEffect, useMemo, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import 'katex/dist/katex.min.css'
import SiteHeader from '../components/SiteHeader'
import styles from './docs.module.css'

// $...$ inline and $$...$$ display math in the docs, rendered to HTML at parse time
marked.use(markedKatex({ throwOnError: false, nonStandard: true }))

export type Lang = 'en' | 'ja'

interface DocText {
  name: string
  description: string
  content: string
}

interface DocPage {
  id: string
  en: DocText
  ja?: DocText
}

export interface DocsData {
  categories: { id: string; label: Record<Lang, string> }[]
  pages: Record<string, DocPage[]>
}

const LANG_KEY = 'torio-docs-lang'

const UI: Record<Lang, Record<string, string>> = {
  en: {
    docs: 'Documentation',
    search: 'Search docs...',
    clear: 'Clear search',
    open: 'Open navigation sidebar',
    close: 'Close navigation sidebar',
    noResults: 'No pages match your search.',
    englishOnly: 'This page is not translated yet.',
    prev: 'Previous',
    next: 'Next',
  },
  ja: {
    docs: 'ドキュメント',
    search: 'ドキュメントを検索...',
    clear: '検索をクリア',
    open: 'ナビゲーションを開く',
    close: 'ナビゲーションを閉じる',
    noResults: '一致するページがありません。',
    englishOnly: 'このページはまだ日本語に翻訳されていません。英語版を表示しています。',
    prev: '前へ',
    next: '次へ',
  },
}

const readStoredLang = (): Lang | null => {
  try {
    const v = localStorage.getItem(LANG_KEY)
    return v === 'en' || v === 'ja' ? v : null
  } catch {
    return null
  }
}

// the page header shows the title and description, so drop them from the body
function bodyOf(text: DocText): string {
  const lines = text.content.split('\n')
  const h1 = lines.findIndex((l) => /^#\s/.test(l))
  if (h1 >= 0) lines.splice(h1, 1)
  const desc = lines.findIndex((l) => l.trim() === text.description)
  if (text.description && desc >= 0) lines.splice(desc, 1)
  return lines.join('\n')
}

function DocsContent({ docsData }: { docsData: DocsData }) {
  const searchParams = useSearchParams()
  const { categories, pages } = docsData
  const firstCategory = categories.find((c) => pages[c.id]?.length)?.id ?? categories[0].id

  const resolve = (cat: string | null, mod: string | null) => {
    const category = cat && pages[cat]?.length ? cat : firstCategory
    const list = pages[category] ?? []
    const moduleId = mod && list.some((m) => m.id === mod) ? mod : list[0]?.id ?? ''
    return { category, moduleId }
  }

  const initial = resolve(searchParams.get('category'), searchParams.get('module'))
  const [lang, setLang] = useState<Lang>(searchParams.get('lang') === 'ja' ? 'ja' : 'en')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(initial.category)
  const [selectedModuleId, setSelectedModuleId] = useState(initial.moduleId)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ [initial.category]: true })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const { category, moduleId } = resolve(searchParams.get('category'), searchParams.get('module'))
    setSelectedCategory(category)
    setSelectedModuleId(moduleId)
    setExpanded((prev) => ({ ...prev, [category]: true }))
    const urlLang = searchParams.get('lang')
    if (urlLang === 'en' || urlLang === 'ja') setLang(urlLang)
    else {
      const stored = readStoredLang()
      if (stored) setLang(stored)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // mobile drawer: Esc closes it, and the page behind doesn't scroll while it's open
  useEffect(() => {
    if (!isSidebarOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsSidebarOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])

  const pushUrl = (category: string, moduleId: string, l: Lang) => {
    const url = `${window.location.pathname}?category=${category}&module=${moduleId}${l === 'ja' ? '&lang=ja' : ''}`
    window.history.pushState({ path: url }, '', url)
  }

  const selectModule = (category: string, moduleId: string) => {
    setSelectedCategory(category)
    setSelectedModuleId(moduleId)
    setIsSidebarOpen(false)
    setExpanded((prev) => ({ ...prev, [category]: true }))
    pushUrl(category, moduleId, lang)
    window.scrollTo({ top: 0 })
  }

  const changeLang = (l: Lang) => {
    setLang(l)
    try { localStorage.setItem(LANG_KEY, l) } catch { /* storage blocked */ }
    pushUrl(selectedCategory, selectedModuleId, l)
  }

  const t = UI[lang]
  const labelOf = (cat: string) => categories.find((c) => c.id === cat)?.label[lang] ?? cat
  const textOf = (page: DocPage) => (lang === 'ja' && page.ja) || page.en

  const activePage = pages[selectedCategory]?.find((m) => m.id === selectedModuleId) ?? pages[firstCategory]?.[0]
  const activeText = activePage ? textOf(activePage) : null
  const untranslated = lang === 'ja' && activePage && !activePage.ja

  const renderedContent = useMemo(
    () => (activeText ? (marked.parse(bodyOf(activeText), { async: false }) as string) : ''),
    [activeText],
  )

  // links inside a page (?category=..&module=..) switch pages without a reload
  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest('a')
      const href = a?.getAttribute('href')
      if (!href || !href.startsWith('?')) return
      const p = new URLSearchParams(href)
      const { category, moduleId } = resolve(p.get('category'), p.get('module'))
      e.preventDefault()
      selectModule(category, moduleId)
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  })

  const query = searchQuery.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!query) return pages
    const out: Record<string, DocPage[]> = {}
    for (const c of categories) {
      out[c.id] = (pages[c.id] ?? []).filter((p) =>
        [p.en, p.ja].some((x) => x && (x.name.toLowerCase().includes(query) || x.content.toLowerCase().includes(query))),
      )
    }
    return out
  }, [query, pages, categories])
  const anyMatch = categories.some((c) => filtered[c.id]?.length)

  // previous / next across the whole sidebar order
  const flat = categories.flatMap((c) => (pages[c.id] ?? []).map((p) => ({ category: c.id, page: p })))
  const idx = flat.findIndex((f) => f.category === selectedCategory && f.page.id === activePage?.id)
  const prev = idx > 0 ? flat[idx - 1] : null
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null

  return (
    <>
      {/* Mobile: bar showing the current page, opens the drawer */}
      <button
        className={styles.mobileToggle}
        onClick={() => setIsSidebarOpen(true)}
        aria-label={t.open}
        aria-expanded={isSidebarOpen}
        aria-controls="docs-sidebar"
      >
        <span aria-hidden="true">☰</span>
        <span className={styles.mobileToggleText}>{activeText?.name ?? t.docs}</span>
      </button>

      {isSidebarOpen && (
        <div className={styles.backdrop} onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />
      )}

      <aside id="docs-sidebar" className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarSticky}>
          <div className={styles.drawerHead}>
            <span>{t.docs}</span>
            <button type="button" className={styles.drawerClose} onClick={() => setIsSidebarOpen(false)} aria-label={t.close}>✕</button>
          </div>

          <div className={styles.langSwitch} role="group" aria-label="Language">
            {(['en', 'ja'] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={lang === l}
                className={`${styles.langOption} ${lang === l ? styles.langOptionActive : ''}`}
                onClick={() => changeLang(l)}
              >
                {l === 'en' ? 'English' : '日本語'}
              </button>
            ))}
          </div>

          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder={t.search}
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className={styles.searchClear} onClick={() => setSearchQuery('')} aria-label={t.clear} type="button">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" />
                  <line x1="8.5" y1="1.5" x2="1.5" y2="8.5" />
                </svg>
              </button>
            )}
          </div>

          <nav className={styles.navMenu} aria-label={t.docs}>
            {query && !anyMatch && <p className={styles.noResults}>{t.noResults}</p>}
            {categories.map(({ id: cat }) => {
              const list = filtered[cat] ?? []
              if (!list.length) return null
              const isExpanded = query ? true : !!expanded[cat]
              return (
                <div key={cat} className={styles.navSection}>
                  <button
                    className={styles.sectionHeader}
                    onClick={() => setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }))}
                    aria-expanded={isExpanded}
                  >
                    <span>{labelOf(cat)}</span>
                    <span className={`${styles.arrow} ${isExpanded ? styles.arrowExpanded : ''}`}>▾</span>
                  </button>

                  {isExpanded && (
                    <ul className={styles.moduleList}>
                      {list.map((page) => {
                        const isActive = selectedCategory === cat && activePage?.id === page.id
                        return (
                          <li key={page.id}>
                            <button
                              onClick={() => selectModule(cat, page.id)}
                              className={`${styles.moduleButton} ${isActive ? styles.moduleButtonActive : ''}`}
                              aria-current={isActive ? 'page' : undefined}
                            >
                              {textOf(page).name}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </aside>

      <main className={styles.contentArea}>
        {activeText ? (
          <article className={styles.docArticle} lang={untranslated ? 'en' : lang}>
            <header className={styles.articleHeader}>
              <div className={styles.categoryBreadcrumb}>
                {t.docs} / {labelOf(selectedCategory)}
              </div>
              <h1 className={styles.articleTitle}>{activeText.name}</h1>
              {activeText.description && <p className={styles.articleDescription}>{activeText.description}</p>}
            </header>

            {untranslated && <p className={styles.notice} lang="ja">{t.englishOnly}</p>}

            <div ref={bodyRef} className={styles.docBody} dangerouslySetInnerHTML={{ __html: renderedContent }} />

            {(prev || next) && (
              <nav className={styles.pager} aria-label="Pages">
                {prev ? (
                  <button type="button" className={styles.pagerLink} onClick={() => selectModule(prev.category, prev.page.id)}>
                    <span className={styles.pagerLabel}>← {t.prev}</span>
                    <span className={styles.pagerTitle}>{textOf(prev.page).name}</span>
                  </button>
                ) : <span />}
                {next && (
                  <button type="button" className={`${styles.pagerLink} ${styles.pagerNext}`} onClick={() => selectModule(next.category, next.page.id)}>
                    <span className={styles.pagerLabel}>{t.next} →</span>
                    <span className={styles.pagerTitle}>{textOf(next.page).name}</span>
                  </button>
                )}
              </nav>
            )}
          </article>
        ) : null}
      </main>
    </>
  )
}

export default function DocsClient({ docsData }: { docsData: DocsData }) {
  return (
    <div className={styles.page}>
      <SiteHeader />

      <div className={styles.background} />

      <div className={styles.docsContainer}>
        <Suspense fallback={
          <>
            <aside className={styles.sidebar}>
              <div className={styles.searchWrapper}>
                <input type="text" placeholder="Search docs..." className={styles.searchInput} disabled />
              </div>
            </aside>
            <main className={styles.contentArea}>
              <div className={styles.emptyState}>
                <p>Loading documentation...</p>
              </div>
            </main>
          </>
        }>
          <DocsContent docsData={docsData} />
        </Suspense>
      </div>

      <footer className={styles.footer}>
        <p>&copy; 2025 - 2026 TorioGhost External</p>
      </footer>
    </div>
  )
}
