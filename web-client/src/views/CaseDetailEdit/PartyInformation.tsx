import { Contacts } from '../StartCase/Contacts';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PartyInformation = connect(
  {
    form: state.form,
    startCaseInternalContactsHelper: state.startCaseInternalContactsHelper,
    updateCasePartyTypeSequence: sequences.updateCasePartyTypeSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function PartyInformation({
    form,
    startCaseInternalContactsHelper,
    updateCasePartyTypeSequence,
    updateFormValueSequence,
  }) {
    return (
      <div className="blue-container document-detail-one-third">
        <div className="subsection party-type">
          <div className="usa-form-group">
            <label className="usa-label" htmlFor="party-type">
              Party type
            </label>
            <select
              className="usa-select"
              id="party-type"
              name="partyType"
              value={form.partyType}
              onChange={e => {
                updateCasePartyTypeSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            >
              <option value="">- Select -</option>
              {Object.keys(startCaseInternalContactsHelper.partyTypes).map(
                partyType => (
                  <option
                    key={partyType}
                    value={
                      startCaseInternalContactsHelper.partyTypes[partyType]
                    }
                  >
                    {startCaseInternalContactsHelper.partyTypes[partyType]}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>
        {startCaseInternalContactsHelper.showOwnershipDisclosureStatement && (
          <div className="subsection">
            <FormGroup>
              <div className="order-checkbox">
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
            </FormGroup>
          </div>
        )}
        {(startCaseInternalContactsHelper.showPrimaryContact ||
          startCaseInternalContactsHelper.showSecondaryContact) && (
          <div className="subsection contacts">
            <Contacts
              bind="form"
              contactsHelper="internalPetitionPartiesHelper"
              parentView="CaseDetail"
              showPrimaryContact={
                startCaseInternalContactsHelper.showPrimaryContact
              }
              showSecondaryContact={
                startCaseInternalContactsHelper.showSecondaryContact
              }
              useSameAsPrimary={true}
              onBlur="validateCaseDetailSequence"
              onChange="updateFormValueAndCaseCaptionSequence"
            />
          </div>
        )}
      </div>
    );
  },
);

PartyInformation.displayName = 'PartyInformation';
