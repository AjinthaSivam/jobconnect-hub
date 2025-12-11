import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Job, isAuthenticated } from '@/lib/api';

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const authenticated = isAuthenticated();

  return (
    <Card className="group card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in border-border/50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p className="text-muted-foreground font-medium">{job.company}</p>
          </div>
          {job.job_type && (
            <Badge variant="secondary" className="shrink-0">
              {job.job_type}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {job.location}
          </div>
          {job.salary && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {job.salary}
            </div>
          )}
          {job.created_at && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {new Date(job.created_at).toLocaleDateString()}
            </div>
          )}
        </div>
        
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {job.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 gap-2">
        <Button asChild variant="default" className="flex-1">
          <Link to={`/jobs/${job.id}`}>View Details</Link>
        </Button>
        {!authenticated && (
          <Button asChild variant="outline">
            <Link to={`/apply/${job.id}`}>Apply Now</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
