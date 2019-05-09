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
              fileDocumentHelper.partyValidationError ? 'usa-input--error' : ''
            }`}
          >
            <fieldset className="usa-fieldset">
              <legend className="with-hint" id="who-legend">
                Who Is Filing This Document?
              </legend>
              <span className="usa-form-hint">Check all that apply.</span>
              {fileDocumentHelper.showPractitionerParty && (
                <div className="usa-checkbox">
                  <input
                    id="party-practitioner"
                    type="checkbox"
                    name="partyPractitioner"
                    aria-describedby="who-legend"
                    className="usa-checkbox__input"
                    checked={form.partyPractitioner || false}
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      validateExternalDocumentInformationSequence();
                    }}
                  />
                  <label
                    htmlFor="party-practitioner"
                    className="usa-checkbox__label"
                  >
                    Myself as Petitioner’s Counsel
                  </label>
                </div>
              )}
              <div className="usa-checkbox">
                <input
                  id="party-primary"
                  type="checkbox"
                  name="partyPrimary"
                  aria-describedby="who-legend"
                  className="usa-checkbox__input"
                  checked={form.partyPrimary || false}
                  onChange={e => {
                    updateFileDocumentWizardFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    validateExternalDocumentInformationSequence();
                  }}
                />
                <label htmlFor="party-primary" className="usa-checkbox__label">
                  {fileDocumentHelper.partyPrimaryLabel}
                </label>
              </div>
              {fileDocumentHelper.showSecondaryParty && (
                <div className="usa-checkbox">
                  <input
                    id="party-secondary"
                    type="checkbox"
                    aria-describedby="who-legend"
                    name="partySecondary"
                    className="usa-checkbox__input"
                    checked={form.partySecondary || false}
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      validateExternalDocumentInformationSequence();
                    }}
                  />
                  <label
                    htmlFor="party-secondary"
                    className="usa-checkbox__label"
                  >
                    {caseDetail.contactSecondary.name}
                  </label>
                </div>
              )}
              {fileDocumentHelper.showRespondentParty && (
                <div className="usa-checkbox">
                  <input
                    id="party-respondent"
                    type="checkbox"
                    aria-describedby="who-legend"
                    name="partyRespondent"
                    className="usa-checkbox__input"
                    checked={form.partyRespondent || false}
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      validateExternalDocumentInformationSequence();
                    }}
                  />
                  <label
                    htmlFor="party-respondent"
                    className="usa-checkbox__label"
                  >
                    Respondent
                  </label>
                </div>
              )}
            </fieldset>
            {fileDocumentHelper.partyValidationError && (
              <span className="usa-error-message">
                {fileDocumentHelper.partyValidationError}
              </span>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  },
);
