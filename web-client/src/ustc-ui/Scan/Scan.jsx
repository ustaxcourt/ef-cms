import { PropTypes } from 'prop-types';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import { state } from 'cerebral';
import React from 'react';

class ScanComponent extends React.Component {
  componentWillMount() {
    this.props.scannerStartup();
  }

  componentWillUnmount() {
    this.props.scannerShutdown();
  }
  render() {
    const { isScanning, onDoneClicked, onScanClicked } = this.props;
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
  }
}

ScanComponent.propTypes = {
  isScanning: PropTypes.bool,
  onDoneClicked: PropTypes.func,
  onScanClicked: PropTypes.func,
  scannerShutdown: PropTypes.func,
  scannerStartup: PropTypes.func,
};

export const Scan = connect(
  {
    isScanning: state.isScanning,
    scannerShutdown: sequences.scannerShutdownSequence,
    scannerStartup: sequences.scannerStartupSequence,
  },
  ScanComponent,
);
