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
    return (
      <div>
        <h3 className="margin-bottom-3">Edit Your Contact Information</h3>
        <Country
          bind="caseDetail"
          type="contactPrimary"
          onBlur="updateCaseValueSequence"
          onChange="updateCaseValueSequence"
        />
        <Address
          bind="caseDetail"
          type="contactPrimary"
          onBlur="updateCaseValueSequence"
          onChange="updateCaseValueSequence"
        />
        <label className="usa-label" htmlFor="phone">
          Phone Number
        </label>
        <input
          autoCapitalize="none"
          className="usa-input"
          id="phone"
          name="contactPrimary.phone"
          type="tel"
          value={this.props.caseDetail.contactPrimary.phone || ''}
          onBlur={() => {
            this.props.updateCaseValueSequence();
          }}
          onChange={e => {
            this.props.updateCaseValueSequence({
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
    caseDetail: state.caseDetail,
    confirmSequence: sequences.submitEditPrimaryContactSequence,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
  },
  EditPrimaryContactModalComponent,
);
