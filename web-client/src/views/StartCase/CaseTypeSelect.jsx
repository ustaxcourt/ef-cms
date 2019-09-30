import { ValidationText } from '../../ustc-ui/Text/ValidationText';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';
import classnames from 'classnames';

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
    className,
    legend,
    onChange,
    validation,
    validationErrors,
    value,
  }) => {
    return (
      <div className={classnames('subsection', className)}>
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
          <ValidationText field="caseType" />
        </div>
      </div>
    );
  },
);
