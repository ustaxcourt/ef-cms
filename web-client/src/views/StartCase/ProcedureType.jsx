import { connect } from '@cerebral/react';
import { sequences, state, props } from 'cerebral';
import React from 'react';

export const ProcedureType = connect(
  {
    procedureTypes: state.procedureTypes,
    onChange: props.onChange,
    value: props.value,
    validationErrors: state.validationErrors,
    validateStartCaseSequence: sequences.validateStartCaseSequence,
    legend: props.legend,
  },
  ({ procedureTypes, value, validationErrors, onChange, legend }) => {
    return (
      <div className={validationErrors.procedureType ? 'usa-input-error' : ''}>
        <fieldset
          id="procedure-type-radios"
          className="usa-fieldset-inputs usa-sans"
        >
          <legend>{legend}</legend>
          <ul className="usa-unstyled-list">
            {procedureTypes.map((procedureType, idx) => (
              <li key={procedureType}>
                <input
                  id={procedureType}
                  data-type={procedureType}
                  type="radio"
                  name="procedureType"
                  checked={value === procedureType}
                  value={procedureType}
                  onChange={onChange}
                />
                <label id={`proc-type-${idx}`} htmlFor={procedureType}>
                  {procedureType} case
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      </div>
    );
  },
);
