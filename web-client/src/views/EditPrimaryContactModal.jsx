import { sequences, state } from 'cerebral';

import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import React from 'react';

import { Address } from './StartCase/Address';
import { Country } from './StartCase/Country';

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
    const bind = 'contactToEdit';
    const onBlur = 'validateCaseDetailSequence';
    const onChange = 'updateContactPrimaryValueSequence';
    const type = 'contactPrimary';

    const {
      contactToEdit,
      updateContactPrimaryValueSequence,
      validateCaseDetailSequence,
    } = this.props;

    return (
      <div>
        <h3 className="margin-bottom-3">Edit Your Contact Information</h3>
        <Country bind={bind} type={type} onBlur={onBlur} onChange={onChange} />
        <Address bind={bind} type={type} onBlur={onBlur} onChange={onChange} />
        <label className="usa-label" htmlFor="phone">
          Phone Number
        </label>
        <input
          autoCapitalize="none"
          className="usa-input"
          id="phone"
          name="contactPrimary.phone"
          type="tel"
          value={contactToEdit.contactPrimary.phone || ''}
          onBlur={() => {
            validateCaseDetailSequence();
          }}
          onChange={e => {
            updateContactPrimaryValueSequence({
              key: e.target.name,
              value: e.target.value,
            });
          }}
        />
      </div>
    );
  }
}

export const EditPrimaryContactModal = connect(
  {
    cancelSequence: sequences.cancelEditPrimaryContactSequence,
    confirmSequence: sequences.submitEditPrimaryContactSequence,
    contactToEdit: state.contactToEdit,
    updateContactPrimaryValueSequence:
      sequences.updateContactPrimaryValueSequence,
    validateCaseDetailSequence: sequences.validateCaseDetailSequence,
  },
  EditPrimaryContactModalComponent,
);
