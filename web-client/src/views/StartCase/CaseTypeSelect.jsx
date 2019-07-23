import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const CaseTypeSelect = connect(
  {
    allowDefaultOption: props.allowDefaultOption,
    caseTypes: props.caseTypes,
    legend: props.legend,
    onChange: sequences[props.onChange],
    validation: sequences[props.validation],
    validationErrors: state.validationErrors,
    value: props.value,
  },
  ({
    allowDefaultOption,
    caseTypes,
    legend,
    onChange,
    validation,
    validationErrors,
    value,
  }) => {
    return (
      <div className="subsection">
        <div
          className={
            'usa-form-group case-type-select ' +
            (validationErrors.caseType ? 'usa-form-group--error' : '')
          }
        >
          <fieldset className="usa-fieldset">
            <legend className="usa-legend" id="case-type-select-legend">
              {legend}
            </legend>
            <select
              aria-labelledby="case-type-select-legend"
              className="usa-select"
              id="case-type"
              name="caseType"
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
          <Text
            bind="validationErrors.caseType"
            className="usa-error-message"
          />
        </div>
      </div>
    );
  },
);
