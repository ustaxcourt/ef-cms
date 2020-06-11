import { BigHeader } from '../BigHeader';
import { CaseListPractitioner } from '../CaseListPractitioner';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const DashboardPractitioner = connect(
  { dashboardExternalHelper: state.dashboardExternalHelper, user: state.user },
  function DashboardPractitioner({ dashboardExternalHelper, user }) {
    return (
      <React.Fragment>
        <BigHeader text={`Welcome, ${user.name}`} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          {dashboardExternalHelper.showCaseList && <CaseListPractitioner />}
          {!dashboardExternalHelper.showCaseList && (
            <p>You have no open or closed cases.</p>
          )}
        </section>
      </React.Fragment>
    );
  },
);
