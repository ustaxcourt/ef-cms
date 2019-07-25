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
          Tell Us About the Parties Filing The Document(s)
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
                Who are you filing the document(s) for?
              </legend>
              <span className="usa-hint">Check all that apply.</span>
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
                  {caseDetail.contactPrimary.name}, Petitioner
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
                    {caseDetail.contactSecondary.name}, Petitioner
                  </label>
                </div>
              )}
              {fileDocumentHelper.showPractitionerParty &&
                caseDetail.practitioners.map((practitioner, idx) => {
                  return (
                    <div className="usa-checkbox" key={idx}>
                      <input
                        aria-describedby="who-legend"
                        checked={
                          (form.practitioner[idx] &&
                            form.practitioner[idx].partyPractitioner) ||
                          false
                        }
                        className="usa-checkbox__input"
                        id={`party-practitioner-${idx}`}
                        name={`practitioner.${idx}`}
                        type="checkbox"
                        onChange={e => {
                          updateFileDocumentWizardFormValueSequence({
                            key: e.target.name,
                            value: {
                              name: practitioner.name,
                              partyPractitioner: e.target.checked,
                            },
                          });
                          validateExternalDocumentInformationSequence();
                        }}
                      />
                      <label
                        className="usa-checkbox__label"
                        htmlFor={`party-practitioner-${idx}`}
                      >
                        {practitioner.name}, Counsel
                      </label>
                    </div>
                  );
                })}
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
