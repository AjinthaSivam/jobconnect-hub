import { Link } from 'react-router-dom';
import { Mail, FileText, Calendar, ExternalLink, Phone, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Application, applicationsApi } from '@/lib/api';
import StatusBadge from './StatusBadge';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ApplicationCardProps {
  application: Application;
  onDelete?: (id: number) => void;
}

const ApplicationCard = ({ application, onDelete }: ApplicationCardProps) => {
  const handleDelete = async () => {
    try {
      await applicationsApi.delete(application.id);
      toast({
        title: 'Application Deleted',
        description: 'The application has been successfully deleted.',
      });
      onDelete?.(application.id);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to delete application.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-foreground">
              {application.full_name}
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

        {application.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <a href={`tel:${application.phone}`} className="hover:text-primary transition-colors">
              {application.phone}
            </a>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <a 
            href={application.resume} 
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
      
      <CardFooter className="pt-0 gap-2">
        <Button asChild variant="default" className="flex-1">
          <Link to={`/applications/${application.id}`}>View Details</Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Application</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this application from {application.full_name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
