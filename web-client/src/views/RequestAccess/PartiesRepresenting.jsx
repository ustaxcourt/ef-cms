import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PartiesRepresenting = connect(
  {
    form: state.form,
    formattedCaseDetail: state.formattedCaseDetail,
    requestAccessHelper: state.requestAccessHelper,
    updateCaseAssociationFormValueSequence:
      sequences.updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence:
      sequences.validateCaseAssociationRequestSequence,
  },
  ({
    form,
    formattedCaseDetail,
    requestAccessHelper,
    updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence,
  }) => {
    return (
      <React.Fragment>
        <h2 className="margin-top-4">
          Tell Us About the Parties You’re Representing
        </h2>
        <div className="blue-container">
          <FormGroup errorText={requestAccessHelper.partyValidationError}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="with-hint" id="who-legend">
                Who are you representing?
              </legend>
              <span className="usa-hint">Check all that apply</span>
              <div className="usa-checkbox">
                <input
                  aria-describedby="who-legend"
                  checked={form.representingPrimary || false}
                  className="usa-checkbox__input"
                  id="party-primary"
                  name="representingPrimary"
                  type="checkbox"
                  onChange={e => {
                    updateCaseAssociationFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    validateCaseAssociationRequestSequence();
                  }}
                />
                <label className="usa-checkbox__label" htmlFor="party-primary">
                  {formattedCaseDetail.contactPrimary.name}, Petitioner
                </label>
              </div>
              {requestAccessHelper.showSecondaryParty && (
                <div className="usa-checkbox">
                  <input
                    aria-describedby="who-legend"
                    checked={form.representingSecondary || false}
                    className="usa-checkbox__input"
                    id="party-secondary"
                    name="representingSecondary"
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
                    htmlFor="party-secondary"
                  >
                    {formattedCaseDetail.contactSecondary.name}, Petitioner
                  </label>
                </div>
              )}
            </fieldset>
          </FormGroup>
        </div>
      </React.Fragment>
    );
  },
);
