import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';

import React from 'react';

class ServeConfirmModalDialogComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'No, take me back',
      classNames: 'serve-confirm=modal',
      confirmLabel: 'Yes, serve',
      documentType: props.documentType,
      title: 'Are you ready to initiate service?',
    };
  }

  renderBody() {
    return (
      <>
        <div>The following document will be served on all parties:</div>
        <p>
          <b>{this.props.documentType}</b>
        </p>
      </>
    );
  }
}

export const ServeConfirmModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.serveDocumentSequence,
  },
  ServeConfirmModalDialogComponent,
);
