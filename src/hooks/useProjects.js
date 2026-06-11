import { useEffect, useState } from 'react'
import { loadProjects, fallbackData } from '../data/cms'

/**
 * Loads the portfolio projects from the WordPress CMS (or the bundled fallback).
 *
 * Renders immediately with the fallback data so the page is never blank, then
 * swaps in live data once the fetch resolves.
 *
 * Returns { clientWork, products, loading, source }
 *   source: 'cms' | 'fallback'
 */
export default function useProjects() {
  const [state, setState] = useState({
    data: fallbackData,
    source: 'fallback',
    loading: true,
  })

  useEffect(() => {
    let active = true
    loadProjects().then((result) => {
      if (!active) return
      setState({ data: result.data, source: result.source, loading: false })
    })
    return () => {
      active = false
    }
  }, [])

  return {
    clientWork: state.data.clientWork,
    products: state.data.products,
    loading: state.loading,
    source: state.source,
  }
}
