import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { label: 'Home', path: '/', icon: '⌂' },
  { label: 'Trending', path: '/trending', icon: '↗' },
  { label: 'Exam Prep', path: '/exam-prep', icon: '▣' },
  { label: 'Personalized', path: '/personalized', icon: '◎' },
  { label: 'Analytics', path: '/analytics', icon: '◫' },
]

function NavLink({ item, active, mobile = false }) {
  return (
    <Link
      to={item.path}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200 ${
        active
          ? 'translate-x-1 bg-panelHi text-accent shadow-[0_0_15px_rgba(192,193,255,0.1)]'
          : mobile
            ? 'text-copy/60'
            : 'text-copy/60 hover:bg-card hover:text-copy'
      }`}
    >
      <span className={`${mobile ? 'text-sm' : 'text-base'} leading-none`}>{item.icon}</span>
      <span className="font-medium">{item.label}</span>
    </Link>
  )
}

export default function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-surface text-copy font-body">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-copy/10 bg-surface md:flex">
          <div className="flex w-full flex-col gap-2 p-4">
            <div className="mb-6 px-2 py-4">
              <p className="font-headline text-2xl text-accent">The Archive</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted">Level 12 Curator</p>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <NavLink key={item.path} item={item} active={location.pathname === item.path} />
              ))}
            </nav>

            <div className="mt-auto border-t border-copy/5 pt-4">
              <button className="mb-4 w-full rounded-md bg-gradient-to-r from-accent to-highlight px-4 py-3 text-sm font-bold text-[#0d0096] shadow-lg shadow-accent/10 transition-transform active:scale-95">
                Start Daily Quiz
              </button>
              <div className="space-y-1">
                <a className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-copy/60 transition-colors hover:bg-card hover:text-copy" href="#">
                  Settings
                </a>
                <a className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-copy/60 transition-colors hover:bg-card hover:text-copy" href="#">
                  Support
                </a>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-50 flex items-center justify-between border-b border-copy/5 bg-surface/90 px-4 py-3 shadow-[0_4px_24px_-4px_rgba(218,226,253,0.06)] backdrop-blur-xl sm:px-6">
            <div className="flex items-center gap-6">
              <span className="font-headline text-3xl italic tracking-tight text-copy">NewsFusion</span>
              <div className="hidden items-center rounded-full border border-line/60 bg-card px-4 py-2 lg:flex">
                <input
                  className="w-64 border-none bg-transparent p-0 text-sm outline-none"
                  placeholder="Search the archive..."
                  type="text"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 rounded-full bg-card px-4 py-2 text-sm text-accent md:flex">
                <span className="font-bold">12 Day Streak</span>
              </div>
              <button className="rounded-md px-4 py-2 text-sm font-medium text-copy/70 transition-colors hover:bg-panelHi hover:text-copy">
                Login
              </button>
            </div>
          </header>

          <motion.main
            className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            {children}
          </motion.main>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-copy/10 bg-card/95 px-2 py-2 backdrop-blur md:hidden">
        {navItems.map((item) => (
          <NavLink key={item.path} item={item} active={location.pathname === item.path} mobile />
        ))}
      </nav>
    </div>
  )
}
