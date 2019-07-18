import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';

import React from 'react';

class PDFPreviewErrorModalComponent extends ModalDialog {
  constructor(props) {
    super(props);

    this.modal = {
      confirmLabel: 'OK',
      title: props.title,
    };
  }
  renderBody() {
    return (
      <span>
        There was an error loading the document preview. Please try again.
      </span>
    );
  }
}

export const PDFPreviewErrorModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.dismissModalSequence,
  },
  PDFPreviewErrorModalComponent,
);
