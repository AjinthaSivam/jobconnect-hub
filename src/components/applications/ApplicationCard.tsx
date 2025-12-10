import { Link } from 'react-router-dom';
import { Mail, FileText, Calendar, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Application } from '@/lib/api';
import StatusBadge from './StatusBadge';

interface ApplicationCardProps {
  application: Application;
}

const ApplicationCard = ({ application }: ApplicationCardProps) => {
  return (
    <Card className="card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-foreground">
              {application.name}
            </h3>
            {application.job && (
              <p className="text-sm text-muted-foreground">
                Applied for: <span className="font-medium text-foreground">{application.job.title}</span>
              </p>
            )}
          </div>
          <StatusBadge status={application.status} />
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <a href={`mailto:${application.email}`} className="hover:text-primary transition-colors">
            {application.email}
          </a>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <a 
            href={application.resume_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            View Resume
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        
        {application.created_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(application.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button asChild variant="default" className="w-full">
          <Link to={`/applications/${application.id}`}>Update Status</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
