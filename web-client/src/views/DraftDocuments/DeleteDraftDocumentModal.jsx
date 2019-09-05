import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

class DeleteDraftDocumentModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'No, take me back',
      classNames: '',
      confirmLabel: 'Yes, remove',
      message:
        'The following document will be deleted and cannot be recovered:',
      title: 'Are you sure you want to delete this document?',
    };
  }

  renderBody() {
    const { props } = this;

    return <>document type name: {props.documentTypeName}</>;
  }
}

DeleteDraftDocumentModalComponent.propTypes = {
  documentTypeName: PropTypes.string,
};

export const DeleteDraftDocumentModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.deleteCaseDeadlineSequence,
    form: state.form,
  },
  DeleteDraftDocumentModalComponent,
);
