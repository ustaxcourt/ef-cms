import { Contacts } from '../StartCase/Contacts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PartyInformation = connect(
  {
    baseUrl: state.baseUrl,
    caseDetailEditHelper: state.caseDetailEditHelper,
    form: state.form,
    token: state.token,
    updateCasePartyTypeSequence: sequences.updateCasePartyTypeSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function PartyInformation({
    baseUrl,
    caseDetailEditHelper,
    form,
    token,
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
            <div className="usa-form-group">
              <span className="usa-label">Ownership Disclosure Statement</span>
              {caseDetailEditHelper.ownershipDisclosureStatementDocumentId && (
                <a
                  aria-label="View PDF: Ownership Disclosure Statement"
                  href={`${baseUrl}/case-documents/${form.caseId}/${caseDetailEditHelper.ownershipDisclosureStatementDocumentId}/document-download-url?token=${token}`}
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
                <label
                  className="usa-checkbox__label inline-block"
                  htmlFor="order-for-ods"
                >
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
              onChange="updateCaseValueAndInternalCaseCaptionSequence"
            />
          </div>
        )}
      </div>
    );
  },
);
