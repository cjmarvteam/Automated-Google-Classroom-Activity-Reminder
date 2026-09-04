import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchClassrooms, deleteClassroom } from '../services/api';
import { Classroom } from '../types';
import { CreateClassroomDialog } from '../components/classrooms/CreateClassroomDialog';
import { SectionReveal } from '@/components/ui/SectionReveal';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Users, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

export default function Classrooms() {
  const queryClient = useQueryClient();
  const { data: classrooms = [], isLoading } = useQuery({
    queryKey: ['classrooms'],
    queryFn: fetchClassrooms,
  });

  const [createOpen, setCreateOpen] = useState(false);

  const handleDelete = async (classroom: Classroom) => {
    if (!confirm(`Delete "${classroom.name}"? This will also delete all activities in this classroom.`)) return;
    try {
      await deleteClassroom(classroom.id);
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Classroom deleted');
    } catch {
      toast.error('Failed to delete classroom');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" style={{ background: 'rgba(44,36,30,0.06)' }} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" style={{ background: 'rgba(44,36,30,0.06)' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionReveal>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span className="label-sm" style={{ color: '#c4845a' }}>Classrooms</span>
            <h1 style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#2c241e' }}>My Classrooms</h1>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(44, 36, 30, 0.5)', maxWidth: '480px' }}>
              Organize your activities by classroom. Add a classroom to get started.
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/activities">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  borderRadius: '6px',
                  border: '1px solid rgba(44, 36, 30, 0.12)',
                  background: '#ffffff',
                  color: '#2c241e',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                <BookOpen style={{ width: '16px', height: '16px' }} />
                View Activities
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCreateOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '6px',
                border: 'none',
                background: '#c4845a',
                color: '#fdf7f2',
                cursor: 'pointer',
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Add Classroom
            </motion.button>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal delay={0.05}>
        {classrooms.length === 0 ? (
          <div style={{ background: '#ffffff', border: '1px solid rgba(44, 36, 30, 0.06)', borderRadius: '8px', padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(196, 132, 90, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <BookOpen style={{ width: '28px', height: '28px', color: '#c4845a' }} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2c241e', marginBottom: '0.5rem' }}>No classrooms yet</h2>
            <p style={{ fontSize: '0.9rem', color: 'rgba(44, 36, 30, 0.5)', maxWidth: '400px', margin: '0 auto', marginBottom: '1.5rem' }}>
              Create your first classroom to start organizing your activities and assignments.
            </p>
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCreateOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '6px',
                border: 'none',
                background: '#c4845a',
                color: '#fdf7f2',
                cursor: 'pointer',
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Create First Classroom
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classrooms.map((classroom, index) => (
              <motion.div
                key={classroom.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ y: -2 }}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(44, 36, 30, 0.06)',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                }}
                onClick={() => window.location.href = '/activities'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(196, 132, 90, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen style={{ width: '20px', height: '20px', color: '#c4845a' }} />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(classroom); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'rgba(44,36,30,0.3)', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#e74c3c'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(44,36,30,0.3)'}
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2c241e', marginBottom: '0.25rem' }}>{classroom.name}</h3>
                {classroom.section && (
                  <p style={{ fontSize: '0.85rem', color: 'rgba(44, 36, 30, 0.5)', marginBottom: '0.5rem' }}>{classroom.section}</p>
                )}
                {classroom.description && (
                  <p style={{ fontSize: '0.8rem', color: 'rgba(44, 36, 30, 0.4)', marginBottom: '1rem', lineHeight: 1.5 }}>{classroom.description}</p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(44, 36, 30, 0.04)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'rgba(44, 36, 30, 0.4)' }}>
                    <Users style={{ width: '14px', height: '14px' }} />
                    <span>{(classroom as any)._count?.activities || 0} activities</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: 'rgba(44, 36, 30, 0.3)' }}>
                    View <ArrowRight style={{ width: '12px', height: '12px' }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </SectionReveal>

      <CreateClassroomDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={() => queryClient.invalidateQueries({ queryKey: ['classrooms'] })} />
    </div>
  );
}
