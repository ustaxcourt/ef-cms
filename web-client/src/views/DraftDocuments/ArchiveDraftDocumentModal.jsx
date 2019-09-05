import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

class ArchiveDraftDocumentModalComponent extends ModalDialog {
  constructor(props) {
    super(props);

    this.modal = {
      cancelLabel: 'No, take me back',
      classNames: '',
      confirmLabel: 'Yes, delete',
      message:
        'The following document will be deleted and cannot be recovered:',
      title: 'Are you sure you want to delete this document?',
    };
  }

  renderBody() {
    const { props } = this;

    return <div className="margin-top-2 semi-bold">{props.documentTitle}</div>;
  }
}

ArchiveDraftDocumentModalComponent.propTypes = {
  documentTitle: PropTypes.string,
};

export const ArchiveDraftDocumentModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.archiveDraftDocumentSequence,
    form: state.form,
  },
  ArchiveDraftDocumentModalComponent,
);
