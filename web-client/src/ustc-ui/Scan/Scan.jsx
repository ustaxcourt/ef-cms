import { connect } from '@cerebral/react';
import React from 'react';

export const Scan = connect(props => {
  const { onDoneClicked, onScanClicked } = props;

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
        Scan
      </button>
      <button
        className="usa-button"
        type="buttom"
        onClick={e => {
          e.preventDefault();
          onDoneClicked();
        }}
      >
        Done
      </button>
    </>
  );
});
