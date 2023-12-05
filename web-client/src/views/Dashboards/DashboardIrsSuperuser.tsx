import { BigHeader } from '../BigHeader';
import { CaseSearchBox } from '../CaseSearchBox';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const DashboardIrsSuperuser = connect(
  {
    user: state.user,
  },
  function DashboardIrsSuperuser({ user }) {
    return (
      <React.Fragment>
        <BigHeader text={`Welcome, ${user.name}`} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <CaseSearchBox />
        </section>
      </React.Fragment>
    );
  },
);

DashboardIrsSuperuser.displayName = 'DashboardIrsSuperuser';
