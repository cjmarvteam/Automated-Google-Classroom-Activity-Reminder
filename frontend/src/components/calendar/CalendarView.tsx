import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg } from '@fullcalendar/core';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  color?: string;
  extendedProps?: {
    status: string;
    subject: string;
  };
}

interface Props {
  events: CalendarEvent[];
  onEventClick: (event: any) => void;
}

export default function CalendarView({ events, onEventClick }: Props) {
  const eventColors: Record<string, string> = {
    pending: '#c4845a',
    in_progress: '#dca77a',
    completed: '#27ae60',
    overdue: '#e74c3c',
  };

  const formattedEvents = events.map((e) => ({
    ...e,
    color: e.color || eventColors[e.extendedProps?.status || 'pending'] || '#c4845a',
    textColor: '#ffffff',
    borderColor: 'transparent',
  }));

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid rgba(44, 36, 30, 0.08)',
      borderRadius: '12px',
      padding: '1.5rem',
      overflow: 'hidden',
    }} className="calendar-wrapper">
      <style>{`
        .calendar-wrapper .fc {
          --fc-border-color: rgba(44, 36, 30, 0.08);
          --fc-button-bg-color: #ffffff;
          --fc-button-border-color: rgba(44, 36, 30, 0.12);
          --fc-button-hover-bg-color: rgba(196, 132, 90, 0.1);
          --fc-button-hover-border-color: rgba(196, 132, 90, 0.3);
          --fc-button-active-bg-color: rgba(196, 132, 90, 0.15);
          --fc-button-active-border-color: rgba(196, 132, 90, 0.4);
          --fc-today-bg-color: rgba(196, 132, 90, 0.06);
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: #faf8f5;
          --fc-list-event-hover-bg-color: rgba(196, 132, 90, 0.05);
        }
        .calendar-wrapper .fc .fc-toolbar-title {
          color: #2c241e;
          font-weight: 700;
        }
        .calendar-wrapper .fc .fc-button {
          color: #2c241e;
          border-radius: 6px;
          font-weight: 500;
          font-size: 0.8rem;
          padding: 6px 14px;
          transition: all 0.2s;
          box-shadow: none;
        }
        .calendar-wrapper .fc .fc-button:hover {
          color: #c4845a;
        }
        .calendar-wrapper .fc .fc-button-primary:not(:disabled).fc-button-active {
          color: #c4845a;
        }
        .calendar-wrapper .fc .fc-daygrid-day {
          background: transparent;
        }
        .calendar-wrapper .fc .fc-daygrid-day-frame {
          background: transparent;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .calendar-wrapper .fc .fc-daygrid-day-frame:hover {
          background: rgba(196, 132, 90, 0.04);
        }
        .calendar-wrapper .fc .fc-day-today .fc-daygrid-day-frame {
          background: rgba(196, 132, 90, 0.08) !important;
          border-radius: 8px;
        }
        .calendar-wrapper .fc .fc-daygrid-day-number {
          color: #2c241e;
          font-size: 0.85rem;
          font-weight: 500;
          padding: 6px 8px;
        }
        .calendar-wrapper .fc .fc-daygrid-day-number:hover {
          color: #c4845a;
        }
        .calendar-wrapper .fc .fc-col-header-cell-cushion {
          color: rgba(44, 36, 30, 0.5);
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 8px 0;
        }
        .calendar-wrapper .fc .fc-daygrid-day-events {
          padding: 0 4px;
        }
        .calendar-wrapper .fc .fc-daygrid-event {
          border-radius: 6px;
          border: none;
          padding: 2px 8px;
          font-size: 0.7rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          margin-bottom: 2px;
        }
        .calendar-wrapper .fc .fc-daygrid-event:hover {
          transform: scale(1.02);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .calendar-wrapper .fc .fc-daygrid-event .fc-event-title {
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .calendar-wrapper .fc .fc-daygrid-more-link {
          color: #c4845a;
          font-weight: 500;
          font-size: 0.7rem;
        }
        .calendar-wrapper .fc .fc-daygrid-more-link:hover {
          color: #a86d47;
        }
        .calendar-wrapper .fc .fc-popover {
          background: #ffffff;
          border: 1px solid rgba(44, 36, 30, 0.08);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .calendar-wrapper .fc .fc-popover-header {
          background: #faf8f5;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(44, 36, 30, 0.06);
          border-radius: 12px 12px 0 0;
        }
        .calendar-wrapper .fc .fc-popover-title {
          color: #2c241e;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .calendar-wrapper .fc .fc-popover-close {
          color: rgba(44, 36, 30, 0.4);
        }
        .calendar-wrapper .fc .fc-popover-close:hover {
          color: #2c241e;
        }
        .calendar-wrapper .fc .fc-popover-body {
          padding: 6px 8px;
        }
        @media (max-width: 640px) {
          .calendar-wrapper .fc .fc-toolbar {
            flex-direction: column;
            gap: 8px;
          }
          .calendar-wrapper .fc .fc-toolbar-title {
            font-size: 1.1rem;
          }
          .calendar-wrapper .fc .fc-daygrid-day-number {
            font-size: 0.7rem;
            padding: 4px 6px;
          }
          .calendar-wrapper .fc .fc-daygrid-event {
            font-size: 0.6rem;
            padding: 1px 4px;
          }
          .calendar-wrapper .fc .fc-col-header-cell-cushion {
            font-size: 0.6rem;
          }
        }
      `}</style>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin] as any}
        initialView="dayGridMonth"
        events={formattedEvents}
        eventClick={onEventClick as any}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek',
        }}
        dayMaxEvents={3}
        moreLinkClick="popover"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
        }}
        eventDisplay="block"
      />
    </div>
  );
}
