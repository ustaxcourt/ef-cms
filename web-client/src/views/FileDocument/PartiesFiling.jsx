import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PartiesFiling = connect(
  {
    caseDetail: state.formattedCaseDetail,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
  },
  ({
    caseDetail,
    fileDocumentHelper,
    form,
    updateFormValueSequence,
    validateExternalDocumentInformationSequence,
  }) => {
    return (
      <React.Fragment>
        <h3>Tell Us About the Parties Filing This Document</h3>
        <div className="blue-container">
          <div
            className={`ustc-form-group ${
              fileDocumentHelper.partyValidationError ? 'usa-input-error' : ''
            }`}
          >
            <fieldset className="usa-fieldset-inputs usa-sans">
              <legend className="with-hint">
                Who Is Filing This Document?
              </legend>
              <span className="usa-form-hint">Check all that apply.</span>
              <ul className="ustc-vertical-option-list">
                <li>
                  <input
                    id="party-primary"
                    type="checkbox"
                    name="partyPrimary"
                    checked={form.partyPrimary || false}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      validateExternalDocumentInformationSequence();
                    }}
                  />
                  <label htmlFor="party-primary">Myself</label>
                </li>
                {fileDocumentHelper.showSecondaryParty && (
                  <li>
                    <input
                      id="party-secondary"
                      type="checkbox"
                      name="partySecondary"
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.checked,
                        });
                        validateExternalDocumentInformationSequence();
                      }}
                    />
                    <label htmlFor="party-secondary">
                      {caseDetail.contactSecondary.name}
                    </label>
                  </li>
                )}
                <li>
                  <input
                    id="party-respondent"
                    type="checkbox"
                    name="partyRespondent"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      validateExternalDocumentInformationSequence();
                    }}
                  />
                  <label htmlFor="party-respondent">Respondent</label>
                </li>
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
