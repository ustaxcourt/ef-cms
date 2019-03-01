import { connect } from '@cerebral/react';
import { state, sequences } from 'cerebral';
import React from 'react';
import { Contacts } from '../StartCase/Contacts';

export const CaseDetailEditPartyInformation = connect(
  {
    caseDetail: state.caseDetail,
    updateCasePartyTypeSequence: sequences.updateCasePartyTypeSequence,
    caseDetailEditHelper: state.caseDetailEditHelper,
  },
  ({ caseDetail, updateCasePartyTypeSequence, caseDetailEditHelper }) => {
    return (
      <div className="blue-container document-detail-one-third">
        <div className="usa-form-group">
          <label htmlFor="party-type">Party Type</label>
          <select
            className="usa-input-inline"
            id="party-type"
            name="partyType"
            value={caseDetail.partyType}
            onChange={e => {
              updateCasePartyTypeSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          >
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

        <Contacts
          parentView="CaseDetail"
          bind="caseDetail"
          emailBind="caseDetail.contactPrimary"
          onChange="updateCaseValueSequence"
          onBlur="validateStartCaseSequence"
          contactsHelper="caseDetailEditContactsHelper"
          showPrimaryContact={caseDetailEditHelper.showPrimaryContact}
          showSecondaryContact={caseDetailEditHelper.showSecondaryContact}
        />
      </div>
    );
  },
);
