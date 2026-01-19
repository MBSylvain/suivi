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

import { Search, Filter, ArrowUpDown } from 'lucide-react'

function ApplicationList() {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('date_applied')
    const [sortOrder, setSortOrder] = useState('desc')

    useEffect(() => {
        fetchApplications()
    }, [])

    async function fetchApplications() {
        try {
            const { data, error } = await supabase
                .from('applications')
                .select('*')
            
            if (error) throw error
            if (data) setApplications(data)
        } catch (error) {
            console.error('Error loading applications:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredApplications = applications
        .filter(app => {
            const matchesStatus = filterStatus === 'all' || app.status === filterStatus
            const matchesSearch = app.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  app.position.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesStatus && matchesSearch
        })
        .sort((a, b) => {
            const dateA = new Date(a[sortBy] || 0)
            const dateB = new Date(b[sortBy] || 0)
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
        })

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(field)
            setSortOrder('desc')
        }
    }

    if (loading) return <div className="p-8 text-center">Chargement...</div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes Candidatures</h1>
                    <p className="text-muted-foreground">Suivez l'avancement de toutes vos demandes.</p>
                </div>
                <Link to="/add" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
                    Ajouter
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                        type="text" 
                        placeholder="Rechercher une entreprise, un poste..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="pl-9 pr-8 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="applied">Postulé</option>
                            <option value="interview">Entretien</option>
                            <option value="offer">Offre</option>
                            <option value="rejected">Refusé</option>
                        </select>
                    </div>
                    <button 
                        onClick={() => toggleSort('date_applied')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-input transition-colors ${sortBy === 'date_applied' ? 'bg-secondary/20 border-primary/50 text-primary' : 'bg-background hover:bg-secondary/10'}`}
                        title="Trier par date"
                    >
                        <ArrowUpDown size={16} />
                        <span className="hidden sm:inline">Date</span>
                    </button>
                </div>
            </div>
            
            {filteredApplications.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <p className="text-lg text-muted-foreground mb-4">Aucune candidature trouvée.</p>
                    {applications.length === 0 && (
                        <Link to="/add" className="text-primary font-medium hover:underline">Commençer maintenant</Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredApplications.map(app => (
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
