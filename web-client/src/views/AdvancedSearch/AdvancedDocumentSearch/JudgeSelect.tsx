import { BindedSelect } from '../../../ustc-ui/BindedSelect/BindedSelect';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props as cerebralProps } from 'cerebral';
import React from 'react';

const props = cerebralProps as unknown as {
  formValue: string;
  judges: Array<{ judgeFullName: string; lastName: string; name: string }>;
};

const judgeSelectDeps = {
  formValue: props.formValue,
  judges: props.judges,
};

export const JudgeSelect = connect(
  judgeSelectDeps,
  function JudgeSelect({ formValue, judges }) {
    return (
      <>
        <label className="usa-label" htmlFor="date-range">
          Judge
        </label>
        <BindedSelect
          aria-label="order-judge"
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

JudgeSelect.displayName = 'JudgeSelect';
