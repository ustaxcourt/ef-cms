import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { DateRangePickerComponent } from '../../ustc-ui/DateInput/DateRangePickerComponent';
import { ErrorNotification } from '../ErrorNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const JudgeActivityReport = connect(
  {
    form: state.form,
    judgeActivityReportData: state.judgeActivityReportData,
    judgeActivityReportHelper: state.judgeActivityReportHelper,
    submitJudgeActivityReportSequence:
      sequences.submitJudgeActivityReportSequence,
    updateJudgeActivityReportFormSequence:
      sequences.updateJudgeActivityReportFormSequence,
    validationErrors: state.validationErrors,
  },
  function JudgeActivityReport({
    form,
    judgeActivityReportData,
    judgeActivityReportHelper,
    submitJudgeActivityReportSequence,
    updateJudgeActivityReportFormSequence,
    validationErrors,
  }) {
    const closedCases: JSX.Element = (
      <>
        <table aria-describedby="TODO" className="usa-table ustc-table">
          <caption className="table-caption-serif">
            Cases Closed{' '}
            <span className="float-right">
              Total: {judgeActivityReportData.casesClosedByJudge.total}
            </span>
          </caption>
          <thead>
            <tr>
              <th aria-label="">Case Type</th>
              <th aria-label="" className="text-center">
                Case Type Total
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(
              judgeActivityReportHelper.activityReportResults.closedCases,
            ).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td className="text-center">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );

    const trialSessionsHeld: JSX.Element = (
      <>
        <table aria-describedby="TODO" className="usa-table ustc-table">
          <caption className="table-caption-serif">
            Sessions Held <span className="float-right">Total: 25</span>
          </caption>

          <thead>
            <tr>
              <th aria-label="TODO">Session Type</th>
              <th aria-label="Docket Number">Session Type Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(
              judgeActivityReportHelper.activityReportResults.trialSessionsHeld,
            ).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );

    const ordersIssued: JSX.Element = (
      <>
        <table aria-describedby="TODO" className="usa-table ustc-table">
          <caption className="table-caption-serif">
            Orders Issued <span className="float-right">Total: 4</span>
          </caption>
          <thead>
            <tr>
              <th aria-label="TODO">Event</th>
              <th aria-label="Docket Number">Order Type</th>
              <th aria-label="Docket Number">Event Total</th>
            </tr>
          </thead>
          <tbody>
            {judgeActivityReportHelper.activityReportResults.ordersIssued.map(
              order => (
                <tr key={order.eventCode}>
                  <td>{order.eventCode}</td>
                  <td>{order.documentType}</td>
                  <td>{order.total}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </>
    );

    const opinionsIssued: JSX.Element = (
      <>
        <table aria-describedby="TODO" className="usa-table ustc-table">
          <caption className="table-caption-serif">
            Opinions Issued <span className="float-right">Total: 89</span>
          </caption>
          <thead>
            <tr>
              <th aria-label="TODO">Event</th>
              <th aria-label="Docket Number">Opinion Type</th>
              <th aria-label="Docket Number">Event Total</th>
            </tr>
          </thead>
          <tbody>
            {judgeActivityReportHelper.activityReportResults.opinionsIssued.map(
              opinion => (
                <tr key={opinion.eventCode}>
                  <td>{opinion.eventCode}</td>
                  <td>{opinion.documentType}</td>
                  <td>{opinion.total}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </>
    );

    return (
      <>
        <BigHeader text="Reports" />

        <section className="usa-section grid-container">
          <ErrorNotification />

          <div className="title">
            <h1>Activity - {judgeActivityReportHelper.formattedJudgeName} </h1>
          </div>

          <div className="blue-container">
            <div className="grid-row">
              <div className="grid-col-auto margin-x-3">
                <DateRangePickerComponent
                  endDateErrorText={validationErrors.endDate}
                  endName="deadlineEnd"
                  endPickerCls={'grid-col-6 padding-left-2'}
                  endValue={form.endDate}
                  formGroupCls={'margin-bottom-0'}
                  rangePickerCls={'grid-row '}
                  showHint={false}
                  showPlaceholder={true}
                  startDateErrorText={validationErrors.startDate}
                  startName="deadlineStart"
                  startPickerCls={'grid-col-6 padding-right-2'}
                  startValue={form.endDate}
                  onChangeEnd={e => {
                    updateJudgeActivityReportFormSequence({
                      key: 'endDate',
                      value: e.target.value,
                    });
                  }}
                  onChangeStart={e => {
                    updateJudgeActivityReportFormSequence({
                      key: 'startDate',
                      value: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="grid-col-auto display-flex flex-align-end">
                <Button
                  className="position-relative margin-bottom-35"
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

        {judgeActivityReportHelper.activityReportResults && (
          <section className="usa-section grid-container">
            <div className="grid-row grid-gap">
              <div className="grid-col-6">{closedCases}</div>
              <div className="grid-col-6">{trialSessionsHeld}</div>
            </div>

            <div className="grid-row grid-gap">
              <div className="grid-col-6">{ordersIssued}</div>
              <div className="grid-col-6">{opinionsIssued}</div>
            </div>
          </section>
        )}
      </>
    );
  },
);
