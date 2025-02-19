import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

const MyCalendar=()=> {
  const handleDateClick = (arg) => {
    alert(arg.dateStr)
  }
  const eventInfo={
    timeText: "12:00",
    event: {
      title: "Event Title"
    }
  }
  function renderEventContent(eventInfo) {
    return(
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  }
  return (
    <FullCalendar
      plugins={[ dayGridPlugin ]}
      initialView="dayGridMonth"
      dateClick={handleDateClick}
      eventContent={renderEventContent}
      events={[
        { title: 'event 1', date: '2025-02-01' },
        { title: 'event 2', date: '2025-02-02' }
      ]}
    />
  )
}


export default MyCalendar;