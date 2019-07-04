import { props, sequences } from 'cerebral';

import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import React from 'react';

import { Address } from './StartCase/Address';

class EditPrimaryContactModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: 'edit-primary-contact-modal',
      confirmLabel: 'Save',
    };
  }

  renderBody() {
    return (
      <div>
        <h3 className="margin-bottom-3">Edit Your Contact Information</h3>
        <Address
          bind={this.props.bind}
          type="contactPrimary"
          onBlur={this.props.onBlur}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

export const EditPrimaryContactModal = connect(
  {
    bind: props.bind,
    cancelSequence: sequences.cancelEditPrimaryContactSequence,
    confirmSequence: sequences.submitEditPrimaryContactSequence,
    onBlur: props.onBlur,
    onChange: props.onChange,
  },
  EditPrimaryContactModalComponent,
);
