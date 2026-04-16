import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ReadOnlyBanner = connect(
  {
    readOnlyMode: state.readOnlyMode,
  },
  function ReadOnlyBanner({ readOnlyMode }) {
    if (!readOnlyMode) return null;

    return (
      <div
        className="read-only-banner"
        style={{
          width: '100%',
          backgroundColor: '#8b1303',
          color: '#ffffff',
          fontWeight: 'bold',
          padding: '10px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 9999,
          position: 'relative',
        }}
      >
        <span>
          ⚠️ We are performing maintenance. During this time, you cannot submit
          filings or edit information. Normal operations will resume shortly.
        </span>
      </div>
    );
  },
);
