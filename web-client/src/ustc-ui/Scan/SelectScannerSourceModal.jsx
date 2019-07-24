import { sequences, state } from 'cerebral';

import { ModalDialog } from '../../views/ModalDialog';
import { connect } from '@cerebral/react';
import React from 'react';

class SelectScannerSourceModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: 'modal-select-scanner-source',
      confirmLabel: 'Use Scanner',
    };
  }

  renderBody() {
    const { setScannerSource, sources } = this.props;

    return (
      <div>
        <h3>Select a Scanner Source</h3>
        {sources.map((source, index) => {
          return (
            <button
              className="usa-button usa-button--outline display-block margin-top-1"
              key={index}
              onClick={() => {
                setScannerSource({
                  scannerSourceIndex: index,
                  scannerSourceName: source,
                });
              }}
            >
              {source}
            </button>
          );
        })}
        {sources.length === 0 && (
          <p>There are currently no scanner sources available.</p>
        )}
      </div>
    );
  }
}

export const SelectScannerSourceModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    setScannerSource: sequences.setScannerSourceSequence,
    sources: state.scanHelper.sources,
  },
  SelectScannerSourceModalComponent,
);
