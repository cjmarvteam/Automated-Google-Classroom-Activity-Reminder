import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, LogOut, Sparkles, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { logoutApi } from '../../services/api';

export function UserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Continue logout even if API call fails
    }
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar
          style={{
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            transition: 'outline 0.2s ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.outline = '2px solid rgba(196, 132, 90, 0.3)')
          }
          onMouseLeave={(e) => (e.currentTarget.style.outline = 'none')}
        >
          <AvatarImage src={user?.avatar || ''} />
          <AvatarFallback
            style={{
              background: '#c4845a',
              color: '#fdf7f2',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" style={{ width: '200px' }}>
        <DropdownMenuLabel style={{ fontWeight: 'normal' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#2c241e' }}>
              {user?.name || 'User'}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'rgba(44, 36, 30, 0.5)' }}>
              {user?.email || ''}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate('/classrooms')}
          style={{ gap: '0.5rem', cursor: 'pointer' }}
        >
          <BookOpen style={{ width: '16px', height: '16px' }} />
          <span>My Classrooms</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate('/settings')}
          style={{ gap: '0.5rem', cursor: 'pointer' }}
        >
          <Settings style={{ width: '16px', height: '16px' }} />
          <span>Study Preferences</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate('/settings')}
          style={{ gap: '0.5rem', cursor: 'pointer' }}
        >
          <Sparkles style={{ width: '16px', height: '16px' }} />
          <span>Focus Techniques</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          style={{ gap: '0.5rem', color: '#c0392b', cursor: 'pointer' }}
        >
          <LogOut style={{ width: '16px', height: '16px' }} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
