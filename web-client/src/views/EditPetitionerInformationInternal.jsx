import { Address } from './StartCase/Address';
import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { Country } from './StartCase/Country';
import { ErrorNotification } from './ErrorNotification';
import { FormCancelModalDialog } from './FormCancelModalDialog';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { InternationalAddress } from './StartCase/InternationalAddress';
import { ServiceIndicatorRadios } from './ServiceIndicatorRadios';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditPetitionerInformationInternal = connect(
  {
    COUNTRY_TYPES: state.constants.COUNTRY_TYPES,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.modal.showModal,
    submitEditPrimaryContactSequence:
      sequences.submitEditPrimaryContactSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validatePrimaryContactSequence: sequences.validatePrimaryContactSequence,
    validationErrors: state.validationErrors,
  },
  function EditPetitionerInformationInternal({
    COUNTRY_TYPES,
    form,
    formCancelToggleCancelSequence,
    showModal,
    submitEditPrimaryContactSequence,
    updateFormValueSequence,
    validatePrimaryContactSequence,
    validationErrors,
  }) {
    const type = 'contact';
    const bind = 'form';
    const onBlur = 'validatePrimaryContactSequence';

    return (
      <>
        <CaseDetailHeader />

        <section className="usa-section grid-container">
          <ErrorNotification />

          <h2>Edit Petitioner Information</h2>

          <h3>Contact Information</h3>

          <div className="blue-container margin-bottom-5">
            <div className="usa-form-group">
              <FormGroup errorText={validationErrors.contactPrimary?.name}>
                <label className="usa-label" htmlFor="inCareOf">
                  <span>Name</span>
                </label>
                <input
                  autoCapitalize="none"
                  className="usa-input"
                  id="name"
                  name="contactPrimary.name"
                  type="text"
                  value={form.contact.name || ''}
                  onBlur={() => {
                    validatePrimaryContactSequence();
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

            <FormGroup
              errorText={validationErrors.contactPrimary?.additionalName}
            >
              <label className="usa-label" htmlFor="inCareOf">
                <span>
                  Additional name <span className="usa-hint">(optional)</span>
                </span>
                <p className="usa-hint">
                  A representative of the taxpayer or petitioner (In Care Of,
                  Guardian, Executor, Trustee, Surviving Spouse, etc.)
                </p>
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="additionalName"
                name="contactPrimary.additionalName"
                type="text"
                value={form.contact.additionalName || ''}
                onBlur={() => {
                  validatePrimaryContactSequence();
                }}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>

            <Country
              bind={bind}
              clearTypeOnCountryChange={true}
              type={type}
              onChange="contactPrimaryCountryTypeChangeSequence"
            />
            {form.contact.countryType === COUNTRY_TYPES.DOMESTIC ? (
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
            <FormGroup
              errorText={
                validationErrors &&
                validationErrors.contactPrimary &&
                validationErrors.contactPrimary.phone
              }
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
                id="phone"
                name="contactPrimary.phone"
                type="tel"
                value={form.contact.phone || ''}
                onBlur={() => {
                  validatePrimaryContactSequence();
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

          <h3>Login & Service Information</h3>

          <div className="blue-container margin-bottom-5">
            <div className="margin-bottom-6">
              <ServiceIndicatorRadios
                bind="form.contact"
                hideElectronic={true}
                // validateSequence={validateSequence}
                validationErrors="validationErrors.contactPrimary"
              />
            </div>
            <h4>Add Login & Service Email</h4>
            <FormGroup errorText={validationErrors.email}>
              <label className="usa-label" htmlFor="email">
                New email address
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="email"
                name="email"
                type="text"
                value={form.email || ''}
                // onBlur={() => validateChangeLoginAndServiceEmailSequence()}
                onChange={e =>
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  })
                }
              />
            </FormGroup>
            <FormGroup errorText={validationErrors.confirmEmail}>
              <label className="usa-label" htmlFor="confirm-email">
                Re-enter new email address
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="confirm-email"
                name="confirmEmail"
                type="text"
                value={form.confirmEmail || ''}
                // onBlur={() => validateChangeLoginAndServiceEmailSequence()}
                onChange={e =>
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  })
                }
              />
            </FormGroup>
          </div>

          <Button
            onClick={() => {
              submitEditPrimaryContactSequence();
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
