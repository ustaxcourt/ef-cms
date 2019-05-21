import { CaseListPractitioner } from './CaseListPractitioner';
import { ErrorNotification } from './ErrorNotification';
import { SuccessNotification } from './SuccessNotification';
import { WelcomeHeader } from './WelcomeHeader';
import { connect } from '@cerebral/react';
import React from 'react';

export const DashboardPractitioner = connect(
  {},
  () => {
    return (
      <React.Fragment>
        <WelcomeHeader />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <CaseListPractitioner />
        </section>
      </React.Fragment>
    );
  },
);
