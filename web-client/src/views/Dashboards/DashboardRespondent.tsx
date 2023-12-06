import { BigHeader } from '../BigHeader';
import { CaseListTable } from '../CaseListTable';
import { CaseSearchBox } from '../CaseSearchBox';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const DashboardRespondent = connect(
  {
    user: state.user,
  },
  function DashboardRespondent({ user }) {
    return (
      <React.Fragment>
        <BigHeader text={`Welcome, ${user.name}`} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-8">
              <CaseListTable />
            </div>
            <div className="tablet:grid-col-4">{<CaseSearchBox />}</div>
          </div>
        </section>
      </React.Fragment>
    );
  },
);

DashboardRespondent.displayName = 'DashboardRespondent';
