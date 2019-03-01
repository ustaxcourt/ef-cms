import { connect } from '@cerebral/react';
import { state, sequences } from 'cerebral';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Contacts } from '../StartCase/Contacts';

export const PartyInformation = connect(
  {
    caseDetail: state.caseDetail,
    updateCasePartyTypeSequence: sequences.updateCasePartyTypeSequence,
    caseDetailEditHelper: state.caseDetailEditHelper,
    baseUrl: state.baseUrl,
    token: state.token,
    submitCaseDetailEditSaveSequence:
      sequences.submitCaseDetailEditSaveSequence,
  },
  ({
    caseDetail,
    updateCasePartyTypeSequence,
    caseDetailEditHelper,
    baseUrl,
    token,
    submitCaseDetailEditSaveSequence,
  }) => {
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

        {caseDetailEditHelper.showOwnershipDisclosureStatement &&
          caseDetailEditHelper.ownershipDisclosureStatementDocumentId && (
            <React.Fragment>
              <div className="usa-form-group">
                <label htmlFor="ods-link">Ownership Disclosure Statement</label>
                <a
                  href={`${baseUrl}/documents/${
                    caseDetailEditHelper.ownershipDisclosureStatementDocumentId
                  }/documentDownloadUrl?token=${token}`}
                  aria-label="View PDF"
                >
                  <FontAwesomeIcon icon="file-pdf" />
                  Ownership Disclosure Statement
                </a>
              </div>
              <div className="order-checkbox">
                <input
                  id="order-for-ods"
                  type="checkbox"
                  name="orderForOds"
                  onChange={e => {
                    submitCaseDetailEditSaveSequence({
                      key: e.target.name,
                      value: e.target.checked ? true : undefined,
                    });
                  }}
                />
                <label htmlFor="order-for-ods">
                  Order for Ownership Disclosure Statement
                </label>
              </div>
            </React.Fragment>
          )}

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
