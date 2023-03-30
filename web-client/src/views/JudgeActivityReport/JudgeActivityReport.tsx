import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const JudgeActivityReport = connect(
  {
    form: state.form,
  },
  function JudgeActivityReport({ form }) {
    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="title">
            <h1>Activity - </h1>
          </div>

          <div className="blue-container">
            <div className="display-flex flex-row flex-align-end">
              <div className="">
                <DateInput
                  errorText=""
                  label="Start date"
                  names={{
                    day: 'startDay',
                    month: 'startMonth',
                    year: 'startYear',
                  }}
                  values={{
                    day: form.startDay,
                    month: form.startMonth,
                    year: form.startYear,
                  }}
                  onBlur={() => {}}
                  onChange={() => {}}
                />
              </div>
              <div className="display-flex flex-column flex-auto ">
                <DateInput
                  errorText=""
                  label="End date"
                  names={{
                    day: 'endDay',
                    month: 'endMonth',
                    year: 'endYear',
                  }}
                  values={{
                    day: form.endDay,
                    month: form.endMonth,
                    year: form.endYear,
                  }}
                  onBlur={() => {}}
                  onChange={() => {}}
                />
              </div>
              <div className="">
                <Button
                  onClick={() => {
                    // updateDateRangeForDeadlinesSequence();
                  }}
                >
                  Run Report
                </Button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);

JudgeActivityReport.displayName = 'JudgeActivityReport';
