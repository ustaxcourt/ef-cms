import { connect } from '@cerebral/react';
import React from 'react';
import ContactPrimary from './ContactPrimary';
import ContactSecondary from './ContactSecondary';

export default connect(
  {},
  function EstateWithExecutorContact() {
    return (
      <React.Fragment>
        <ContactPrimary
          header="Tell Us About Yourself as the Executor/Personal Representative For This Estate"
          nameLabel="Name of Executor/Personal Representative"
          displayTitle={true}
        />
        <ContactSecondary
          header="Tell Us About the Estate You Are Filing For"
          nameLabel="Name of Decedent"
        />
      </React.Fragment>
    );
  },
);
