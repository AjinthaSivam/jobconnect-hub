import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Search, Filter } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { applicationsApi, Application, isAuthenticated } from '@/lib/api';
import ApplicationCard from '@/components/applications/ApplicationCard';
import LoadingSpinner from '@/components/ui/loading-spinner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await applicationsApi.getAll();
        setApplications(response.data);
        setFilteredApplications(response.data);
      } catch (err) {
        setError('Failed to load applications. Please try again later.');
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  useEffect(() => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [searchTerm, statusFilter, applications]);

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      </Layout>
    );
  }

  const statusCounts = {
    all: applications.length,
    Pending: applications.filter((a) => a.status === 'Pending').length,
    Reviewed: applications.filter((a) => a.status === 'Reviewed').length,
    Shortlisted: applications.filter((a) => a.status === 'Shortlisted').length,
    Rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            Recruiter Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`p-4 rounded-lg border transition-all ${
                statusFilter === status
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm capitalize">{status === 'all' ? 'Total' : status}</p>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, email, or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Reviewed">Reviewed</SelectItem>
              <SelectItem value="Shortlisted">Shortlisted</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No applications found.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredApplications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
