import { connect } from '@cerebral/react';
import React from 'react';

import SuccessNotification from './SuccessNotification';
import CaseList from './CaseList';

export default connect(
  {},
  function Dashboard() {
    return (
      <section className="usa-section usa-grid">
        <h1>Dashboard</h1>
        <SuccessNotification />
        <h2>Cases</h2>
        <p>
          <a className="usa-button" href="/file-a-petition">
            Start a case
          </a>
        </p>
        <CaseList />
      </section>
    );
  },
);
