import { connect } from '@cerebral/react';
import React from 'react';

import ErrorNotification from './ErrorNotification';

export default connect(
  {},
  function Error() {
    return (
      <section className="usa-section usa-grid">
        <h1 tabIndex="-1">Error</h1>
        <ErrorNotification />
        {/*<p>*/}
          {/*<a href="log-in">Log in</a>*/}
        {/*</p>*/}
      </section>
    );
  },
);
