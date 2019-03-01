import { connect } from '@cerebral/react';
import { sequences, state, props } from 'cerebral';
import React from 'react';

export const CaseTypeSelect = connect(
  {
    caseTypes: props.caseTypes,
    legend: props.legend,
    value: props.value,
    allowDefaultOption: props.allowDefaultOption || true,
    onChange: sequences[props.onChange],
    validation: sequences[props.validation],
    validationErrors: state.validationErrors,
  },
  ({
    caseTypes,
    legend,
    value,
    allowDefaultOption,
    onChange,
    validation,
    validationErrors,
  }) => {
    return (
      <div
        className={
          'usa-form-group case-type-select ' +
          (validationErrors.caseType ? 'usa-input-error' : '')
        }
      >
        <fieldset>
          <legend>{legend}</legend>
          <select
            name="caseType"
            id="case-type"
            aria-labelledby="case-type"
            value={value}
            onChange={e => {
              onChange({
                key: e.target.name,
                value: e.target.value,
              });
              validation();
            }}
          >
            {allowDefaultOption && <option value="">-- Select --</option>}
            {caseTypes.map(caseType => (
              <option
                key={caseType.type || caseType}
                value={caseType.type || caseType}
              >
                {caseType.description || caseType}
              </option>
            ))}
          </select>
        </fieldset>
        <div className="usa-input-error-message beneath">
          {validationErrors.caseType}
        </div>
      </div>
    );
  },
);
