import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const MultiDocumentPartiesFiling = connect(
  {
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
  },
  ({
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
          <FormGroup errorText={fileDocumentHelper.partyValidationError}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="with-hint" id="who-legend">
                Who are you filing the document(s) for?
              </legend>
              <span className="usa-hint">Check all that apply.</span>
              {fileDocumentHelper.selectedCasesAsCase.map(
                (formattedConsolidatedCase, index) => (
                  <React.Fragment key={index}>
                    <legend
                      className="with-hint"
                      id={`who-legend-${formattedConsolidatedCase.docketNumber}`}
                    >
                      {formattedConsolidatedCase.docketNumber}{' '}
                      {formattedConsolidatedCase.caseCaption}
                    </legend>

                    <div className="usa-checkbox">
                      <input
                        aria-describedby={`who-legend-${formattedConsolidatedCase.docketNumber}`}
                        checked={
                          (form.casesParties &&
                            form.casesParties[
                              formattedConsolidatedCase.docketNumber
                            ] &&
                            form.casesParties[
                              formattedConsolidatedCase.docketNumber
                            ].partyPrimary) ||
                          false
                        }
                        className="usa-checkbox__input"
                        id={`party-primary-${formattedConsolidatedCase.docketNumber}`}
                        name={`casesParties.${formattedConsolidatedCase.docketNumber}.partyPrimary`}
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
                        htmlFor={`party-primary-${formattedConsolidatedCase.docketNumber}`}
                      >
                        {formattedConsolidatedCase.contactPrimary.name},
                        Petitioner
                      </label>
                    </div>
                    {formattedConsolidatedCase.showSecondaryParty && (
                      <div className="usa-checkbox">
                        <input
                          aria-describedby={`who-legend-${formattedConsolidatedCase.docketNumber}`}
                          checked={
                            (form.casesParties &&
                              form.casesParties[
                                formattedConsolidatedCase.docketNumber
                              ] &&
                              form.casesParties[
                                formattedConsolidatedCase.docketNumber
                              ].partySecondary) ||
                            false
                          }
                          className="usa-checkbox__input"
                          id={`party-secondary-${formattedConsolidatedCase.docketNumber}`}
                          name={`casesParties.${formattedConsolidatedCase.docketNumber}.partySecondary`}
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
                          htmlFor={`party-secondary-${formattedConsolidatedCase.docketNumber}`}
                        >
                          {formattedConsolidatedCase.contactSecondary.name},
                          Petitioner
                        </label>
                      </div>
                    )}
                    <hr />
                  </React.Fragment>
                ),
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
          </FormGroup>
        </div>
      </React.Fragment>
    );
  },
);
