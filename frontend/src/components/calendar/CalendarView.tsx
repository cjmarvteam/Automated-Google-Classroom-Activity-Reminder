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
    pending: '#c97a57',
    in_progress: '#dca77a',
    completed: '#5cb85c',
    overdue: '#e74c3c',
  };

  const formattedEvents = events.map((e) => ({
    ...e,
    color: e.color || eventColors[e.extendedProps?.status || 'pending'] || '#c97a57',
    textColor: '#ffffff',
    borderColor: 'transparent',
  }));

  return (
    <div className="glass rounded-xl border border-white/10 p-4 overflow-hidden calendar-wrapper">
      <style>{`
        .calendar-wrapper .fc .fc-toolbar-title {
          color: var(--foreground);
          font-weight: 700;
        }
        .calendar-wrapper .fc .fc-button {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--foreground);
          border-radius: 10px;
          font-weight: 500;
          padding: 6px 14px;
          transition: all 0.2s;
        }
        .calendar-wrapper .fc .fc-button:hover {
          background: rgba(201, 122, 87, 0.2);
          border-color: rgba(201, 122, 87, 0.3);
        }
        .calendar-wrapper .fc .fc-button-primary:not(:disabled):active,
        .calendar-wrapper .fc .fc-button-primary:not(:disabled).fc-button-active {
          background: rgba(201, 122, 87, 0.3);
          border-color: rgba(201, 122, 87, 0.4);
        }
        .calendar-wrapper .fc .fc-button-primary:focus {
          box-shadow: 0 0 0 2px rgba(201, 122, 87, 0.3);
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
          background: rgba(201, 122, 87, 0.06);
        }
        .calendar-wrapper .fc .fc-day-today {
          background: rgba(201, 122, 87, 0.1) !important;
          border-radius: 8px;
        }
        .calendar-wrapper .fc .fc-daygrid-day-number {
          color: var(--foreground);
          font-size: 0.85rem;
          font-weight: 500;
          padding: 6px 8px;
        }
        .calendar-wrapper .fc .fc-daygrid-day-number:hover {
          color: #c97a57;
        }
        .calendar-wrapper .fc .fc-col-header-cell-cushion {
          color: var(--muted-foreground);
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
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          margin-bottom: 2px;
        }
        .calendar-wrapper .fc .fc-daygrid-event:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .calendar-wrapper .fc .fc-daygrid-event .fc-event-title {
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .calendar-wrapper .fc .fc-daygrid-more-link {
          color: #c97a57;
          font-weight: 500;
          font-size: 0.7rem;
        }
        .calendar-wrapper .fc .fc-daygrid-more-link:hover {
          color: #a66245;
        }
        .calendar-wrapper .fc .fc-popover {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .calendar-wrapper .fc .fc-popover-header {
          background: transparent;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .calendar-wrapper .fc .fc-popover-title {
          color: var(--foreground);
          font-weight: 600;
        }
        .calendar-wrapper .fc .fc-popover-close {
          color: var(--foreground);
          opacity: 0.6;
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
