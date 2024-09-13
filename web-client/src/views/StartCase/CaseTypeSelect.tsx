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
    errorMessageId: props.errorMessageId,
    hint: props.hint,
    legend: props.legend,
    name: props.name,
    onBlurSequence: props.onBlurSequence,
    onChange: sequences[props.onChange],
    onChangePreValidation: sequences[props.onChangePreValidation],
    rawOnChange: props.onChange,
    refProp: props.refProp,
    validationError: props.validationError,
    validationErrors: state.validationErrors,
    validationFunction: props.validationFunction,
    value: props.value,
  },
  function CaseTypeSelect({
    allowDefaultOption,
    caseTypes,
    className,
    errorMessageId,
    hint,
    legend,
    name,
    onBlurSequence,
    onChange,
    onChangePreValidation,
    rawOnChange,
    refProp,
    validationError,
    validationErrors,
    validationFunction,
    value,
  }) {
    return (
      <div className={classNames('subsection', className)}>
        <FormGroup
          className="case-type-select"
          errorMessageId={errorMessageId}
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
              ref={refProp}
              value={value}
              onBlur={onBlurSequence}
              onChange={e => {
                (onChange || rawOnChange)({
                  key: e.target.name,
                  property: 'caseType',
                  value: e.target.value,
                });
                if (onChangePreValidation) onChangePreValidation();
                if (validationFunction) validationFunction();
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
