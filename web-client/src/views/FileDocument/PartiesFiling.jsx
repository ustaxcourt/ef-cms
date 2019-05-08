import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PartiesFiling = connect(
  {
    caseDetail: state.formattedCaseDetail,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
  },
  ({
    caseDetail,
    fileDocumentHelper,
    form,
    updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence,
  }) => {
    return (
      <React.Fragment>
        <h3>Tell Us About the Parties Filing This Document</h3>
        <div className="blue-container">
          <div
            className={`usa-form-group ${
              fileDocumentHelper.partyValidationError ? 'usa-input-error' : ''
            }`}
          >
            <fieldset className="usa-fieldset-inputs usa-sans">
              <legend className="with-hint" id="who-legend">
                Who Is Filing This Document?
              </legend>
              <span className="usa-form-hint">Check all that apply.</span>
              <ul className="ustc-vertical-option-list">
                {fileDocumentHelper.showPractitionerParty && (
                  <li>
                    <input
                      id="party-practitioner"
                      type="checkbox"
                      name="partyPractitioner"
                      aria-describedby="who-legend"
                      checked={form.partyPractitioner || false}
                      onChange={e => {
                        updateFileDocumentWizardFormValueSequence({
                          key: e.target.name,
                          value: e.target.checked,
                        });
                        validateExternalDocumentInformationSequence();
                      }}
                    />
                    <label htmlFor="party-practitioner" className="usa-label">
                      Myself as Petitioner’s Counsel
                    </label>
                  </li>
                )}
                <li>
                  <input
                    id="party-primary"
                    type="checkbox"
                    name="partyPrimary"
                    aria-describedby="who-legend"
                    checked={form.partyPrimary || false}
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      validateExternalDocumentInformationSequence();
                    }}
                  />
                  <label htmlFor="party-primary" className="usa-label">
                    {fileDocumentHelper.partyPrimaryLabel}
                  </label>
                </li>
                {fileDocumentHelper.showSecondaryParty && (
                  <li>
                    <input
                      id="party-secondary"
                      type="checkbox"
                      aria-describedby="who-legend"
                      name="partySecondary"
                      checked={form.partySecondary || false}
                      onChange={e => {
                        updateFileDocumentWizardFormValueSequence({
                          key: e.target.name,
                          value: e.target.checked,
                        });
                        validateExternalDocumentInformationSequence();
                      }}
                    />
                    <label htmlFor="party-secondary" className="usa-label">
                      {caseDetail.contactSecondary.name}
                    </label>
                  </li>
                )}
                {fileDocumentHelper.showRespondentParty && (
                  <li>
                    <input
                      id="party-respondent"
                      type="checkbox"
                      aria-describedby="who-legend"
                      name="partyRespondent"
                      checked={form.partyRespondent || false}
                      onChange={e => {
                        updateFileDocumentWizardFormValueSequence({
                          key: e.target.name,
                          value: e.target.checked,
                        });
                        validateExternalDocumentInformationSequence();
                      }}
                    />
                    <label htmlFor="party-respondent" className="usa-label">
                      Respondent
                    </label>
                  </li>
                )}
              </ul>
            </fieldset>
            {fileDocumentHelper.partyValidationError && (
              <span className="usa-input-error-message">
                {fileDocumentHelper.partyValidationError}
              </span>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  },
);
