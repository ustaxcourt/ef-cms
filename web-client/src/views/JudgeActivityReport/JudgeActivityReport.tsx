import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { DateRangePickerComponent } from '../../ustc-ui/DateInput/DateRangePickerComponent';
import { ErrorNotification } from '../ErrorNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const JudgeActivityReport = connect(
  {
    CLOSED_CASE_STATUSES: state.constants.CLOSED_CASE_STATUSES,
    SESSION_TYPES: state.constants.SESSION_TYPES,
    form: state.form,
    judgeActivityReportData: state.judgeActivityReportData,
    judgeActivityReportHelper: state.judgeActivityReportHelper,
    submitJudgeActivityReportSequence:
      sequences.submitJudgeActivityReportSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function JudgeActivityReport({
    CLOSED_CASE_STATUSES,
    form,
    judgeActivityReportData,
    judgeActivityReportHelper,
    SESSION_TYPES,
    submitJudgeActivityReportSequence,
    updateFormValueSequence,
    validationErrors,
  }) {
    const closedCases: () => JSX.Element = () => (
      <>
        <table aria-describedby="casesClosed" className="usa-table ustc-table">
          <caption className="table-caption-serif" id="casesClosed">
            Cases Closed{' '}
            <span className="float-right">
              Total: {judgeActivityReportHelper.closedCasesTotal}
            </span>
          </caption>
          <thead>
            <tr>
              <th aria-label="Case type">Case Type</th>
              <th aria-label="Case type total" className="text-center">
                Case Type Total
              </th>
            </tr>
          </thead>
          <tbody>
            {CLOSED_CASE_STATUSES.map(status => (
              <tr key={status}>
                <td>{status}</td>
                <td className="text-center">
                  {judgeActivityReportData.casesClosedByJudge[status]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );

    const trialSessionsHeld: () => JSX.Element = () => (
      <>
        <table aria-describedby="sessionsHeld" className="usa-table ustc-table">
          <caption className="table-caption-serif" id="sessionsHeld">
            Sessions Held{' '}
            <span className="float-right">
              Total: {judgeActivityReportHelper.trialSessionsHeldTotal}
            </span>
          </caption>

          <thead>
            <tr>
              <th aria-label="Session type">Session Type</th>
              <th aria-label="Session type total">Session Type Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(SESSION_TYPES).map(status => (
              <tr key={status}>
                <td>{status}</td>
                <td className="text-center">
                  {judgeActivityReportData.trialSessions[status]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );

    const ordersIssued: () => JSX.Element = () => (
      <>
        <table aria-describedby="ordersIssued" className="usa-table ustc-table">
          <caption className="table-caption-serif" id="ordersIssued">
            Orders Issued{' '}
            <span className="float-right">
              Total: {judgeActivityReportHelper.ordersFiledTotal}
            </span>
          </caption>
          <thead>
            <tr>
              <th aria-label="event code">Event</th>
              <th aria-label="order type">Order Type</th>
              <th aria-label="event total">Event Total</th>
            </tr>
          </thead>
          <tbody>
            {judgeActivityReportData.orders.map(order => (
              <tr key={order.eventCode}>
                <td>{order.eventCode}</td>
                <td>{order.documentType}</td>
                <td>{order.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );

    const opinionsIssued: () => JSX.Element = () => (
      <>
        <table
          aria-describedby="opinionsIssued"
          className="usa-table ustc-table"
        >
          <caption className="table-caption-serif" id="opinionsIssued">
            Opinions Issued{' '}
            <span className="float-right">
              Total: {judgeActivityReportHelper.opinionsFiledTotal}
            </span>
          </caption>
          <thead>
            <tr>
              <th aria-label="event code">Event</th>
              <th aria-label="opinion type">Opinion Type</th>
              <th aria-label="event total">Event Total</th>
            </tr>
          </thead>
          <tbody>
            {judgeActivityReportData.opinions.map(opinion => (
              <tr key={opinion.eventCode}>
                <td>{opinion.eventCode}</td>
                <td>{opinion.documentType}</td>
                <td>{opinion.count}</td>
              </tr>
            ))}
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
            <h1>Activity - {form.judgeName} </h1>
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
                    updateFormValueSequence({
                      key: 'endDate',
                      value: e.target.value,
                    });
                  }}
                  onChangeStart={e => {
                    updateFormValueSequence({
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

        <section className="usa-section grid-container">
          {judgeActivityReportData.showResults ? (
            <>
              <div className="grid-row grid-gap">
                <div className="grid-col-6">{closedCases()}</div>
                <div className="grid-col-6">{trialSessionsHeld()}</div>
              </div>

              <div className="grid-row grid-gap">
                <div className="grid-col-6">{ordersIssued()}</div>
                <div className="grid-col-6">{opinionsIssued()}</div>
              </div>
            </>
          ) : (
            <div className="text-semibold">
              There is no activity for the selected dates
            </div>
          )}
        </section>
      </>
    );
  },
);
