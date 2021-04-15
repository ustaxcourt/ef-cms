import { Address } from '../StartCase/Address';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { Country } from '../StartCase/Country';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { InternationalAddress } from '../StartCase/InternationalAddress';
import { MatchingEmailFoundModal } from '../CaseDetail/MatchingEmailFoundModal';
import { NoMatchingEmailFoundModal } from '../CaseDetail/NoMatchingEmailFoundModal';
import { ServiceIndicatorRadios } from '../ServiceIndicatorRadios';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddPetitionerToCase = connect(
  {
    COUNTRY_TYPES: state.constants.COUNTRY_TYPES,
    constants: state.constants,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.modal.showModal,
    submitEditPetitionerSequence: sequences.submitEditPetitionerSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validatePetitionerSequence: sequences.validatePetitionerSequence,
    validationErrors: state.validationErrors,
  },
  function AddPetitionerToCase({
    constants,
    COUNTRY_TYPES,
    form,
    formCancelToggleCancelSequence,
    showModal,
    submitEditPetitionerSequence,
    updateFormValueSequence,
    validatePetitionerSequence,
    validationErrors,
  }) {
    const type = 'contact';
    const bind = 'form';
    const onBlur = 'validatePetitionerSequence';

    return (
      <>
        <CaseDetailHeader />

        <section className="usa-section grid-container">
          <ErrorNotification />

          <h2>Add Petitioner</h2>

          <div className="blue-container margin-bottom-5">
            <FormGroup errorText={validationErrors.contact?.name}>
              <label className="usa-label" htmlFor="name">
                <span>Name</span>
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="name"
                name="contact.name"
                type="text"
                value={form.contact.name || ''}
                onBlur={() => {
                  validatePetitionerSequence();
                }}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>

            <FormGroup errorText={validationErrors.contact?.additionalName}>
              <label className="usa-label" htmlFor="additionalName">
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
                name="contact.additionalName"
                type="text"
                value={form.contact.additionalName || ''}
                onBlur={() => {
                  validatePetitionerSequence();
                }}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>

            <FormGroup>
              <input
                checked={false}
                className="usa-checkbox__input"
                id="use-same-address-above"
                name="useExistingAddress"
                type="checkbox"
              />
              <label
                className="usa-checkbox__label"
                htmlFor="use-same-address-above"
                id="use-same-address-above-label"
              >
                Use existing address
              </label>
            </FormGroup>

            <Country
              bind={bind}
              clearTypeOnCountryChange={true}
              type={type}
              onChange="updateFormValueSequence"
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
                validationErrors.contact &&
                validationErrors.contact.phone
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
                name="contact.phone"
                type="tel"
                value={form.contact.phone || ''}
                onBlur={() => {
                  validatePetitionerSequence();
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
                hideElectronic={!form.contact.currentEmail}
                validateSequence={validatePetitionerSequence}
                validationErrors="validationErrors.contact"
              />
            </div>
          </div>

          <h2>Case Caption</h2>

          <div className="blue-container margin-bottom-5">
            <label className="usa-label" htmlFor="message">
              Case caption
            </label>
            <textarea
              className="usa-textarea"
              id="message"
              name="message"
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validatePetitionerSequence();
              }}
            />
            <span className="display-inline-block margin-top-1">
              {constants.CASE_CAPTION_POSTFIX}
            </span>
          </div>

          <Button
            id="submit-edit-petitioner-information"
            onClick={() => {
              submitEditPetitionerSequence();
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
        {showModal === 'MatchingEmailFoundModal' && <MatchingEmailFoundModal />}
        {showModal === 'NoMatchingEmailFoundModal' && (
          <NoMatchingEmailFoundModal />
        )}
      </>
    );
  },
);
