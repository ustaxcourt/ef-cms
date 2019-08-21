import Calendar from 'react-calendar';
import React from 'react';

export const DateSelectCalendar = () => (
  <>
    <div className="header-with-blue-background">
      <h3>Show Deadlines by Date(s)</h3>
    </div>
    <div className="blue-container">
      <Calendar selectRange={true} />
    </div>
  </>
);
