import { useEffect } from 'react'

// Adds .is-visible to [data-reveal] elements as they enter the viewport.
// Also watches for [data-reveal] elements added later (e.g. async CMS content)
// so they still animate in.
export default function useReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'))
      return undefined
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    const observe = (root) => {
      if (root.matches?.('[data-reveal]')) io.observe(root)
      root.querySelectorAll?.('[data-reveal]').forEach((el) => io.observe(el))
    }

    observe(document.body)

    // Catch [data-reveal] nodes mounted after this hook runs (async data, route swaps).
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) observe(node)
        })
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}
