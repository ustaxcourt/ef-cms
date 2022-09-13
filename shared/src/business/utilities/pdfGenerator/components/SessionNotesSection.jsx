import React from 'react';

export const SessionNotesSection = ({ sessionNotes }) => {
  console.log('SessionNotesSection:', sessionNotes);
  return (
    <React.Fragment>
      <h3 className="display-inline">Session Notes</h3>
      <div>{sessionNotes || ''}</div>
    </React.Fragment>
  );
};
