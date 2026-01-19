import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, List, Sun, Moon, Palette, Briefcase } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Layout({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const location = useLocation()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const themes = ['light', 'dark', 'emerald', 'rose']

  const navItems = [
    { path: '/', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/applications', label: 'Candidatures', icon: List },
    { path: '/add', label: 'Ajouter', icon: PlusCircle },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      <nav className="border-b border-border sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl hover:opacity-80 transition-opacity">
            <Briefcase className="h-6 w-6" />
            <span className="hidden sm:inline">SuiviJob</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex bg-secondary/10 p-1 rounded-full overflow-hidden">
               {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`p-2 rounded-full transition-all ${
                      location.pathname === item.path 
                      ? 'bg-background text-primary shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/20'
                    }`}
                    title={item.label}
                  >
                    <item.icon size={20} />
                  </Link>
               ))}
            </div>

            <div className="hidden sm:flex gap-1 p-1 bg-secondary/10 rounded-full">
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    theme === t ? 'scale-110 shadow-lg ring-2 ring-primary/20' : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                  style={{
                      backgroundColor: 
                        t === 'light' ? '#fff' : 
                        t === 'dark' ? '#0f172a' : 
                        t === 'emerald' ? '#10b981' : '#f43f5e',
                      color: t === 'light' ? '#000' : '#fff'
                  }}
                  title={`Thème ${t}`}
                >
                   {t === 'light' && <Sun size={12} />}
                   {t === 'dark' && <Moon size={12} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto p-4 sm:p-6 fade-in">
        {children}
      </main>
    </div>
  )
}
