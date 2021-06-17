import { Address } from '../StartCase/Address';
import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { Country } from '../StartCase/Country';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { InternationalAddress } from '../StartCase/InternationalAddress';
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
    partiesInformationHelper: state.partiesInformationHelper,
    petitionerAddresses: state.screenMetadata.petitionerAddresses,
    setSelectedAddressOnFormSequence:
      sequences.setSelectedAddressOnFormSequence,
    showModal: state.modal.showModal,
    submitAddPetitionerSequence: sequences.submitAddPetitionerSequence,
    toggleUseExistingAddressSequence:
      sequences.toggleUseExistingAddressSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateAddPetitionerSequence: sequences.validateAddPetitionerSequence,
    validationErrors: state.validationErrors,
  },
  function AddPetitionerToCase({
    constants,
    COUNTRY_TYPES,
    form,
    formCancelToggleCancelSequence,
    partiesInformationHelper,
    petitionerAddresses,
    setSelectedAddressOnFormSequence,
    showModal,
    submitAddPetitionerSequence,
    toggleUseExistingAddressSequence,
    updateFormValueSequence,
    validateAddPetitionerSequence,
    validationErrors,
  }) {
    const type = 'contact';
    const bind = 'form';
    const onBlur = 'validateAddPetitionerSequence';

    return (
      <>
        <CaseDetailHeader />

        <section className="usa-section grid-container">
          <ErrorNotification />

          <h2>Add Party</h2>

          <div className="blue-container margin-bottom-5">
            <FormGroup errorText={validationErrors?.contactType}>
              <label className="usa-label" htmlFor="contactType">
                <span>Role type</span>
              </label>
              <select
                aria-label="role type dropdown"
                className="usa-select max-width-400"
                id="contactType"
                name="contact.contactType"
                value={form.contact.contactType || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateAddPetitionerSequence();
                }}
              >
                <option value="">- Select -</option>
                <option value="petitioner">Petitioner</option>
                {partiesInformationHelper.showIntervenorRole && (
                  <option value="intervenor">Intervenor</option>
                )}
                <option value="participant">Participant</option>
              </select>
            </FormGroup>

            <FormGroup errorText={validationErrors?.name}>
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
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateAddPetitionerSequence();
                }}
              />
            </FormGroup>

            <FormGroup errorText={validationErrors?.additionalName}>
              <label className="usa-label" htmlFor="additionalName">
                <span>
                  Additional name <span className="usa-hint">(optional)</span>
                </span>
                <p className="usa-hint">
                  A representative of the taxpayer or petitioner (In Care Of,
                  Guardian, Executor, Trustee, Surviving Spouse, Tax Matters
                  Partner, etc.)
                </p>
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="additionalName"
                name="contact.additionalName"
                type="text"
                value={form.contact.additionalName || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateAddPetitionerSequence();
                }}
              />
            </FormGroup>

            <FormGroup>
              <input
                checked={form.useExistingAddress}
                className="usa-checkbox__input"
                id="use-same-address-above"
                name="useExistingAddress"
                type="checkbox"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                  toggleUseExistingAddressSequence();
                }}
              />
              <label
                className="usa-checkbox__label"
                htmlFor="use-same-address-above"
                id="use-same-address-above-label"
              >
                Use existing address
              </label>
            </FormGroup>

            {petitionerAddresses && (
              <FormGroup className="margin-left-3">
                <BindedSelect
                  aria-label="existing address dropdown"
                  bind={`${bind}.${type}.existingAddressContactId`}
                  className="usa-input width-mobile"
                  id="existing-addresses"
                  name="existingAddresses"
                  onChange={e => {
                    setSelectedAddressOnFormSequence({
                      contactId: e,
                    });
                  }}
                >
                  <option value="">- Select -</option>
                  {Object.keys(petitionerAddresses).map(contactId => (
                    <option key={contactId} value={contactId}>
                      {petitionerAddresses[contactId]}
                    </option>
                  ))}
                </BindedSelect>
              </FormGroup>
            )}

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
            <FormGroup errorText={validationErrors?.phone}>
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
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateAddPetitionerSequence();
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
                validateSequence={validateAddPetitionerSequence}
                validationErrors="validationErrors.contact"
              />
            </div>
          </div>

          <h2>Case Caption</h2>
          <div className="blue-container margin-bottom-5">
            <FormGroup errorText={validationErrors?.caseCaption}>
              <label className="usa-label" htmlFor="case-caption">
                Case caption
              </label>
              <textarea
                className="usa-textarea"
                id="case-caption"
                name="caseCaption"
                value={form.contact.caseCaption || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: 'contact.caseCaption',
                    value: e.target.value,
                  });
                  validateAddPetitionerSequence();
                }}
              />
              <span className="display-inline-block margin-top-1">
                {constants.CASE_CAPTION_POSTFIX}
              </span>
            </FormGroup>
          </div>

          <Button
            id="submit-edit-petitioner-information"
            onClick={() => {
              submitAddPetitionerSequence();
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
