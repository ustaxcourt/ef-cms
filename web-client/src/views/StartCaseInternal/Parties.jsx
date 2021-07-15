import { Contacts } from '../StartCase/Contacts';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const Parties = connect(
  {
    form: state.form,
    startCaseInternalHelper: state.startCaseInternalHelper,
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

        {startCaseInternalHelper.showOrderForOwnershipDisclosureStatement && (
          <div className="subsection order-checkbox">
            <input
              checked={form.orderForOds}
              className="usa-checkbox__input"
              id="order-for-ods"
              name="orderForOds"
              type="checkbox"
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
              }}
            />
            <label className="usa-checkbox__label" htmlFor="order-for-ods">
              Order for Ownership Disclosure Statement
            </label>
          </div>
        )}

        {(startCaseInternalHelper.showPrimaryContact ||
          startCaseInternalHelper.showSecondaryContact) && (
          <div className="subsection contacts">
            <Contacts
              bind="form"
              contactsHelper="startCaseInternalContactsHelper"
              parentView="StartCaseInternal"
              showPrimaryContact={startCaseInternalHelper.showPrimaryContact}
              showSecondaryContact={
                startCaseInternalHelper.showSecondaryContact
              }
              useSameAsPrimary={true}
              onBlur="validatePetitionFromPaperSequence"
              onChange="updateFormValueAndCaseCaptionSequence"
            />
          </div>
        )}
      </div>
    );
  },
);
