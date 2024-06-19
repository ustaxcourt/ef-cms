import { BigHeader } from '../BigHeader';
import { ColdCaseReportList } from './ColdCaseReportList';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ColdCaseReport = connect(
  {
    coldCaseReport: state.coldCaseReport,
  },
  function ColdCaseReport({ coldCaseReport }) {
    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="title">
            <h1>Cold Case Report</h1>
          </div>

          <div className="margin-bottom-2">
            Showing cases not at issue with no activity in the last 120 days,
            sorted by date of the last docket entry.
          </div>

          <ColdCaseReportList entries={coldCaseReport.entries} />
        </section>
      </>
    );
  },
);

ColdCaseReport.displayName = 'ColdCaseReport';
