import { Button } from '@web-client/ustc-ui/Button/Button';
import { DateRangePickerComponent } from '@web-client/ustc-ui/DateInput/DateRangePickerComponent';
import { connect } from '@web-client/presenter/shared.cerebral';
import { formatPositiveNumber } from '@shared/business/utilities/formatPositiveNumber';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const Statistics = connect(
  {
    judgeActivityReportData: state.judgeActivityReport.judgeActivityReportData,
    judgeActivityReportFilters: state.judgeActivityReport.filters,
    judgeActivityReportHelper: state.judgeActivityReportHelper,
    setJudgeActivityReportFiltersSequence:
      sequences.setJudgeActivityReportFiltersSequence,
    submitJudgeActivityStatisticsReportSequence:
      sequences.submitJudgeActivityStatisticsReportSequence,

    validationErrors: state.validationErrors,
  },
  function Statistics({
    judgeActivityReportData,
    judgeActivityReportFilters,
    judgeActivityReportHelper,
    setJudgeActivityReportFiltersSequence,
    submitJudgeActivityStatisticsReportSequence,
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
                Total:{' '}
                {formatPositiveNumber(
                  judgeActivityReportHelper.closedCasesTotal,
                )}
              </div>
            </div>
          </caption>
          <thead>
            <tr>
              <th aria-label="case type">Case Type</th>
              <th aria-label="case type total">Case Type Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(
              judgeActivityReportData.casesClosedByJudge.aggregations,
            ).map(([status, count]) => (
              <tr key={status}>
                <td>{status}</td>
                <td>{formatPositiveNumber(count)}</td>
              </tr>
            ))}
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
                Total:{' '}
                {formatPositiveNumber(
                  judgeActivityReportHelper.trialSessionsHeldTotal,
                )}
              </div>
            </div>
          </caption>

          <thead>
            <tr>
              <th aria-label="session type">Session Type</th>
              <th aria-label="session type total">Session Type Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(
              judgeActivityReportData.trialSessions.aggregations,
            ).map(([sessionStatus, count]) => (
              <tr key={sessionStatus}>
                <td>{sessionStatus}</td>
                <td>{formatPositiveNumber(count)}</td>
              </tr>
            ))}
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
                Total:{' '}
                {formatPositiveNumber(
                  judgeActivityReportHelper.ordersFiledTotal,
                )}
              </div>
            </div>
          </caption>
          <thead>
            <tr>
              <th aria-label="event code">Event</th>
              <th aria-label="order type">Order Type</th>
              <th aria-label="event total">Event Total</th>
            </tr>
          </thead>
          <tbody>
            {judgeActivityReportHelper.orders.map(
              ({ count, documentType, eventCode }) => (
                <tr key={eventCode}>
                  <td className="width-15">{eventCode}</td>
                  <td>{documentType}</td>
                  <td>{formatPositiveNumber(count)}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        {judgeActivityReportData.ordersFiledTotal && (
          <p>There are no orders issued for the selected dates</p>
        )}
      </>
    );

    const opinionsIssued = () => {
      return (
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
                  Total:{' '}
                  {formatPositiveNumber(
                    judgeActivityReportHelper.opinionsFiledTotal,
                  )}
                </div>
              </div>
            </caption>
            <thead>
              <tr>
                <th aria-label="event code" className="width-15">
                  Event
                </th>
                <th aria-label="opinion type">Opinion Type</th>
                <th aria-label="event total">Event Total</th>
              </tr>
            </thead>
            <tbody>
              {judgeActivityReportData.opinions.aggregations.map(
                ({ count, documentType, eventCode }) => (
                  <tr key={eventCode}>
                    <td className="width-15">{eventCode}</td>
                    <td>{documentType}</td>
                    <td>{formatPositiveNumber(count)}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </>
      );
    };

    return (
      <>
        <div className="blue-container margin-bottom-30px">
          <div className="grid-row">
            <div className="grid-col-auto margin-x-3">
              <DateRangePickerComponent
                endDateErrorText={validationErrors.endDate}
                endName="deadlineEnd"
                endPickerCls={'grid-col-6 padding-left-2'}
                endValue={judgeActivityReportFilters.endDate}
                formGroupCls={'margin-bottom-0'}
                maxDate={judgeActivityReportHelper.today}
                rangePickerCls={'grid-row '}
                startDateErrorText={validationErrors.startDate}
                startName="deadlineStart"
                startPickerCls={'grid-col-6 padding-right-2'}
                startValue=""
                onChangeEnd={e => {
                  setJudgeActivityReportFiltersSequence({
                    endDate: e.target.value,
                  });
                }}
                onChangeStart={e => {
                  setJudgeActivityReportFiltersSequence({
                    startDate: e.target.value,
                  });
                }}
              />
            </div>
            <div className="grid-col-auto flex-align-center margin-top-2pt4rem margin-left-2">
              <Button
                className="position-relative margin-bottom-35"
                disabled={judgeActivityReportHelper.isFormPristine}
                onClick={() => {
                  submitJudgeActivityStatisticsReportSequence();
                }}
              >
                View Statistics
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
          <div className="text-semibold margin-bottom-30px">
            There is no activity for the selected dates
          </div>
        )}
      </>
    );
  },
);
