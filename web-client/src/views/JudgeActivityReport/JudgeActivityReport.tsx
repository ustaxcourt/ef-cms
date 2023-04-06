import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { ErrorNotification } from '../ErrorNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const JudgeActivityReport = connect(
  {
    form: state.form,
    judgeActivityReportHelper: state.judgeActivityReportHelper,
    submitJudgeActivityReportSequence:
      sequences.submitJudgeActivityReportSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function JudgeActivityReport({
    form,
    judgeActivityReportHelper,
    submitJudgeActivityReportSequence,
    updateFormValueSequence,
    validationErrors,
  }) {
    const closedCases: JSX.Element = (
      <>
        <table aria-describedby="TODO" className="usa-table ustc-table">
          <caption>
            Cases Closed <span className="float-right">Total: 20</span>
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
            {Object.entries(judgeActivityReportHelper.closedCases).map(
              ([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td className="text-center">{value}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </>
    );

    const trialSessionsHeld: JSX.Element = (
      <>
        <table aria-describedby="TODO" className="usa-table ustc-table">
          <caption>
            Sessions Held <span className="float-right">Total: 25</span>
          </caption>

          <thead>
            <tr>
              <th aria-label="TODO">Session Type</th>
              <th aria-label="Docket Number">Session Type Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(judgeActivityReportHelper.trialSessionsHeld).map(
              ([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </>
    );

    const ordersIssued: JSX.Element = (
      <>
        <table aria-describedby="TODO" className="usa-table ustc-table">
          <caption>
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
            {judgeActivityReportHelper.ordersIssued.map(order => (
              <tr key={order.eventCode}>
                <td>{order.eventCode}</td>
                <td>{order.documentType}</td>
                <td>{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );

    const opinionsIssued: JSX.Element = (
      <>
        <table aria-describedby="TODO" className="usa-table ustc-table">
          <caption>
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
            {judgeActivityReportHelper.opinionsIssued.map(opinion => (
              <tr key={opinion.eventCode}>
                <td>{opinion.eventCode}</td>
                <td>{opinion.documentType}</td>
                <td>{opinion.total}</td>
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
            <h1>Activity - {judgeActivityReportHelper.formattedJudgeName} </h1>
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
                  placeholder={'MM/DD/YYYY'}
                  showDateHint={false}
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
                  placeholder={'MM/DD/YYYY'}
                  showDateHint={false}
                  values={{
                    day: form.endDay,
                    month: form.endMonth,
                    year: form.endYear,
                  }}
                  onChange={updateFormValueSequence}
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
          <div className="grid-row grid-gap">
            <div className="grid-col-6">{closedCases}</div>
            <div className="grid-col-6">{trialSessionsHeld}</div>
          </div>

          <div className="grid-row grid-gap">
            <div className="grid-col-6">{ordersIssued}</div>
            <div className="grid-col-6">{opinionsIssued}</div>
          </div>
        </section>
      </>
    );
  },
);
