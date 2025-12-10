import { useState, useEffect } from 'react';
import { Search, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { jobsApi, Job } from '@/lib/api';
import JobCard from './JobCard';
import LoadingSpinner from '@/components/ui/loading-spinner';

const JobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobsApi.getAll();
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (err) {
        setError('Failed to load jobs. Please try again later.');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            Open Positions
            <span className="ml-2 text-muted-foreground font-normal text-lg">
              ({filteredJobs.length})
            </span>
          </h1>
        </div>
        
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search jobs, companies, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No jobs found matching your search.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
