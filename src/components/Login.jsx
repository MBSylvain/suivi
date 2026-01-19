import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Palette, Mail, Lock, Loader2 } from 'lucide-react'

export function Login() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        // Inscription
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage('Inscription réussie ! Vérifiez vos emails pour confirmer (si nécessaire).')
      } else {
        // Connexion
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        // La redirection sera gérée automatiquement par App.jsx via le changement de session
      }
    } catch (error) {
      setMessage(error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border border-border shadow-lg">
        <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <Palette size={24} />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">SuiviJob</h2>
            <p className="text-muted-foreground mt-2">
                {isSignUp ? 'Créez votre compte' : 'Connectez-vous pour voir vos candidatures'}
            </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                        id="email"
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="vous@exemple.com"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">Mot de passe</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                        id="password"
                        type="password" 
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            {message && (
                <div className={`p-3 rounded-lg text-sm ${message.includes('réussie') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
                {loading && <Loader2 className="animate-spin" size={18} />}
                {isSignUp ? "S'inscrire" : "Se connecter"}
            </button>
        </form>

        <div className="text-center text-sm">
            <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline"
            >
                {isSignUp ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
            </button>
        </div>
      </div>
    </div>
  )
}
