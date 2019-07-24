import { BigHeader } from './BigHeader';
import { CaseListRespondent } from './CaseListRespondent';
import { ErrorNotification } from './ErrorNotification';
import { SuccessNotification } from './SuccessNotification';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const DashboardRespondent = connect(
  {
    user: state.user,
  },
  ({ user }) => {
    return (
      <React.Fragment>
        <BigHeader text={`Welcome, ${user.name}`} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <CaseListRespondent />
        </section>
      </React.Fragment>
    );
  },
);
