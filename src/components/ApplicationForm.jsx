import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function ApplicationForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'applied',
    date_applied: new Date().toISOString().split('T')[0],
    follow_up_date: '',
    url: '',
    notes: ''
  })

  useEffect(() => {
    if (isEditing) {
        fetchApplication()
    }
  }, [id])

  async function fetchApplication() {
      try {
        const { data, error } = await supabase
            .from('applications')
            .select('*')
            .eq('id', id)
            .single()
        
        if (error) throw error
        if (data) {
            setFormData({
                company: data.company,
                position: data.position,
                status: data.status,
                date_applied: data.date_applied,
                follow_up_date: data.follow_up_date || '',
                url: data.url || '',
                notes: data.notes || ''
            })
        }
      } catch (error) {
          console.error('Error fetching application:', error)
      }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditing) {
        const { error } = await supabase
            .from('applications')
            .update(formData)
            .eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase
            .from('applications')
            .insert([formData])
        if (error) throw error
      }

      navigate(isEditing ? `/applications/${id}` : '/applications')
    } catch (error) {
      console.error('Error saving application:', error)
      alert('Erreur lors de l\'enregistrement')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-2">{isEditing ? 'Modifier la Candidature' : 'Nouvelle Candidature'}</h1>
      <p className="text-muted-foreground mb-8">{isEditing ? 'Mettre à jour les informations.' : 'Ajouter un nouveau poste à suivre.'}</p>


      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="company">
              Entreprise *
            </label>
            <input
              required
              type="text"
              name="company"
              id="company"
              value={formData.company}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Ex: Google"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="position">
              Poste *
            </label>
            <input
              required
              type="text"
              name="position"
              id="position"
              value={formData.position}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Ex: Frontend Dev"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="status">
              Statut
            </label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="applied">Postulé</option>
              <option value="interview">Entretien</option>
              <option value="offer">Offre</option>
              <option value="rejected">Refusé</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="date_applied">
              Date de candidature
            </label>
            <input
              type="date"
              name="date_applied"
              id="date_applied"
              value={formData.date_applied}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="follow_up_date">
              Date de relance
            </label>
            <input
              type="date"
              name="follow_up_date"
              id="follow_up_date"
              value={formData.follow_up_date || ''}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="url">
              Lien de l'offre
            </label>
            <input
              type="url"
              name="url"
              id="url"
              value={formData.url}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="https://..."
            />
        </div>

         <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="notes">
              Notes
            </label>
            <textarea
              name="notes"
              id="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Détails importants, questions à poser..."
            />
        </div>

        <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
                {loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Ajouter la candidature')}
            </button>
        </div>
      </form>
    </div>
  )
}
