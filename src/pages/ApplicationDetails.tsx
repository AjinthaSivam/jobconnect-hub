import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, FileText, Calendar, ExternalLink, Save, Building2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { applicationsApi, Application, isAuthenticated } from '@/lib/api';
import StatusBadge from '@/components/applications/StatusBadge';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { toast } from '@/hooks/use-toast';

const ApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchApplication = async () => {
      if (!id) return;
      
      try {
        const response = await applicationsApi.getAll();
        const app = response.data.find((a) => a.id === parseInt(id, 10));
        
        if (app) {
          setApplication(app);
          setNewStatus(app.status);
        } else {
          setError('Application not found.');
        }
      } catch (err) {
        setError('Failed to load application details.');
        console.error('Error fetching application:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, navigate]);

  const handleStatusUpdate = async () => {
    if (!application || newStatus === application.status) return;
    
    setUpdating(true);
    
    try {
      await applicationsApi.updateStatus(application.id, newStatus);
      
      setApplication((prev) => prev ? { ...prev, status: newStatus as Application['status'] } : null);
      
      toast({
        title: 'Status Updated',
        description: `Application status changed to ${newStatus}.`,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (error || !application) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error || 'Application not found'}</p>
          <Button asChild variant="outline">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Card className="card-shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{application.full_name}</CardTitle>
                {application.job && (
                  <p className="text-muted-foreground mt-1 flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    Applied for: {application.job.title}
                  </p>
                )}
              </div>
              <StatusBadge status={application.status} />
            </div>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a 
                    href={`mailto:${application.email}`}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {application.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Resume</p>
                  <a 
                    href={application.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    View Resume
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
              
              {application.created_at && (
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Applied On</p>
                    <p className="font-medium text-foreground">
                      {new Date(application.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Update Status</Label>
              
              <div className="flex gap-3">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={handleStatusUpdate}
                  disabled={updating || newStatus === application.status}
                >
                  {updating ? (
                    'Updating...'
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ApplicationDetails;
