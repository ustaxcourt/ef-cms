import { BindedSelect } from '../../../ustc-ui/BindedSelect/BindedSelect';
import { connect } from '@cerebral/react';
import { props } from 'cerebral';
import React from 'react';

export const JudgeSelect = connect(
  {
    formValue: props.formValue,
    judges: props.judges,
  },
  function JudgeSelect({ formValue, judges }) {
    return (
      <>
        <label className="usa-label" htmlFor="order-date-range">
          Judge
        </label>
        <BindedSelect
          bind={formValue}
          className="usa-input"
          id="order-judge"
          name="judge"
        >
          <option value="">All judges</option>
          {judges.map(judge => (
            <option key={judge.judgeFullName} value={judge.lastName}>
              {judge.name}
            </option>
          ))}
        </BindedSelect>
      </>
    );
  },
);
