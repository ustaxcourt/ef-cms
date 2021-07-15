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
  function PartiesFiling({
    fileDocumentHelper,
    form,
    formattedCaseDetail,
    updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence,
  }) {
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
              {formattedCaseDetail.petitioners.map(petitioner => (
                <div className="usa-checkbox" key={petitioner.contactId}>
                  <input
                    checked={form.filersMap[petitioner.contactId] || false}
                    className="usa-checkbox__input"
                    id={`filing-${petitioner.contactId}`}
                    name={`filersMap.${petitioner.contactId}`}
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
                    htmlFor={`filing-${petitioner.contactId}`}
                  >
                    {petitioner.displayName}
                  </label>
                </div>
              ))}
              <div className="usa-checkbox">
                <input
                  aria-describedby="who-legend"
                  checked={form.partyIrsPractitioner || false}
                  className="usa-checkbox__input"
                  id="party-irs-practitioner"
                  name="partyIrsPractitioner"
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
                  htmlFor="party-irs-practitioner"
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
