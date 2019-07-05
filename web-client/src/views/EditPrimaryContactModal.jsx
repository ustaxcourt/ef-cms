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
    const bind = 'caseDetail';
    const onBlur = 'updateCaseValueSequence';
    const onChange = 'updateCaseValueSequence';
    const type = 'contactPrimary';

    const { caseDetail, updateCaseValueSequence } = this.props;

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
          value={caseDetail.contactPrimary.phone || ''}
          onBlur={() => {
            updateCaseValueSequence();
          }}
          onChange={e => {
            updateCaseValueSequence({
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
