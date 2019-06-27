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
  ({ legend, onChange, procedureTypes, validationErrors, value }) => {
    return (
      <div
        className={
          validationErrors.procedureType
            ? 'usa-form-group usa-form-group--error'
            : 'usa-form-group'
        }
      >
        <fieldset className="usa-fieldset" id="procedure-type-radios">
          <legend className="usa-legend">{legend}</legend>
          {procedureTypes.map((procedureType, idx) => (
            <div className="usa-radio usa-radio__inline" key={procedureType}>
              <input
                checked={value === procedureType}
                className="usa-radio__input"
                data-type={procedureType}
                id={procedureType}
                name="procedureType"
                type="radio"
                value={procedureType}
                onChange={onChange}
              />
              <label
                className="usa-radio__label"
                htmlFor={procedureType}
                id={`proc-type-${idx}`}
              >
                {procedureType} case
              </label>
            </div>
          ))}
        </fieldset>
      </div>
    );
  },
);
