import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      <main className="flex-1 container py-8">
        {children}
      </main>
      <footer className="border-t border-border bg-background py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} JobBoard. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
