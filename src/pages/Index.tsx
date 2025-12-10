import Layout from '@/components/layout/Layout';
import JobList from '@/components/jobs/JobList';

const Index = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Find Your Dream Job
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse through our latest job openings and take the next step in your career journey.
          </p>
        </div>
        <JobList />
      </div>
    </Layout>
  );
};

export default Index;
