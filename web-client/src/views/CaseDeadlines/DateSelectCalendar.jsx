import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import Calendar from 'react-calendar';
import React from 'react';

export const DateSelectCalendar = connect(
  {
    calendarStartDate: state.calendarStartDate,
    selectDateRangeFromCalendarSequence:
      sequences.selectDateRangeFromCalendarSequence,
  },
  ({ calendarStartDate, selectDateRangeFromCalendarSequence }) => (
    <>
      <div className="header-with-blue-background">
        <h3>Show Deadlines by Date(s)</h3>
      </div>
      <div className="blue-container">
        <Calendar
          selectRange={true}
          value={calendarStartDate}
          onChange={dateRange =>
            selectDateRangeFromCalendarSequence({
              endDate: dateRange[1],
              startDate: dateRange[0],
            })
          }
          onClickDay={date =>
            selectDateRangeFromCalendarSequence({ startDate: date })
          }
        />
      </div>
    </>
  ),
);
