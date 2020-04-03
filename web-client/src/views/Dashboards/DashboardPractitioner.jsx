import { BigHeader } from '../BigHeader';
import { CaseListPractitioner } from '../CaseListPractitioner';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const DashboardPractitioner = connect(
  { user: state.user },
  function DashboardPractitioner({ user }) {
    return (
      <React.Fragment>
        <BigHeader text={`Welcome, ${user.name}`} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <CaseListPractitioner />
        </section>
      </React.Fragment>
    );
  },
);
