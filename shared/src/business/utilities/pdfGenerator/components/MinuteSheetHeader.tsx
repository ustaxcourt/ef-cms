import React from 'react';

export const MinuteSheetHeader = ({ trialSessionLocation, trialStartDate }) => {
  return (
    <div className="minute-sheet-header">
      <div className="us-tax-court-seal"></div>
      <h1>United States Tax Court</h1>
      <div
        style={{
          fontSize: '14px',
        }}
      >
        Washington, DC 20217
      </div>
      <div className="trial-session-location">{trialSessionLocation}</div>
      <div className="trial-session-date">{trialStartDate}</div>
      <div className="clear"></div>
    </div>
  );
};
