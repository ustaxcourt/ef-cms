import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type ProcedureTypeType = {
  legend: string;
  onChange: (event: any) => void;
  value: string;
};

const procedureTypeDependencies = {
  PROCEDURE_TYPES: state.constants.PROCEDURE_TYPES,
  validationErrors: state.validationErrors,
};
export const ProcedureType = connect<
  ProcedureTypeType,
  typeof procedureTypeDependencies
>(
  procedureTypeDependencies,
  function ProcedureType({
    legend,
    onChange,
    PROCEDURE_TYPES,
    validationErrors,
    value,
  }) {
    return (
      <FormGroup
        errorMessageId="procedure-type-error-message"
        errorText={validationErrors.procedureType}
      >
        <fieldset
          className="usa-fieldset margin-bottom-0"
          id="procedure-type-radios"
        >
          <legend className="usa-legend" id="procedure-type-legend">
            {legend}
          </legend>
          {PROCEDURE_TYPES.map(procedureType => (
            <div className="usa-radio usa-radio__inline" key={procedureType}>
              <input
                aria-describedby="procedure-type-legend"
                aria-labelledby={`procedure-type-${procedureType}`}
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
                data-testid={`procedure-type-${procedureType}-radio`}
                htmlFor={procedureType}
                id={`procedure-type-${procedureType}`}
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
