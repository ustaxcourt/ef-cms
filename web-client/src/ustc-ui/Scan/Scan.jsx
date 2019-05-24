import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const Scan = connect(
  { isScanning: state.isScanning },
  ({ isScanning, onDoneClicked, onScanClicked }) => {
    return (
      <>
        <button
          className="usa-button"
          type="buttom"
          onClick={e => {
            e.preventDefault();
            onScanClicked();
          }}
        >
          {isScanning ? 'Scan More' : 'Scan'}
        </button>
        {isScanning && (
          <button
            className="usa-button"
            type="buttom"
            onClick={e => {
              e.preventDefault();
              onDoneClicked();
            }}
          >
            Complete Scan
          </button>
        )}
      </>
    );
  },
);
