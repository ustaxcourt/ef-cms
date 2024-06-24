import { PreformattedText } from '@web-client/ustc-ui/PreformatedText/PreformattedText';
import React from 'react';

export const SessionNotesSection = ({ sessionNotes }) => {
  return (
    <div className="card margin-top-0">
      <div className="card-header">Session Notes</div>
      <div className="card-content">
        <PreformattedText text={`${sessionNotes || 'n/a'}`} />
      </div>
    </div>
  );
};
