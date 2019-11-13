import { sequences, state } from 'cerebral';

import { Contacts } from '../StartCase/Contacts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import React from 'react';

export const PartyInformation = connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.caseDetail,
    caseDetailEditHelper: state.caseDetailEditHelper,
    constants: state.constants,
    token: state.token,
    updateCasePartyTypeSequence: sequences.updateCasePartyTypeSequence,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
  },
  ({
    baseUrl,
    caseDetail,
    caseDetailEditHelper,
    constants,
    token,
    updateCasePartyTypeSequence,
    updateCaseValueSequence,
  }) => {
    return (
      <div className="blue-container document-detail-one-third">
        <div className="subsection">
          <div className="usa-form-group">
            <label className="usa-label" htmlFor="case-caption">
              Case caption
            </label>
            <textarea
              className="usa-textarea"
              id="case-caption"
              name="caseCaption"
              value={caseDetail.caseCaption}
              onChange={e => {
                updateCaseValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
            <span className="display-inline-block margin-top-1">
              {constants.CASE_CAPTION_POSTFIX}
            </span>
          </div>
        </div>
        <div className="subsection party-type">
          <div className="usa-form-group">
            <label className="usa-label" htmlFor="party-type">
              Party type
            </label>
            <select
              className="usa-select"
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
            <div className="usa-form-group">
              <label className="usa-label" htmlFor="ods-link">
                Ownership Disclosure Statement
              </label>
              {caseDetailEditHelper.ownershipDisclosureStatementDocumentId && (
                <a
                  aria-label="View PDF: Ownership Disclosure Statement"
                  href={`${baseUrl}/documents/${caseDetailEditHelper.ownershipDisclosureStatementDocumentId}/document-download-url?token=${token}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <FontAwesomeIcon className="fa-icon-blue" icon="file-pdf" />
                  Ownership Disclosure Statement
                </a>
              )}
              {!caseDetailEditHelper.ownershipDisclosureStatementDocumentId &&
                'No file uploaded'}
              <div className="order-checkbox">
                <input
                  checked={caseDetail.orderForOds}
                  className="usa-checkbox__input"
                  id="order-for-ods"
                  name="orderForOds"
                  type="checkbox"
                  onChange={e => {
                    updateCaseValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                  }}
                />
                <label className="usa-checkbox__label" htmlFor="order-for-ods">
                  Order for Ownership Disclosure Statement
                </label>
              </div>
            </div>
          </div>
        )}
        {(caseDetailEditHelper.showPrimaryContact ||
          caseDetailEditHelper.showSecondaryContact) && (
          <div className="subsection contacts">
            <Contacts
              bind="caseDetail"
              contactsHelper="caseDetailEditContactsHelper"
              emailBind="caseDetail.contactPrimary"
              parentView="CaseDetail"
              showPrimaryContact={caseDetailEditHelper.showPrimaryContact}
              showSecondaryContact={caseDetailEditHelper.showSecondaryContact}
              onBlur="validateCaseDetailSequence"
              onChange="updateCaseValueSequence"
            />
          </div>
        )}
      </div>
    );
  },
);
