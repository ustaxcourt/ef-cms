import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React from 'react';

export const ProcedureType = connect(
  {
    legend: props.legend,
    onChange: props.onChange,
    procedureTypes: state.procedureTypes,
    validationErrors: state.validationErrors,
    value: props.value,
  },
  ({ legend, onChange, procedureTypes, validationErrors, value }) => {
    return (
      <FormGroup errorText={validationErrors.procedureType}>
        <fieldset
          className="usa-fieldset margin-bottom-0"
          id="procedure-type-radios"
        >
          <legend className="usa-legend" id="procedure-type-legend">
            {legend}
          </legend>
          {procedureTypes.map((procedureType, idx) => (
            <div className="usa-radio usa-radio__inline" key={procedureType}>
              <input
                aria-describedby="procedure-type-legend"
                aria-labelledby={`procedure-type-${idx}`}
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
                id={`procedure-type-${idx}`}
              >
                {procedureType} case
              </label>
            </div>
          ))}
        </fieldset>
      </FormGroup>
    );
  },
);
