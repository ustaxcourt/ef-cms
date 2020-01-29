import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditDocketEntryMetaTabService = connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.modal.validationErrors,
    validationSequence: sequences.validateDocketRecordSequence,
  },
  ({ form, updateFormValueSequence, validationErrors, validationSequence }) => {
    return (
      <div className="blue-container">
        <FormGroup
          errorText={validationErrors && validationErrors.servedPartiesCode}
        >
          <fieldset
            className="usa-fieldset margin-bottom-2"
            id="served-parties-radios"
          >
            <legend htmlFor="served-parties-radios">Parties Served</legend>
            <div className="usa-radio">
              <input
                aria-describedby="served-parties-radios"
                checked={form.eventCode === 'P'}
                className="usa-radio__input"
                id="served-parties-p"
                name="eventCode"
                type="radio"
                value="P"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validationSequence();
                }}
              />
              <label
                className="usa-radio__label"
                htmlFor="served-parties-p"
                id="served-parties-p-label"
              >
                Petitioner
              </label>
            </div>
            <div className="usa-radio">
              <input
                aria-describedby="served-parties-radios"
                checked={form.eventCode === 'R'}
                className="usa-radio__input"
                id="served-parties-r"
                name="eventCode"
                type="radio"
                value="R"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validationSequence();
                }}
              />
              <label
                className="usa-radio__label"
                htmlFor="served-parties-pr"
                id="served-parties-r-label"
              >
                Respondent
              </label>
            </div>
            <div className="usa-radio">
              <input
                aria-describedby="served-parties-radios"
                checked={form.eventCode === 'B'}
                className="usa-radio__input"
                id="served-parties-b"
                name="eventCode"
                type="radio"
                value="B"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validationSequence();
                }}
              />
              <label
                className="usa-radio__label"
                htmlFor="served-parties-b"
                id="served-parties-b-label"
              >
                Both
              </label>
            </div>
          </fieldset>
        </FormGroup>
      </div>
    );
  },
);
