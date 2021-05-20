import { Address } from './StartCase/Address';
import { Button } from '../ustc-ui/Button/Button';
import { Country } from './StartCase/Country';
import { ErrorNotification } from './ErrorNotification';
import { FormCancelModalDialog } from './FormCancelModalDialog';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../ustc-ui/Hint/Hint';
import { InternationalAddress } from './StartCase/InternationalAddress';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SecondaryContactEdit = connect(
  {
    COUNTRY_TYPES: state.constants.COUNTRY_TYPES,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.modal.showModal,
    submitEditSecondaryContactSequence:
      sequences.submitEditSecondaryContactSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateSecondaryContactSequence:
      sequences.validateSecondaryContactSequence,
    validationErrors: state.validationErrors,
  },
  function SecondaryContactEdit({
    COUNTRY_TYPES,
    form,
    formCancelToggleCancelSequence,
    showModal,
    submitEditSecondaryContactSequence,
    updateFormValueSequence,
    validateSecondaryContactSequence,
    validationErrors,
  }) {
    const type = 'contactSecondary';
    const bind = 'form';
    const onBlur = 'validateSecondaryContactSequence';

    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <h1>Edit Contact Information</h1>
          </div>
        </div>

        <section className="usa-section grid-container">
          <ErrorNotification />

          <p>
            This form will automatically create and submit a change of contact
            information notification for this case. Please ensure your
            information is accurate before submitting.
          </p>

          <Hint wider>
            To change the case caption, please file a Motion to Change Caption
          </Hint>

          <div className="blue-container margin-bottom-5">
            <div className="usa-form-group">
              <p className="usa-label margin-bottom-0">Contact name</p>
              <p className="margin-top-0">{form.contactSecondary.name}</p>
            </div>

            {form.contactSecondary.additionalName && (
              <div className="usa-form-group">
                <p className="usa-label margin-bottom-0">Additional name</p>
                <p className="margin-top-0">
                  {form.contactSecondary.additionalName}
                </p>
              </div>
            )}

            <Country
              bind={bind}
              clearTypeOnCountryChange={true}
              type={type}
              onChange="contactSecondaryCountryTypeChangeSequence"
            />
            {form.contactSecondary.countryType === COUNTRY_TYPES.DOMESTIC ? (
              <Address
                bind={bind}
                type={type}
                onBlur={onBlur}
                onChange="updateFormValueSequence"
              />
            ) : (
              <InternationalAddress
                bind={bind}
                type={type}
                onBlur={onBlur}
                onChange="updateFormValueSequence"
              />
            )}
            <FormGroup errorText={validationErrors?.contactSecondary?.phone}>
              <label className="usa-label" htmlFor="phone">
                Phone number
              </label>
              <span className="usa-hint">
                If you do not have a current phone number, enter N/A.
              </span>
              <input
                autoCapitalize="none"
                className="usa-input max-width-200"
                id="phone"
                name="contactSecondary.phone"
                type="tel"
                value={form.contactSecondary.phone || ''}
                onBlur={() => {
                  validateSecondaryContactSequence();
                }}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          </div>
          <Button
            onClick={() => {
              submitEditSecondaryContactSequence();
            }}
          >
            Save
          </Button>
          <Button
            link
            onClick={() => {
              formCancelToggleCancelSequence();
              return false;
            }}
          >
            Cancel
          </Button>
        </section>

        {showModal === 'FormCancelModalDialog' && (
          <FormCancelModalDialog onCancelSequence="closeModalAndReturnToCaseDetailSequence" />
        )}
      </>
    );
  },
);
