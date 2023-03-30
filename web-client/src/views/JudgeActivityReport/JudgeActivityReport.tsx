import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { DateRangePickerComponent } from '../../ustc-ui/DateInput/DateRangePickerComponent';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const JudgeActivityReport = connect(
  {},
  function JudgeActivityReport({}) {
    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="title">
            <h1>Activity - </h1>
          </div>

          <div className="grid-row">
            <div className="blue-container">
              <DateRangePickerComponent
                endDateErrorText=""
                endName="deadlineEnd"
                endValue=""
                startDateErrorText=""
                startName="deadlineStart"
                startValue=""
                onChangeEnd={e => {}}
                onChangeStart={e => {}}
              />
              <Button
                id="update-date-range-deadlines-button"
                onClick={() => {
                  // updateDateRangeForDeadlinesSequence();
                }}
              >
                Run Report
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  },
);

JudgeActivityReport.displayName = 'JudgeActivityReport';
