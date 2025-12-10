import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Clock, Briefcase, Building2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { jobsApi, Job } from '@/lib/api';
import LoadingSpinner from '@/components/ui/loading-spinner';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      
      try {
        const response = await jobsApi.getById(id);
        setJob(response.data);
      } catch (err) {
        setError('Failed to load job details. Please try again later.');
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (error || !job) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error || 'Job not found'}</p>
          <Button asChild variant="outline">
            <Link to="/">Back to Jobs</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>

        <Card className="card-shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">{job.title}</h1>
                <div className="flex items-center gap-2 text-lg text-muted-foreground">
                  <Building2 className="h-5 w-5" />
                  {job.company}
                </div>
              </div>
              
              <Button asChild size="lg" className="shrink-0">
                <Link to={`/apply/${job.id}`}>Apply Now</Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
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
              {job.job_type && (
                <Badge variant="secondary">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {job.job_type}
                </Badge>
              )}
              {job.created_at && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="pt-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Job Description</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                {job.description}
              </div>
            </div>
            
            {job.requirements && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Requirements</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                  {job.requirements}
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <Button asChild size="lg" className="w-full md:w-auto">
                <Link to={`/apply/${job.id}`}>Apply for this Position</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default JobDetails;
