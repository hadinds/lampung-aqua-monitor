import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Map,
  Waves,
  DoorOpen,
  Activity,
  FileText,
  Settings,
  LogOut,
  Droplets,
  ChevronRight,
  MapPin,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Peta Irigasi', href: '/map', icon: Map },
  { title: 'Daerah Irigasi', href: '/areas', icon: MapPin },
  { title: 'Saluran', href: '/canals', icon: Waves },
  { title: 'Pintu Air', href: '/gates', icon: DoorOpen },
  { title: 'Monitoring', href: '/monitoring', icon: Activity },
  { title: 'Laporan', href: '/reports', icon: FileText },
  { title: 'Manajemen User', href: '/users', icon: Users, roles: ['admin'] },
  { title: 'Pengaturan', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 sidebar-gradient text-sidebar-foreground transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
            <div className="w-10 h-10 rounded-xl bg-sidebar-primary/20 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-sidebar-primary" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-sidebar-foreground">SIMONI</h1>
              <p className="text-xs text-sidebar-foreground/60">PSDA Wilayah 2</p>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.title}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User section */}
          <div className="p-4 border-t border-sidebar-border">
            {user && (
              <div className="flex items-center gap-3 px-2 py-2 mb-3">
                <div className="w-9 h-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sm font-medium text-sidebar-primary">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
