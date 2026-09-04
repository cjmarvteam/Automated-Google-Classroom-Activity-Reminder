import { Link } from 'react-router-dom';
import { ArrowRight, Bell, BookOpen, Calendar, CheckCircle, Sparkles } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ background: '#f5f0eb' }}>
      <section style={{ padding: '80px 0', minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
        <div className="container-editorial">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="lg:grid-cols-2 max-lg:grid-cols-1">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ width: '32px', height: '1px', background: '#c4845a' }} />
                <span className="label-sm" style={{ color: '#c4845a' }}>Automated Google Classroom Activity Reminder</span>
              </div>
              <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: 600, lineHeight: 1.04, letterSpacing: '-0.035em', color: '#2c241e' }}>
                Never Miss<br />a <span style={{ color: '#c4845a' }}>Classroom</span><br />Activity.
              </h1>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'rgba(44, 36, 30, 0.5)', maxWidth: '520px' }}>
                Automatically track your Google Classroom activities and get reminded before deadlines. Stay on top of your academic tasks with effortless precision.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <Link to="/register">
                  <button style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', height: '52px', padding: '0 2rem', fontSize: '0.95rem', fontWeight: 500, borderRadius: '6px', border: '1px solid transparent', background: '#c4845a', color: '#fdf7f2', cursor: 'pointer', transition: 'background 0.2s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#a86d47'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#c4845a'}>
                    Get Started <ArrowRight style={{ width: '16px', height: '16px' }} />
                  </button>
                </Link>
                <Link to="/login">
                  <button style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', height: '52px', padding: '0 2rem', fontSize: '0.95rem', fontWeight: 500, borderRadius: '6px', border: '1px solid rgba(44, 36, 30, 0.08)', background: 'transparent', color: '#2c241e', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2c241e'; e.currentTarget.style.background = 'rgba(44, 36, 30, 0.02)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(44, 36, 30, 0.08)'; e.currentTarget.style.background = 'transparent'; }}>
                    Sign In
                  </button>
                </Link>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', paddingTop: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2c241e' }}>500+</span>
                  <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(44, 36, 30, 0.4)' }}>Students</span>
                </div>
                <div style={{ width: '1px', height: '24px', background: 'rgba(44, 36, 30, 0.08)' }} />
                <div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2c241e' }}>1,000+</span>
                  <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(44, 36, 30, 0.4)' }}>Reminders Sent</span>
                </div>
                <div style={{ width: '1px', height: '24px', background: 'rgba(44, 36, 30, 0.08)' }} />
                <div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2c241e' }}>98%</span>
                  <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(44, 36, 30, 0.4)' }}>On-Time</span>
                </div>
              </div>
            </div>
            <div style={{ position: 'relative' }} className="max-lg:hidden">
              <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(196, 132, 90, 0.05)', filter: 'blur(60px)' }} />
              <div style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(44, 36, 30, 0.08)', borderRadius: '8px', padding: '2rem', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c0392b' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d4a77a' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27ae60' }} />
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(44, 36, 30, 0.4)' }}>Upcoming Activities</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { title: 'Calculus: Derivatives', subject: 'Mathematics', due: 'Due Tomorrow', color: '#c4845a' },
                    { title: 'Physics Lab Report', subject: 'Physics', due: 'Due in 3 days', color: '#d4a77a' },
                    { title: 'Programming Project', subject: 'Computer Science', due: 'Due in 5 days', color: 'rgba(44,36,30,0.3)' },
                    { title: 'Database Normalization', subject: 'Database Management', due: 'Due in 7 days', color: 'rgba(44,36,30,0.2)' },
                  ].map((item) => (
                    <div key={item.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '6px', transition: 'all 0.2s ease', border: '1px solid transparent' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(44, 36, 30, 0.02)'; e.currentTarget.style.borderColor = 'rgba(44, 36, 30, 0.08)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color }} />
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#2c241e' }}>{item.title}</div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(44, 36, 30, 0.4)' }}>{item.subject}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(44, 36, 30, 0.4)' }}>{item.due}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(44, 36, 30, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(44, 36, 30, 0.3)' }}>Syncs with Google Classroom</span>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(44, 36, 30, 0.2)' }}>&#10024; Auto-reminders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '140px 0', background: '#ffffff' }}>
        <div className="container-editorial">
          <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 4rem' }}>
            <span className="label-sm" style={{ color: '#c4845a' }}>Features</span>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#2c241e', marginTop: '0.75rem' }}>
              Everything You Need<br />to Stay Ahead
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'rgba(44, 36, 30, 0.5)', maxWidth: '480px', margin: '0.75rem auto 0' }}>
              Designed to help you manage your classroom activities effortlessly.
            </p>
          </div>
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {[
              { icon: Bell, title: 'Smart Reminders', desc: 'Get notified before deadlines with intelligent timing.' },
              { icon: BookOpen, title: 'Activity Tracking', desc: 'See all your assignments in one organized view.' },
              { icon: Calendar, title: 'Calendar View', desc: 'Visualize your deadlines in a beautiful calendar.' },
              { icon: CheckCircle, title: 'Progress Tracking', desc: 'Track completed activities and stay motivated.' },
              { icon: Sparkles, title: 'Google Classroom Sync', desc: 'Automatically sync with your Google Classroom.' },
            ].map((feature) => (
              <div key={feature.title} style={{ background: '#ffffff', border: '1px solid rgba(44, 36, 30, 0.08)', borderRadius: '8px', padding: '1.5rem', transition: 'border-color 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(196, 132, 90, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(44, 36, 30, 0.08)'}>
                <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: 'rgba(196, 132, 90, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <feature.icon style={{ width: '20px', height: '20px', color: '#c4845a' }} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#2c241e', marginBottom: '0.5rem' }}>{feature.title}</h3>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'rgba(44, 36, 30, 0.5)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '140px 0', background: '#f5f0eb' }}>
        <div className="container-editorial">
          <div style={{ background: '#ffffff', border: '1px solid rgba(44, 36, 30, 0.08)', borderRadius: '8px', padding: '3rem 2rem', textAlign: 'center', maxWidth: '720px', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #c4845a, #d4a77a)', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
            <span className="label-sm" style={{ color: '#c4845a' }}>Get Started</span>
            <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#2c241e', marginTop: '0.5rem' }}>Ready to Stay on Track?</h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(44, 36, 30, 0.5)', maxWidth: '440px', margin: '0.5rem auto 0' }}>
              Connect your Google Classroom and never miss an activity again.
            </p>
            <Link to="/register">
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', height: '52px', padding: '0 2rem', fontSize: '0.95rem', fontWeight: 500, borderRadius: '6px', border: '1px solid transparent', background: '#c4845a', color: '#fdf7f2', cursor: 'pointer', transition: 'background 0.2s ease', marginTop: '1.5rem' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#a86d47'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#c4845a'}>
                Get Started Now <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid rgba(44, 36, 30, 0.08)', padding: '2rem 0' }}>
        <div className="container-editorial" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2c241e' }}>Google Classroom Reminder</span>
            <span style={{ fontSize: '0.65rem', color: 'rgba(44, 36, 30, 0.3)' }}>&#8226;</span>
            <span style={{ fontSize: '0.65rem', color: 'rgba(44, 36, 30, 0.4)' }}>Automated Activity Reminder</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.65rem', color: 'rgba(44, 36, 30, 0.4)' }}>
            <span>&copy; 2026</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
