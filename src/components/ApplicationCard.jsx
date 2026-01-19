import { Calendar, Building, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from './StatusBadge'

export function ApplicationCard({ application }) {
  return (
    <Link 
      to={`/applications/${application.id}`}
      className="bg-card text-card-foreground rounded-xl border border-border shadow-sm hover:shadow-md transition-all p-4 flex flex-col gap-3 group relative block"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
            {application.position}
          </h3>
          <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
            <Building size={14} />
            <span className="text-sm">{application.company}</span>
          </div>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="mt-auto pt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{new Date(application.date_applied).toLocaleDateString()}</span>
            </div>
            {application.follow_up_date && (
                <div className="flex items-center gap-1.5 text-accent font-medium" title={`Relance : ${new Date(application.follow_up_date).toLocaleDateString()}`}>
                    <Calendar size={14} />
                    <span>Relance</span>
                </div>
            )}
        </div>
        {application.url && (
            <a 
              href={application.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Voir l'annonce</span>
              <ExternalLink size={12} />
            </a>
        )}
      </div>
    </Link>
  )
}
