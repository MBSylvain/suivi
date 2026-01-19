import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Building, Globe, FileText, Clock, Trash2, Pencil } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { StatusBadge } from './StatusBadge'

export function ApplicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchApplication() {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setApplication(data)
      } catch (error) {
        console.error('Error fetching application:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchApplication()
    }
  }, [id])

  const handleDelete = async () => {
    if (window.confirm('Voulez-vous vraiment supprimer cette candidature ?')) {
        try {
            const { error } = await supabase
                .from('applications')
                .delete()
                .eq('id', id)
            
            if (error) throw error
            navigate('/applications')
        } catch (error) {
            console.error('Error deleting:', error)
            alert('Erreur lors de la suppression')
        }
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Chargement des détails...</div>

  if (!application) return (
    <div className="text-center py-12">
        <p className="text-xl font-semibold mb-4">Candidature introuvable</p>
        <Link to="/applications" className="text-primary hover:underline">Retour à la liste</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Link to="/applications" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} />
            Retour aux candidatures
        </Link>
        <div className="flex gap-2">
            <Link 
                to={`/edit/${application.id}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
            >
                <Pencil size={14} />
                Modifier
            </Link>
            <button 
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 rounded-md transition-colors"
            >
                <Trash2 size={14} />
                Supprimer
            </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">{application.position}</h1>
                <div className="flex items-center gap-2 text-lg text-muted-foreground">
                    <Building size={20} />
                    <span className="font-medium">{application.company}</span>
                </div>
            </div>
            <StatusBadge status={application.status} className="text-sm px-3 py-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-y border-border/50 py-6">
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <Calendar className="text-muted-foreground mt-0.5" size={18} />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Date de candidature</p>
                        <p>{new Date(application.date_applied).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Clock className="text-muted-foreground mt-0.5" size={18} />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Ajouté le</p>
                        <p>{new Date(application.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                {application.follow_up_date && (
                    <div className="flex items-start gap-3 pt-2">
                        <div className="bg-accent/20 p-1.5 rounded-full text-accent mt-0.5">
                           <Calendar size={14} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-accent">À relancer le</p>
                            <p className="font-semibold">{new Date(application.follow_up_date).toLocaleDateString()}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <Globe className="text-muted-foreground mt-0.5" size={18} />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Lien de l'offre</p>
                        {application.url ? (
                            <a 
                                href={application.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline break-all"
                            >
                                {application.url}
                            </a>
                        ) : (
                            <span className="text-muted-foreground italic">Non spécifié</span>
                        )}
                    </div>
                </div>

                <div className="space-y-2 pt-2">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <FileText size={16} />
                        Documents
                    </p>
                    <div className="flex flex-col gap-2">
                        {application.cv_url ? (
                            <a 
                                href={application.cv_url}
                                target="_blank"
                                rel="noopener noreferrer" 
                                className="text-sm inline-flex items-center gap-2 text-primary hover:underline"
                            >
                                📄 Voir le CV
                            </a>
                        ) : (
                            <span className="text-sm text-muted-foreground italic pl-6">Aucun CV</span>
                        )}
                        
                        {application.cover_letter_url ? (
                            <a 
                                href={application.cover_letter_url}
                                target="_blank"
                                rel="noopener noreferrer" 
                                className="text-sm inline-flex items-center gap-2 text-primary hover:underline"
                            >
                                📝 Voir la lettre de motivation
                            </a>
                        ) : (
                            <span className="text-sm text-muted-foreground italic pl-6">Aucune lettre</span>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
                <FileText size={20} />
                <h2>Notes</h2>
            </div>
            <div className="bg-secondary/10 rounded-lg p-4 min-h-[100px] whitespace-pre-wrap text-sm leading-relaxed">
                {application.notes || <span className="text-muted-foreground italic">Aucune note pour cette candidature.</span>}
            </div>
        </div>
      </div>
    </div>
  )
}
