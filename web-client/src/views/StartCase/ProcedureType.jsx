import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const ProcedureType = connect(
  {
    legend: props.legend,
    onChange: props.onChange,
    procedureTypes: state.procedureTypes,
    validateStartCaseSequence: sequences.validateStartCaseSequence,
    validationErrors: state.validationErrors,
    value: props.value,
  },
  ({ procedureTypes, value, validationErrors, onChange, legend }) => {
    return (
      <div
        className={
          validationErrors.procedureType ? 'usa-form-group--error' : ''
        }
      >
        <fieldset id="procedure-type-radios" className="usa-fieldset">
          <legend>{legend}</legend>
          <div className="usa-radio">
            {procedureTypes.map((procedureType, idx) => (
              <>
                <input
                  id={procedureType}
                  data-type={procedureType}
                  type="radio"
                  name="procedureType"
                  className="usa-radio__input"
                  checked={value === procedureType}
                  value={procedureType}
                  onChange={onChange}
                />
                <label
                  id={`proc-type-${idx}`}
                  htmlFor={procedureType}
                  className="usa-radio__label"
                >
                  {procedureType} case
                </label>
              </>
            ))}
          </div>
        </fieldset>
      </div>
    );
  },
);
