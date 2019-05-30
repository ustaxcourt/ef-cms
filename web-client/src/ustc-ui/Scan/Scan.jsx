import { PropTypes } from 'prop-types';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import { state } from 'cerebral';
import React from 'react';

import { SelectScannerSourceModal } from './SelectScannerSourceModal';

class ScanComponent extends React.Component {
  componentWillMount() {
    this.props.scannerStartup();
  }

  componentWillUnmount() {
    this.props.scannerShutdown();
  }
  render() {
    const { isScanning, scanHelper, onDoneClicked, onScanClicked } = this.props;
    return (
      <>
        {scanHelper.hasLoadedScanDependencies && (
          <>
            {scanHelper.showScannerSourceModal && <SelectScannerSourceModal />}
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
        )}
      </>
    );
  }
}

ScanComponent.propTypes = {
  isScanning: PropTypes.bool,
  onDoneClicked: PropTypes.func,
  onScanClicked: PropTypes.func,
  scanHelper: PropTypes.object,
  scannerShutdown: PropTypes.func,
  scannerStartup: PropTypes.func,
};

export const Scan = connect(
  {
    isScanning: state.isScanning,
    scanHelper: state.scanHelper,
    scannerShutdown: sequences.scannerShutdownSequence,
    scannerStartup: sequences.scannerStartupSequence,
  },
  ScanComponent,
);
