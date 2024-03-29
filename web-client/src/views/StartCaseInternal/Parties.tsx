import { Contacts } from '../StartCase/Contacts';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const Parties = connect(
  {
    form: state.form,
    startCaseInternalHelper: state.startCaseInternalHelper,
    updateFormValueAndCaseCaptionSequence:
      sequences.updateFormValueAndCaseCaptionSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updateStartCaseInternalPartyTypeSequence:
      sequences.updateStartCaseInternalPartyTypeSequence,
    validatePetitionFromPaperSequence:
      sequences.validatePetitionFromPaperSequence,
    validationErrors: state.validationErrors,
  },
  function Parties({
    form,
    startCaseInternalHelper,
    updateFormValueAndCaseCaptionSequence,
    updateFormValueSequence,
    updateStartCaseInternalPartyTypeSequence,
    validatePetitionFromPaperSequence,
    validationErrors,
  }) {
    return (
      <div className="blue-container margin-bottom-4 document-detail-one-third">
        <FormGroup errorText={validationErrors.partyType}>
          <label className="usa-label" htmlFor="party-type">
            Party type
          </label>
          <select
            className="usa-select"
            id="party-type"
            name="partyType"
            value={form.partyType}
            onChange={e => {
              updateStartCaseInternalPartyTypeSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validatePetitionFromPaperSequence();
            }}
          >
            <option value="">- Select -</option>
            {Object.keys(startCaseInternalHelper.partyTypes).map(partyType => (
              <option
                key={partyType}
                value={startCaseInternalHelper.partyTypes[partyType]}
              >
                {startCaseInternalHelper.partyTypes[partyType]}
              </option>
            ))}
          </select>
        </FormGroup>

        {startCaseInternalHelper.showOrderForCorporateDisclosureStatement && (
          <div className="subsection order-checkbox">
            <input
              checked={form.orderForCds}
              className="usa-checkbox__input"
              id="order-for-cds"
              name="orderForCds"
              type="checkbox"
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
              }}
            />
            <label
              className="usa-checkbox__label"
              htmlFor="order-for-cds"
              id="order-for-cds-label"
            >
              Order for Corporate Disclosure Statement
            </label>
          </div>
        )}

        {(startCaseInternalHelper.showPrimaryContact ||
          startCaseInternalHelper.showSecondaryContact) && (
          <div className="subsection contacts">
            <Contacts
              bind="form"
              contactsHelper="internalPetitionPartiesHelper"
              parentView="StartCaseInternal"
              showPrimaryContact={startCaseInternalHelper.showPrimaryContact}
              showSecondaryContact={
                startCaseInternalHelper.showSecondaryContact
              }
              useSameAsPrimary={true}
              onBlur={() => validatePetitionFromPaperSequence}
              onChange={() => updateFormValueAndCaseCaptionSequence}
            />
          </div>
        )}
      </div>
    );
  },
);

Parties.displayName = 'Parties';
