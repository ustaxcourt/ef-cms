import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';
import { ModalDialog } from '../ModalDialog';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { Country } from '../StartCase/Country';
import { Address } from '../StartCase/Address';
import { InternationalAddress } from '../StartCase/InternationalAddress';

export const EditContactInformationModal = connect(
  {
    COUNTRY_TYPES: state.constants.COUNTRY_TYPES,
    confirmSequence: sequences.submitEditContactInModalSequence,
    cancelSequence: sequences.clearModalFormSequence,
    form: state.modal.form,
    updateModalFormValueSequence: sequences.updateModalFormValueSequence,
    validationErrors: state.validationErrors,
    validatePetitionerInModalSequence:
      sequences.validatePetitionerInModalSequence,
  },
  function EditContactInformationModal({
    cancelSequence,
    confirmSequence,
    COUNTRY_TYPES,
    form,
    updateModalFormValueSequence,
    validationErrors,
    validatePetitionerInModalSequence,
  }) {
    const type = 'contact';
    const bind = 'modal.form';
    const onBlur = () => validatePetitionerInModalSequence();

    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Update Contact Information"
        confirmSequence={confirmSequence}
        message="This form will automatically create and submit a change of contact
         information notification for this case. Please ensure the information is 
         accurate before submitting."
        title="Update Contact Information"
      >
        <fieldset className="usa-fieldset">
          <span>{form.name}</span>
          <Country
            bind={bind}
            type={type}
            onBlur={onBlur}
            onChange="updateModalFormValueSequence"
          />
          {form.contact.countryType === COUNTRY_TYPES.DOMESTIC ? (
            <Address
              bind={bind}
              type={type}
              onBlur={onBlur}
              onChange="updateModalFormValueSequence"
            />
          ) : (
            <InternationalAddress
              bind={bind}
              type={type}
              onBlur={onBlur}
              onChange="updateModalFormValueSequence"
            />
          )}

          <FormGroup errorText={validationErrors?.contact?.phone}>
            <label className="usa-label" htmlFor="phone">
              Phone number
            </label>
            <span className="usa-hint">
              If you do not have a current phone number, enter N/A.
            </span>
            <input
              autoCapitalize="none"
              className="usa-input max-width-200"
              data-testid="phone-number-input"
              id="phone"
              name="contact.phone"
              type="text"
              value={form.contact.phone || ''}
              onBlur={() => {
                validatePetitionerInModalSequence();
              }}
              onChange={e => {
                updateModalFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
        </fieldset>
      </ModalDialog>
    );
  },
);
EditContactInformationModal.displayName = 'EditContactInformationModal';
