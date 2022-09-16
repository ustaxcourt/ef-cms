import React from 'react';

export const SessionNotesSection = ({ sessionNotes }) => {
  return (
    <div className="card margin-top-0" id="notes">
      <div className="card-header">Session Notes</div>
      <div className="card-content">{sessionNotes || ''}</div>
    </div>
  );
};
