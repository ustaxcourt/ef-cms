import React from 'react';

export const SessionNotesSection = ({ sessionNotes }) => {
  return (
    <div className="card margin-top-0">
      <div className="card-header">Session Notes</div>
      <div className="card-content">{`${sessionNotes || 'n/a'}`}</div>
    </div>
  );
};
