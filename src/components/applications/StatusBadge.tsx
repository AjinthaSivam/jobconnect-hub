import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'new':
        return 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20';
      case 'reviewed':
        return 'bg-info/10 text-info border-info/20 hover:bg-info/20';
      case 'shortlisted':
        return 'bg-success/10 text-success border-success/20 hover:bg-success/20';
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn('font-medium', getStatusStyles(), className)}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;
