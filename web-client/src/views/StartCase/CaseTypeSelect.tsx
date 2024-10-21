import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

type CaseTypeSelectType = {
  allowDefaultOption: boolean;
  caseTypes:
    | {
        description: string;
        type: string;
      }[]
    | string[];
  className?: string;
  errorMessageId?: string;
  hint?: string;
  legend: string;
  name?: string;
  onBlur?: Function;
  onChange: Function;
  onChangePreValidation?: Function;
  refProp?: (element: any) => void;
  validationError?: { [key: string]: string | undefined };
  validateFormData?: Function;
  value?: string;
};

const caseTypeSelectDependencies = {
  validationErrors: state.validationErrors,
};

export const CaseTypeSelect = connect<
  CaseTypeSelectType,
  typeof caseTypeSelectDependencies
>(
  caseTypeSelectDependencies,
  function CaseTypeSelect({
    allowDefaultOption,
    caseTypes,
    className,
    errorMessageId,
    hint,
    legend,
    name,
    onBlur,
    onChange,
    onChangePreValidation,
    refProp,
    validateFormData,
    validationError,
    validationErrors,
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
              onBlur={onBlur}
              onChange={e => {
                onChange({
                  key: e.target.name,
                  property: 'caseType',
                  value: e.target.value,
                });
                if (onChangePreValidation) onChangePreValidation();
                if (validateFormData)
                  validateFormData({ preventAutoScroll: true });
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
