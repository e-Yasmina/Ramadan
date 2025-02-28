import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import moment from "moment-hijri"; // Hijri support
import axios from "axios";
import "./Calendar.css"; // Add styles for Hijri dates

const HijriCalendar = () => {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];
    setEvents(storedEvents);
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    const fetchHijriEvents = async () => {
      const today = moment().format("YYYY-MM-DD");

      try {
        const response = await axios.get(
          `https://api.aladhan.com/v1/gToHCalendar/${today}/1`
        );

        if (response.data && response.data.data.length > 0) {
          const hijriEvents = response.data.data.map((item) => ({
            title: `Hijri: ${item.hijri.date}`,
            start: moment(item.gregorian.date, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            ), // FullCalendar expects this format
            allDay: true,
          }));

          setEvents(hijriEvents);
        }
      } catch (error) {
        console.error("Error fetching Hijri dates:", error);
      }
    };

    fetchHijriEvents();
  }, []);


  const renderEventContent = (eventInfo) => {
    return (
      <div style={{ backgroundColor: eventInfo.event.backgroundColor, padding: "5px", borderRadius: "5px" }}>
        <b>{eventInfo.timeText}</b> - <i>{eventInfo.event.title}</i>
        <button onClick={() => toggleCompletion(eventInfo.event.id)} style={{ marginLeft: "5px" }}>
          {eventInfo.event.extendedProps.completed ? "✅" : "⬜"}
        </button>
      </div>
    );
  };

  const handleSelect = (selectionInfo) => {
    const title = prompt("Enter Task Title:");
    const color = prompt("Enter Task Color (e.g., #ff0000):");
    if (!title) return;
    
    const newEvent = {
      id: Date.now(),
      title,
      start: selectionInfo.startStr,
      end: selectionInfo.endStr,
      color: color || "#3788d8",
      completed: false,
      frequency: "daily",
    };
    setEvents([...events, newEvent]);
  };

  const toggleCompletion = (id) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, completed: !event.completed } : event
    ));
  };

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);


  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,dayGridWeek,dayGridDay",
      }}
      selectable={true}
      select={handleSelect}
      dayCellContent={(arg) => {
        const hijriDate = moment(arg.date).format("iD iMMMM"); // Get Hijri day and month
        return (
          <div>
            <div className="calendar-cell">
            <span className="hijri-date"> {hijriDate} --</span>
            <span className="gregorian-date">{arg.dayNumberText}</span>
          </div>
          </div>
        );
      }}
      events={events.map(event => ({
        ...event,
        // start: event.start,
        // end: event.end,
      }))}
      eventContent={renderEventContent}
      dayCellDidMount={(info) => {
        info.el.style.cursor = "pointer";
      }}
    />
  );
};

export default HijriCalendar;
