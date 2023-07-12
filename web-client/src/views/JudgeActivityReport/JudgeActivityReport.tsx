import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
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
    selectDateRangeFromJudgeActivityReportSequence:
      sequences.selectDateRangeFromJudgeActivityReportSequence,
    submitJudgeActivityReportSequence:
      sequences.submitJudgeActivityReportSequence,
    validationErrors: state.validationErrors,
  },
  function JudgeActivityReport({
    form,
    judgeActivityReportData,
    judgeActivityReportHelper,
    selectDateRangeFromJudgeActivityReportSequence,
    submitJudgeActivityReportSequence,
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
              <th aria-label="case type total">Case Type Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(judgeActivityReportData.casesClosedByJudge).map(
              ([status, count]) => (
                <tr key={status}>
                  <td>{status}</td>
                  <td>{count}</td>
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
              <th aria-label="session type total">Session Type Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(judgeActivityReportData.trialSessions).map(
              ([sessionStatus, count]) => (
                <tr key={sessionStatus}>
                  <td>{sessionStatus}</td>
                  <td>{count}</td>
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
              <th aria-label="event total">Event Total</th>
            </tr>
          </thead>
          <tbody>
            {judgeActivityReportData.orders.map(
              ({ count, documentType, eventCode }) => (
                <tr key={eventCode}>
                  <td className="width-15">{eventCode}</td>
                  <td>{documentType}</td>
                  <td>{count}</td>
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
              <th aria-label="event total">Event Total</th>
            </tr>
          </thead>
          <tbody>
            {judgeActivityReportData.opinions.map(
              ({ count, documentType, eventCode }) => (
                <tr key={eventCode}>
                  <td className="width-15">{eventCode}</td>
                  <td>{documentType}</td>
                  <td>{count}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </>
    );

    const progressDescription: () => JSX.Element = () => (
      <>
        <table
          aria-describedby="progressDescription"
          className="usa-table ustc-table"
        >
          <caption id="progressDescription">
            <div className="grid-row display-flex flex-row flex-align-end">
              <div className="grid-col-9 table-caption-serif">
                Progress Description
              </div>
              <div className="display-flex flex-column flex-align-end grid-col-fill text-semibold">
                Total: {judgeActivityReportHelper.progressDescriptionTableTotal}
              </div>
            </div>
          </caption>
          <thead>
            <tr>
              <th aria-label="consolidation icon">
                <span className="usa-sr-only">Consolidated Case Indicator</span>
              </th>
              <th aria-label="docket number">Docket No.</th>
              <th aria-label="opinion type">No. of Cases</th>
              <th aria-label="event total">Petitioner(s)</th>
              <th aria-label="event total">Case Status</th>
              <th aria-label="event total">Days in Status</th>
            </tr>
          </thead>
          <tbody>
            {judgeActivityReportHelper.filteredSubmittedAndCavCasesByJudge.map(
              (formattedCase, index) => {
                return (
                  <tr key={index}>
                    <td className="consolidated-case-column">
                      <ConsolidatedCaseIcon
                        consolidatedIconTooltipText={
                          formattedCase.consolidatedIconTooltipText
                        }
                        inConsolidatedGroup={formattedCase.inConsolidatedGroup}
                        showLeadCaseIcon={formattedCase.isLeadCase}
                      />
                    </td>
                    <td>
                      <CaseLink formattedCase={formattedCase} />
                    </td>
                    <td>{formattedCase?.formattedCaseCount}</td>
                    <td>{formattedCase.caseCaption}</td>
                    <td>{formattedCase.status}</td>
                    <td>{formattedCase.daysElapsedSinceLastStatusChange}</td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
        {judgeActivityReportHelper.progressDescriptionTableTotal === 0 && (
          <p>{'There are no cases with a status of "Submitted" or "CAV".'}</p>
        )}
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
                    selectDateRangeFromJudgeActivityReportSequence({
                      endDate: e.target.value,
                    });
                  }}
                  onChangeStart={e => {
                    selectDateRangeFromJudgeActivityReportSequence({
                      startDate: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="grid-col-auto display-flex flex-align-center">
                <Button
                  className="position-relative margin-bottom-35"
                  disabled={judgeActivityReportHelper.isFormPristine}
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

              <div className="grid-row grid-gap">
                <div className="grid-col-12">{progressDescription()}</div>
              </div>
            </>
          ) : (
            <>
              <div className="text-semibold margin-bottom-30px">
                There is no activity for the selected dates
              </div>
              <div className="grid-row grid-gap">
                <div className="grid-col-12">{progressDescription()}</div>
              </div>
            </>
          )}
        </section>
      </>
    );
  },
);
