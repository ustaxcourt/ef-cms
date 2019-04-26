import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PartiesRepresenting = connect(
  {
    caseDetail: state.formattedCaseDetail,
    form: state.form,
    requestAccessHelper: state.requestAccessHelper,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
  },
  ({
    caseDetail,
    requestAccessHelper,
    form,
    updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence,
  }) => {
    return (
      <React.Fragment>
        <h3>Tell Us About the Parties You’re Representing</h3>
        <div className="blue-container">
          <div
            className={`ustc-form-group ${
              requestAccessHelper.partyValidationError ? 'usa-input-error' : ''
            }`}
          >
            <fieldset className="usa-fieldset-inputs usa-sans">
              <legend className="with-hint" id="who-legend">
                Who Are You Representing?
              </legend>
              <span className="usa-form-hint">Check all that apply.</span>
              <ul className="ustc-vertical-option-list">
                <li>
                  <input
                    id="party-primary"
                    type="checkbox"
                    name="partyPrimary"
                    aria-describedby="who-legend"
                    checked={form.partyPrimary}
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      validateExternalDocumentInformationSequence();
                    }}
                  />
                  <label htmlFor="party-primary">
                    {caseDetail.contactPrimary.name}
                  </label>
                </li>
                {requestAccessHelper.showSecondaryParty && (
                  <li>
                    <input
                      id="party-secondary"
                      type="checkbox"
                      aria-describedby="who-legend"
                      name="partySecondary"
                      checked={form.partySecondary}
                      onChange={e => {
                        updateFileDocumentWizardFormValueSequence({
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
              </ul>
            </fieldset>
            {requestAccessHelper.partyValidationError && (
              <span className="usa-input-error-message">
                {requestAccessHelper.partyValidationError}
              </span>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  },
);
