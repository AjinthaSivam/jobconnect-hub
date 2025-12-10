import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isAuthenticated, logout } from '@/lib/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl text-foreground hover:text-primary transition-colors">
          <Briefcase className="h-6 w-6 text-primary" />
          <span>JobBoard</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Jobs
          </Link>

          {authenticated ? (
            <>
              <Link 
                to="/dashboard"
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link to="/login">Recruiter Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
