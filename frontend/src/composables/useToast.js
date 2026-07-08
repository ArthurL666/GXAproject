/**
 * Toast 通知 Composable
 */
export function useToast() {
  function show(message, type = 'info') {
    const el = document.createElement('div')
    el.className = `toast ${type}`
    el.textContent = message
    document.body.appendChild(el)
    setTimeout(() => {
      el.style.opacity = '0'
      el.style.transition = 'opacity 0.3s'
      setTimeout(() => el.remove(), 300)
    }, 2500)
  }

  return { show, success: (m) => show(m, 'success'), error: (m) => show(m, 'error'), info: (m) => show(m, 'info') }
}
