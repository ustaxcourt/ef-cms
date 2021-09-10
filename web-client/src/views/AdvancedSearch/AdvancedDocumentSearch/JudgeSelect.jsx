import { BindedSelect } from '../../../ustc-ui/BindedSelect/BindedSelect';
import { connect } from '@cerebral/react';
import { props } from 'cerebral';
import React from 'react';

export const JudgeSelect = connect(
  {
    judges: props.judges,
  },
  function JudgeSelect({ judges }) {
    return (
      <>
        <label className="usa-label" htmlFor="order-date-range">
          Judge
        </label>
        <BindedSelect
          bind={'advancedSearchForm.orderSearch.judge'}
          className="usa-input"
          id="order-judge"
          name="judge"
        >
          <option value="">All judges</option>
          {judges.map(judge => (
            <option key={judge.judgeFullName} value={judge.judgeFullName}>
              {judge.name}
            </option>
          ))}
        </BindedSelect>
      </>
    );
  },
);
