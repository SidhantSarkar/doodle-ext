import Vec from '@tldraw/vec'

/**
 * Normalizes the delta w.r.t to the window height and zoom level
 */
export const normalizeDelta = (delta: number[], zoom: number): number[] => {
  // Get the delta (taking into consideration the zoom level)
  const normalizedDelta = Vec.div(delta, zoom)

  // Normalize delta value for vertical panning (y-axis)
  if (normalizedDelta[1] > 0) {
    // Get the maximum height that can be scrolled downwards
    const maxScrollYDelta = Math.floor(getScrollHeight() - window.innerHeight - window.scrollY)
    normalizedDelta[1] = Math.min(normalizedDelta[1], maxScrollYDelta)
  } else {
    // Get the maximum height that can be scrolled upwards
    const maxScrollYDelta = -1 * window.scrollY
    normalizedDelta[1] = Math.max(normalizedDelta[1], maxScrollYDelta)
  }

  // Normalize delta value for horizontal panning (x-axis)
  if (normalizedDelta[0] > 0) {
    // Get the maximum width that can be scrolled rightwards
    const maxScrollXDelta = Math.floor(getScrollWidth() - window.innerWidth - window.scrollX)
    normalizedDelta[0] = Math.min(normalizedDelta[0], maxScrollXDelta)
  } else {
    // Get the maximum width that can be scrolled leftwards
    const maxScrollXDelta = -1 * window.scrollX
    normalizedDelta[0] = Math.max(normalizedDelta[0], maxScrollXDelta)
  }
  return normalizedDelta
}

/**
 * @returns (scroll) height of the document
 */
const getScrollHeight = (): number => {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  )
}

/**
 * @returns (scroll) width of the document
 */
const getScrollWidth = (): number => {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.body.clientWidth,
    document.documentElement.clientWidth
  )
}