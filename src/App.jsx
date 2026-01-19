import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sun, Moon, Palette } from 'lucide-react'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold text-primary mb-4">Suivi de Candidatures</h1>
      <p className="text-lg text-secondary max-w-md">
        Organisez votre recherche d'emploi avec style et efficacité.
      </p>
      <div className="mt-8 flex gap-4">
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
          Commencer
        </button>
        <button className="px-6 py-2 border border-secondary text-foreground rounded-lg font-medium hover:bg-secondary/10 transition-colors">
          En savoir plus
        </button>
      </div>
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const themes = ['light', 'dark', 'emerald', 'rose']

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <nav className="border-b border-secondary/20 px-6 py-4 flex justify-between items-center bg-background/50 backdrop-blur-md sticky top-0">
          <div className="text-xl font-bold text-primary flex items-center gap-2">
            <Palette size={24} />
            SuiviJob
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2 p-1 bg-secondary/10 rounded-full">
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${theme === t ? 'bg-primary text-primary-foreground scale-110 shadow-lg' : 'hover:bg-secondary/20'
                    }`}
                  title={`Thème ${t}`}
                >
                  {t === 'light' && <Sun size={14} />}
                  {t === 'dark' && <Moon size={14} />}
                  {t === 'emerald' && <div className="w-3 h-3 bg-emerald-500 rounded-full" />}
                  {t === 'rose' && <div className="w-3 h-3 bg-rose-500 rounded-full" />}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
