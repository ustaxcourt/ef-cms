import { connect } from '@cerebral/react';
import React from 'react';
import ContactPrimary from './ContactPrimary';
import ContactSecondary from './ContactSecondary';

export default connect(
  {},
  function ConservatorContact() {
    return (
      <React.Fragment>
        <ContactPrimary
          header="Tell Us About Yourself as the Conservator for This Taxpayer"
          nameLabel="Name of Conservator"
        />
        <ContactSecondary
          header="Tell Us About the Taxpayer You Are Filing For"
          nameLabel="Name of Taxpayer"
          displayInCareOf={true}
          displayPhone={true}
        />
      </React.Fragment>
    );
  },
);
