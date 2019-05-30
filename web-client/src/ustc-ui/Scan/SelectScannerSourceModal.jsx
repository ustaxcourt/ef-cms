import { sequences, state } from 'cerebral';

import { ModalDialog } from '../../views/ModalDialog';
import { connect } from '@cerebral/react';
import React from 'react';

class SelectScannerSourceModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: '',
      confirmLabel: 'Use Scanner',
    };
  }

  renderBody() {
    const { setScannerSource, sources } = this.props;

    return (
      <div>
        Select a scanner source:
        {sources.map((source, index) => {
          return (
            <button
              className="margin-top-2"
              key={index}
              onClick={() => {
                setScannerSource({ scannerSourceName: source });
              }}
            >
              {source}
            </button>
          );
        })}
      </div>
    );
  }
}

export const SelectScannerSourceModal = connect(
  {
    setScannerSource: sequences.setScannerSourceSequence,
    sources: state.scanHelper.sources,
  },
  SelectScannerSourceModalComponent,
);
