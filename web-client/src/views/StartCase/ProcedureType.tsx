import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ProcedureType = connect(
  {
    PROCEDURE_TYPES: state.constants.PROCEDURE_TYPES,
    legend: props.legend,
    onChange: props.onChange,
    validationErrors: state.validationErrors,
    value: props.value,
  },
  function ProcedureType({
    legend,
    onChange,
    PROCEDURE_TYPES,
    validationErrors,
    value,
  }) {
    return (
      <FormGroup errorText={validationErrors.procedureType}>
        <fieldset
          className="usa-fieldset margin-bottom-0"
          id="procedure-type-radios"
        >
          <legend className="usa-legend" id="procedure-type-legend">
            {legend}
          </legend>
          {PROCEDURE_TYPES.map((procedureType, idx) => (
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
                data-testid={`procedure-type-${idx}`}
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

ProcedureType.displayName = 'ProcedureType';
