import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ApplicationCard } from './components/ApplicationCard'
import { ApplicationForm } from './components/ApplicationForm'
import { supabase } from './lib/supabase'

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, interview: 0 })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setRecent(data.slice(0, 3))
        setStats({
          total: data.length,
          active: data.filter(a => ['applied', 'interview', 'offer'].includes(a.status)).length,
          interview: data.filter(a => a.status === 'interview').length
        })
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Chargement...</div>

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-end">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
           <p className="text-muted-foreground">Vue d'ensemble de vos candidatures.</p>
        </div>
        <Link to="/add" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
            + Nouvelle Candidature
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
             <div className="text-sm text-muted-foreground font-medium">Total Candidatures</div>
             <div className="text-3xl font-bold mt-2">{stats.total}</div>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
             <div className="text-sm text-muted-foreground font-medium">En cours</div>
             <div className="text-3xl font-bold mt-2 text-primary">{stats.active}</div>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
             <div className="text-sm text-muted-foreground font-medium">Entretiens</div>
             <div className="text-3xl font-bold mt-2 text-accent">{stats.interview}</div>
          </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Mises à jour récentes</h2>
        {recent.length === 0 ? (
            <p className="text-muted-foreground">Aucune candidature pour le moment.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map(app => (
                <ApplicationCard key={app.id} application={app} />
            ))}
            </div>
        )}
      </div>
    </div>
  )
}

function ApplicationList() {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchApplications()
    }, [])

    async function fetchApplications() {
        try {
            const { data, error } = await supabase
                .from('applications')
                .select('*')
                .order('date_applied', { ascending: false })
            
            if (error) throw error
            if (data) setApplications(data)
        } catch (error) {
            console.error('Error loading applications:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-8 text-center">Chargement...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes Candidatures</h1>
                    <p className="text-muted-foreground">Suivez l'avancement de toutes vos demandes.</p>
                </div>
                <Link to="/add" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
                    Ajouter
                </Link>
            </div>
            
            {applications.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <p className="text-lg text-muted-foreground mb-4">Vous n'avez pas encore ajouté de candidatures.</p>
                    <Link to="/add" className="text-primary font-medium hover:underline">Commençer maintenant</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {applications.map(app => (
                        <ApplicationCard key={app.id} application={app} />
                    ))}
                </div>
            )}
        </div>
    )
}

import { ApplicationDetail } from './components/ApplicationDetail'

// ... (existing imports)

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications" element={<ApplicationList />} />
          <Route path="/applications/:id" element={<ApplicationDetail />} />
          <Route path="/add" element={<ApplicationForm />} />
          <Route path="/edit/:id" element={<ApplicationForm />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
