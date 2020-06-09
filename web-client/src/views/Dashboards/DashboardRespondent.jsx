import { BigHeader } from '../BigHeader';
import { CaseListRespondent } from '../CaseListRespondent';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const DashboardRespondent = connect(
  {
    dashboardExternalHelper: state.dashboardExternalHelper,
    user: state.user,
  },
  function DashboardRespondent({ dashboardExternalHelper, user }) {
    return (
      <React.Fragment>
        <BigHeader text={`Welcome, ${user.name}`} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          {dashboardExternalHelper.showCaseList && <CaseListRespondent />}
        </section>
      </React.Fragment>
    );
  },
);
