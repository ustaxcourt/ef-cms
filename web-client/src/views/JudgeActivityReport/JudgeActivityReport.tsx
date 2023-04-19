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
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function JudgeActivityReport({
    form,
    judgeActivityReportData,
    judgeActivityReportHelper,
    submitJudgeActivityReportSequence,
    updateFormValueSequence,
    validationErrors,
  }) {
    const closedCases: () => JSX.Element = () => (
      <>
        <table aria-describedby="casesClosed" className="usa-table ustc-table">
          <caption id="casesClosed">
            <div className="grid-row display-flex flex-row flex-align-end">
              <div className="grid-col-9 table-caption-serif">
                Cases Closed{' '}
              </div>
              <div className="display-flex flex-column flex-align-end grid-col-fill text-semibold">
                Total: {judgeActivityReportHelper.closedCasesTotal}
              </div>
            </div>
          </caption>
          <thead>
            <tr>
              <th aria-label="case type">Case Type</th>
              <th aria-label="case type total" className="text-center">
                Case Type Total
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(judgeActivityReportData.casesClosedByJudge).map(
              ([status, count]) => (
                <tr key={status}>
                  <td>{status}</td>
                  <td className="text-center">{count}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </>
    );

    const trialSessionsHeld: () => JSX.Element = () => (
      <>
        <table aria-describedby="sessionsHeld" className="usa-table ustc-table">
          <caption id="sessionsHeld">
            <div className="grid-row display-flex flex-row flex-align-end">
              <div className="grid-col-9 table-caption-serif">
                Sessions Held
              </div>
              <div className="display-flex flex-column flex-align-end grid-col-fill text-semibold">
                Total: {judgeActivityReportHelper.trialSessionsHeldTotal}
              </div>
            </div>
          </caption>

          <thead>
            <tr>
              <th aria-label="session type">Session Type</th>
              <th aria-label="session type total" className="text-center">
                Session Type Total
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(judgeActivityReportData.trialSessions).map(
              ([sessionStatus, count]) => (
                <tr key={sessionStatus}>
                  <td>{sessionStatus}</td>
                  <td className="text-center">{count}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </>
    );

    const ordersIssued: () => JSX.Element = () => (
      <>
        <table aria-describedby="ordersIssued" className="usa-table ustc-table">
          <caption id="ordersIssued">
            <div className="grid-row display-flex flex-row flex-align-end">
              <div className="grid-col-9 table-caption-serif">
                Orders Issued
              </div>
              <div className="display-flex flex-column flex-align-end grid-col-fill text-semibold">
                Total: {judgeActivityReportHelper.ordersFiledTotal}
              </div>
            </div>
          </caption>
          <thead>
            <tr>
              <th aria-label="event code">Event</th>
              <th aria-label="order type">Order Type</th>
              <th aria-label="event total" className="text-center">
                Event Total
              </th>
            </tr>
          </thead>
          <tbody>
            {judgeActivityReportData.orders.map(
              ({ count, documentType, eventCode }) => (
                <tr key={eventCode}>
                  <td>{eventCode}</td>
                  <td>{documentType}</td>
                  <td className="text-center">{count}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        {judgeActivityReportData.orders.length === 0 && (
          <p>There are no orders issued for the selected dates</p>
        )}
      </>
    );

    const opinionsIssued: () => JSX.Element = () => (
      <>
        <table
          aria-describedby="opinionsIssued"
          className="usa-table ustc-table"
        >
          <caption id="opinionsIssued">
            <div className="grid-row display-flex flex-row flex-align-end">
              <div className="grid-col-9 table-caption-serif">
                Opinions Issued
              </div>
              <div className="display-flex flex-column flex-align-end grid-col-fill text-semibold">
                Total: {judgeActivityReportHelper.opinionsFiledTotal}
              </div>
            </div>
          </caption>
          <thead>
            <tr>
              <th aria-label="event code" className="width-15">
                Event
              </th>
              <th aria-label="opinion type">Opinion Type</th>
              <th aria-label="event total" className="text-center">
                Event Total
              </th>
            </tr>
          </thead>
          <tbody>
            {judgeActivityReportData.opinions.map(
              ({ count, documentType, eventCode }) => (
                <tr key={eventCode}>
                  <td className="width-15">{eventCode}</td>
                  <td>{documentType}</td>
                  <td className="text-center">{count}</td>
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
            <h1>Activity - {judgeActivityReportHelper.reportHeader}</h1>
          </div>

          <div className="blue-container margin-bottom-30px">
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

          {judgeActivityReportHelper.showSelectDateRangeText ? (
            <div className="text-semibold margin-0">
              Enter a date range to view activity
            </div>
          ) : judgeActivityReportHelper.showResultsTables ? (
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
            <div className="text-semibold margin-0">
              There is no activity for the selected dates
            </div>
          )}
        </section>
      </>
    );
  },
);
