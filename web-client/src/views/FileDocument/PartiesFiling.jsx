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
        <h2 className="margin-top-4">
          Tell Us About the Parties Filing This Document
        </h2>
        <div className="blue-container">
          <div
            className={`usa-form-group margin-bottom-0 ${
              fileDocumentHelper.partyValidationError
                ? 'usa-form-group--error'
                : ''
            }`}
          >
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="with-hint" id="who-legend">
                Who Is Filing This Document?
              </legend>
              <span className="usa-hint">Check all that apply</span>
              {fileDocumentHelper.showPractitionerParty && (
                <div className="usa-checkbox">
                  <input
                    aria-describedby="who-legend"
                    checked={form.partyPractitioner || false}
                    className="usa-checkbox__input"
                    id="party-practitioner"
                    name="partyPractitioner"
                    type="checkbox"
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      validateExternalDocumentInformationSequence();
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="party-practitioner"
                  >
                    Myself as Petitioner’s Counsel
                  </label>
                </div>
              )}
              <div className="usa-checkbox">
                <input
                  aria-describedby="who-legend"
                  checked={form.partyPrimary || false}
                  className="usa-checkbox__input"
                  id="party-primary"
                  name="partyPrimary"
                  type="checkbox"
                  onChange={e => {
                    updateFileDocumentWizardFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    validateExternalDocumentInformationSequence();
                  }}
                />
                <label className="usa-checkbox__label" htmlFor="party-primary">
                  {fileDocumentHelper.partyPrimaryLabel}
                </label>
              </div>
              {fileDocumentHelper.showSecondaryParty && (
                <div className="usa-checkbox">
                  <input
                    aria-describedby="who-legend"
                    checked={form.partySecondary || false}
                    className="usa-checkbox__input"
                    id="party-secondary"
                    name="partySecondary"
                    type="checkbox"
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      validateExternalDocumentInformationSequence();
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="party-secondary"
                  >
                    {caseDetail.contactSecondary.name}
                  </label>
                </div>
              )}
              <div className="usa-checkbox">
                <input
                  aria-describedby="who-legend"
                  checked={form.partyRespondent || false}
                  className="usa-checkbox__input"
                  id="party-respondent"
                  name="partyRespondent"
                  type="checkbox"
                  onChange={e => {
                    updateFileDocumentWizardFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    validateExternalDocumentInformationSequence();
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor="party-respondent"
                >
                  Respondent
                </label>
              </div>
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
