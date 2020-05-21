import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const CaseTypeSelect = connect(
  {
    allowDefaultOption: props.allowDefaultOption,
    caseTypes: props.caseTypes,
    legend: props.legend,
    onChange: sequences[props.onChange],
    onChangePreValidation: sequences[props.onChangePreValidation],
    validation: sequences[props.validation],
    validationErrors: state.validationErrors,
    value: props.value,
  },
  function CaseTypeSelect({
    allowDefaultOption,
    caseTypes,
    className,
    legend,
    onChange,
    onChangePreValidation,
    validation,
    validationErrors,
    value,
  }) {
    return (
      <div className={classNames('subsection', className)}>
        <FormGroup
          className="case-type-select"
          errorText={validationErrors.caseType}
        >
          <fieldset className="usa-fieldset margin-bottom-0">
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
                if (onChangePreValidation) onChangePreValidation();
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
        </FormGroup>
      </div>
    );
  },
);
