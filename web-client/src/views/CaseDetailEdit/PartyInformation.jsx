import { Contacts } from '../StartCase/Contacts';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PartyInformation = connect(
  {
    caseDetailEditHelper: state.caseDetailEditHelper,
    form: state.form,
    updateCasePartyTypeSequence: sequences.updateCasePartyTypeSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function PartyInformation({
    caseDetailEditHelper,
    form,
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
              {Object.keys(caseDetailEditHelper.partyTypes).map(partyType => (
                <option
                  key={partyType}
                  value={caseDetailEditHelper.partyTypes[partyType]}
                >
                  {caseDetailEditHelper.partyTypes[partyType]}
                </option>
              ))}
            </select>
          </div>
        </div>
        {caseDetailEditHelper.showOwnershipDisclosureStatement && (
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
        {(caseDetailEditHelper.showPrimaryContact ||
          caseDetailEditHelper.showSecondaryContact) && (
          <div className="subsection contacts">
            <Contacts
              bind="form"
              contactsHelper="caseDetailEditContactsHelper"
              parentView="CaseDetail"
              showPrimaryContact={caseDetailEditHelper.showPrimaryContact}
              showSecondaryContact={caseDetailEditHelper.showSecondaryContact}
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
