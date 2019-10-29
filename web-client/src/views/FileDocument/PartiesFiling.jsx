import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PartiesFiling = connect(
  {
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    formattedCaseDetail: state.formattedCaseDetail,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
  },
  ({
    fileDocumentHelper,
    form,
    formattedCaseDetail,
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
                  {formattedCaseDetail.contactPrimary.name}, Petitioner
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
                    {formattedCaseDetail.contactSecondary.name}, Petitioner
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
          </FormGroup>
        </div>
      </React.Fragment>
    );
  },
);
