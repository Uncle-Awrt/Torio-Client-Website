'use client'

import { useEffect, useRef } from 'react'

// Slow looping background for the hero: small pink/white specks drifting upward and
// twinkling, wrapping back to the bottom when they leave the top.
export default function HeroParticles({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0, h = 0, dpr = 1
    type P = { x: number; y: number; r: number; vy: number; vx: number; a: number; tw: number; pink: boolean }
    let ps: P[] = []

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(110, (w * h) / 14000))
      ps = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.6,
        vy: 6 + Math.random() * 16,
        vx: (Math.random() - 0.5) * 4,
        a: 0.15 + Math.random() * 0.5,
        tw: Math.random() * Math.PI * 2,
        pink: Math.random() < 0.55,
      }))
    }

    let raf = 0
    let last = performance.now()
    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, w, h)
      for (const p of ps) {
        if (!still) {
          p.y -= p.vy * dt
          p.x += p.vx * dt
          p.tw += dt * 1.5
          if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w }
          if (p.x < -4) p.x = w + 4
          if (p.x > w + 4) p.x = -4
        }
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.pink ? `rgba(255, 92, 150, ${alpha})` : `rgba(255, 255, 255, ${alpha * 0.8})`
        ctx.fill()
      }
      if (!still) raf = requestAnimationFrame(draw)
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
