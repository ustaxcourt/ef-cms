import { isEmpty } from 'lodash';
import { sequences, state } from 'cerebral';

import { ModalDialog } from './ModalDialog';
import { Text } from '../ustc-ui/Text/Text';
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

    this.type = 'contactPrimary';
  }

  runConfirmSequence(event) {
    event.stopPropagation();

    if (isEmpty(this.props.validationErrors[this.type])) {
      this.props.confirmSequence.call();
    }
  }

  renderBody() {
    const bind = 'contactToEdit';
    const onBlur = 'validateContactPrimarySequence';
    const onChange = 'updateContactPrimaryValueSequence';
    const { type } = this;

    const {
      contactToEdit,
      updateContactPrimaryValueSequence,
      validateContactPrimarySequence,
      validationErrors,
    } = this.props;

    return (
      <div>
        <h3 className="margin-bottom-3">Edit Your Contact Information</h3>
        <Country bind={bind} type={type} onBlur={onBlur} onChange={onChange} />
        <Address bind={bind} type={type} onBlur={onBlur} onChange={onChange} />
        <div
          className={
            'usa-form-group ' +
            (validationErrors &&
            validationErrors[type] &&
            validationErrors[type].phone
              ? 'usa-form-group--error'
              : '')
          }
        >
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
              validateContactPrimarySequence();
            }}
            onChange={e => {
              updateContactPrimaryValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
          <Text
            bind={`validationErrors.${type}.phone`}
            className="usa-error-message"
          />
        </div>
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
    validateContactPrimarySequence: sequences.validateContactPrimarySequence,
    validationErrors: state.validationErrors,
  },
  EditPrimaryContactModalComponent,
);
