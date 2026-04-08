import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { Country } from '../StartCase/Country';
import { Address } from '../StartCase/Address';
import { InternationalAddress } from '../StartCase/InternationalAddress';
import { ConfirmModal } from '@web-client/ustc-ui/Modal/ConfirmModal';

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
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Update Contact Information"
        onCancelSequence={cancelSequence}
        onConfirmSequence={confirmSequence}
        title="Update Contact Information"
      >
        <div className="tw:xs:text-lg tw:text-base">
          <span className="tw:block tw:mb-4 tw:mt-4">
            Completing this form will automatically create and file a notice
            updating the contact information of the petitioner(s) you are
            representing.
          </span>
          <span className="tw:block tw:mb-4 tw:mt-4">{form.contact.name}</span>
          {form.contact.secondaryName ? (
            <span className="tw:block tw:mb-4 tw:mt-4">
              c/o {form.contact.secondaryName}
              {form.contact.title && <span>, {form.contact.title}</span>}
            </span>
          ) : (
            form.contact.additionalName && (
              <span className="tw:block tw:mb-4 tw:mt-4">
                {form.contact.additionalName}
              </span>
            )
          )}
        </div>
        <fieldset className="usa-fieldset">
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

          <FormGroup
            errorText={validationErrors?.contact?.phone}
            className="tw:mb-0"
          >
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
      </ConfirmModal>
    );
  },
);
EditContactInformationModal.displayName = 'EditContactInformationModal';
