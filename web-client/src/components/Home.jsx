import { connect } from '@cerebral/react';
import React from 'react';

import SuccessNotification from './SuccessNotification';

export default connect(
  {},
  function Home() {
    return (
      <section className="usa-section usa-grid">
        <SuccessNotification />
        <p>
          <a className="usa-button" href="/file-a-petition">
            Start a case
          </a>
        </p>
      </section>
    );
  },
);
