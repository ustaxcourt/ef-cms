import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PartiesRepresenting = connect(
  {
    form: state.form,
    formattedCaseDetail: state.formattedCaseDetail,
    updateCaseAssociationFormValueSequence:
      sequences.updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence:
      sequences.validateCaseAssociationRequestSequence,
    validationErrors: state.validationErrors,
  },
  function PartiesRepresenting({
    form,
    formattedCaseDetail,
    updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence,
    validationErrors,
  }) {
    return (
      <React.Fragment>
        <h2 className="margin-top-4">
          Tell Us About the Parties You’re Representing
        </h2>
        <div>
          <FormGroup errorText={validationErrors.filers}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="with-hint" id="who-legend">
                Who are you representing?
              </legend>
              <span className="usa-hint">Check all that apply</span>
              {formattedCaseDetail.petitioners.map(petitioner => (
                <div className="usa-checkbox" key={petitioner.contactId}>
                  <input
                    checked={form.filersMap[petitioner.contactId] || false}
                    className="usa-checkbox__input"
                    id={`filing-${petitioner.contactId}`}
                    name={`filersMap.${petitioner.contactId}`}
                    type="checkbox"
                    onChange={e => {
                      updateCaseAssociationFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      validateCaseAssociationRequestSequence();
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    data-testid={`filer-${petitioner.displayName}`}
                    htmlFor={`filing-${petitioner.contactId}`}
                  >
                    {petitioner.displayName}
                  </label>
                </div>
              ))}
            </fieldset>
          </FormGroup>
        </div>
      </React.Fragment>
    );
  },
);

PartiesRepresenting.displayName = 'PartiesRepresenting';
