import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Job, JobCreateData } from '@/lib/api';

const jobSchema = z.object({
  title: z.string().trim().min(1, 'Job title is required').max(200, 'Title must be less than 200 characters'),
  company: z.string().trim().min(1, 'Company name is required').max(200, 'Company must be less than 200 characters'),
  location: z.string().trim().min(1, 'Location is required').max(200, 'Location must be less than 200 characters'),
  description: z.string().trim().min(1, 'Description is required').max(5000, 'Description must be less than 5000 characters'),
  requirements: z.string().max(5000, 'Requirements must be less than 5000 characters').optional(),
  salary: z.string().max(100, 'Salary must be less than 100 characters').optional(),
  job_type: z.string().max(50, 'Job type must be less than 50 characters').optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobFormProps {
  job?: Job;
  onSubmit: (data: JobCreateData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const JobForm = ({ job, onSubmit, onCancel, isLoading }: JobFormProps) => {
  const [jobType, setJobType] = useState(job?.job_type || '');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: job?.title || '',
      company: job?.company || '',
      location: job?.location || '',
      description: job?.description || '',
      requirements: job?.requirements || '',
      salary: job?.salary || '',
      job_type: job?.job_type || '',
    },
  });

  useEffect(() => {
    if (jobType) {
      setValue('job_type', jobType);
    }
  }, [jobType, setValue]);

  const onFormSubmit = async (data: JobFormData) => {
    await onSubmit({
      title: data.title,
      company: data.company,
      location: data.location,
      description: data.description,
      requirements: data.requirements || undefined,
      salary: data.salary || undefined,
      job_type: data.job_type || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="e.g. Senior Software Engineer"
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            {...register('company')}
            placeholder="e.g. Tech Corp"
          />
          {errors.company && (
            <p className="text-sm text-destructive">{errors.company.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            {...register('location')}
            placeholder="e.g. New York, NY"
          />
          {errors.location && (
            <p className="text-sm text-destructive">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary">Salary</Label>
          <Input
            id="salary"
            {...register('salary')}
            placeholder="e.g. $80,000 - $120,000"
          />
          {errors.salary && (
            <p className="text-sm text-destructive">{errors.salary.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="job_type">Job Type</Label>
        <Select value={jobType} onValueChange={setJobType}>
          <SelectTrigger>
            <SelectValue placeholder="Select job type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
            <SelectItem value="Internship">Internship</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe the job role and responsibilities..."
          rows={5}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          {...register('requirements')}
          placeholder="List the skills and qualifications required..."
          rows={4}
        />
        {errors.requirements && (
          <p className="text-sm text-destructive">{errors.requirements.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
