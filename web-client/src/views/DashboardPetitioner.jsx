import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { CaseListPetitioner } from './CaseListPetitioner';
import { WhatToExpect } from './WhatToExpect';
import ErrorNotification from './ErrorNotification';
import SuccessNotification from './SuccessNotification';

export const DashboardPetitioner = connect(
  { user: state.user, helper: state.dashboardPetitionerHelper },
  ({ user, helper }) => {
    return (
      <section className="usa-section usa-grid">
        <h1 tabIndex="-1">Welcome, {user.name}</h1>
        <SuccessNotification />
        <ErrorNotification />
        <div className="usa-width-two-thirds">
          {helper.showWhatToExpect && <WhatToExpect />}
          {helper.showCaseList && <CaseListPetitioner />}
        </div>
        <div className="usa-width-one-third">
          <div className="blue-container">
            <h3>Taxpayer Tools</h3>
            <p>
              <FontAwesomeIcon icon="file-pdf" size="sm" />
              <a href="/">How to prepare your documents before filing a case</a>
            </p>
            <p>
              <a href="/">Find a court location</a>
              <FontAwesomeIcon icon="share-square" size="sm" />
            </p>
            <p>
              <a href="/">View forms</a>
              <FontAwesomeIcon icon="share-square" size="sm" />
            </p>
          </div>
          <div className="blue-container">
            <h3>Other Filing Options</h3>
            <p>
              <a href="/">How to file a case by mail or in person</a>
              <FontAwesomeIcon icon="share-square" size="sm" />
            </p>
          </div>
        </div>
      </section>
    );
  },
);
