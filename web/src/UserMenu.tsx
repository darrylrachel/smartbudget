import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

const THEME_KEY = 'smartbudget-theme'
type Theme = 'light' | 'dark'
function initialTheme(): Theme {
  try { return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light' } catch { return 'light' }
}

export function UserMenu({ triggerRef, onSwitchWorkspace }: {
  triggerRef: RefObject<HTMLButtonElement | null>
  onSwitchWorkspace: () => void
}) {
  // Synthetic identity until the authenticated profile is available.
  const user = { name: 'Alex Morgan', initials: 'AM' }
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const container = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111a15' : '#174d38')
  }, [theme])
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => { if (!container.current?.contains(event.target as Node)) setOpen(false) }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus() } }
    const focusOutside = (event: FocusEvent) => { if (!container.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    document.addEventListener('focusin', focusOutside)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); document.removeEventListener('focusin', focusOutside) }
  }, [open, triggerRef])
  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    try { localStorage.setItem(THEME_KEY, next) } catch { /* The toggle still works when browser storage is unavailable. */ }
  }
  return <div className='user-menu' ref={container}>
    <button ref={triggerRef} className='button quiet user-menu-trigger' aria-expanded={open} aria-controls='user-options' aria-label={`${user.name}, account options`} onClick={() => setOpen(value => !value)}>
      <span className='user-avatar' aria-hidden='true'>{user.initials}</span><span>{user.name}</span><span className='user-chevron' aria-hidden='true'>⌄</span>
    </button>
    {open && <section className='user-options' id='user-options' aria-label='Account options'>
      <div className='user-profile'><strong>{user.name}</strong><span className='small'>Sample profile</span></div>
      <button className='user-option' onClick={() => { setOpen(false); onSwitchWorkspace() }}><span aria-hidden='true'>↔</span>Switch workspace</button>
      <div className='theme-option'><div><strong>Appearance</strong><span className='small'>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span></div><button className='theme-switch' role='switch' aria-label='Dark mode' aria-checked={theme === 'dark'} onClick={toggleTheme}><span className='theme-thumb' aria-hidden='true'>{theme === 'dark' ? '☾' : '☀'}</span></button></div>
    </section>}
  </div>
}
