import { connect } from '@cerebral/react';
import { sequences, state, props } from 'cerebral';
import React from 'react';

export const CaseTypeSelect = connect(
  {
    caseTypeDescriptionHelper: state.caseTypeDescriptionHelper,
    legend: props.legend,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
    validateStartCaseSequence: sequences.validateStartCaseSequence,
  },
  ({
    caseTypeDescriptionHelper,
    legend,
    updateFormValueSequence,
    validationErrors,
    validateStartCaseSequence,
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
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateStartCaseSequence();
            }}
          >
            <option value="">-- Select --</option>
            {caseTypeDescriptionHelper.caseTypes.map(caseType => (
              <option key={caseType.type} value={caseType.type}>
                {caseType.description}
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
