import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const JudgeActivityReport = connect(
  {
    form: state.form,
    submitJudgeActivityReportSequence:
      sequences.submitJudgeActivityReportSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function JudgeActivityReport({
    form,
    submitJudgeActivityReportSequence,
    updateFormValueSequence,
    validationErrors,
  }) {
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
            <div className="grid-row">
              <div className="grid-col-auto margin-x-3">
                <DateInput
                  errorText={validationErrors.startDate}
                  id="activity-start-date"
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
                  onChange={updateFormValueSequence}
                />
              </div>
              <div className="grid-col-auto margin-x-3">
                <DateInput
                  errorText={validationErrors.endDate}
                  id="activity-end-date"
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
                  onChange={updateFormValueSequence}
                />
              </div>
              <div className="grid-col-auto">
                <Button
                  onClick={() => {
                    submitJudgeActivityReportSequence();
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
