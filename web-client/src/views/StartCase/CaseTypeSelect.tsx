import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const CaseTypeSelect = connect(
  {
    allowDefaultOption: props.allowDefaultOption,
    caseTypes: props.caseTypes,
    hint: props.hint,
    legend: props.legend,
    name: props.name,
    onChange: sequences[props.onChange],
    onChangePreValidation: sequences[props.onChangePreValidation],
    validation: sequences[props.validation],
    validationError: props.validationError,
    validationErrors: state.validationErrors,
    value: props.value,
  },
  function CaseTypeSelect({
    allowDefaultOption,
    caseTypes,
    className,
    hint,
    legend,
    name,
    onChange,
    onChangePreValidation,
    validation,
    validationError,
    validationErrors,
    value,
  }) {
    return (
      <div className={classNames('subsection', className)}>
        <FormGroup
          className="case-type-select"
          errorText={(validationError || validationErrors).caseType}
        >
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="usa-legend" id="case-type-select-legend">
              {legend} {hint && <span className="usa-hint">{hint}</span>}
            </legend>
            <select
              aria-labelledby="case-type-select-legend"
              className="usa-select"
              data-testid="case-type-select"
              id="case-type"
              name={name || 'caseType'}
              value={value}
              onChange={e => {
                onChange({
                  key: e.target.name,
                  property: 'caseType',
                  value: e.target.value,
                });
                if (onChangePreValidation) onChangePreValidation();
                if (validation) validation();
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

CaseTypeSelect.displayName = 'CaseTypeSelect';
