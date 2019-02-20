import { connect } from '@cerebral/react';
import React from 'react';
import ContactPrimary from './ContactPrimary';
import ContactSecondary from './ContactSecondary';

export default connect(
  {},
  function TrustAndTrusteeContact() {
    return (
      <React.Fragment>
        <ContactPrimary
          header="Tell Us About Yourself as the Trustee"
          nameLabel="Name of Trustee"
        />
        <ContactSecondary
          header="Tell Us About the Trust You Are Filing For"
          nameLabel="Name of Trust"
          displayInCareOf={true}
          displayPhone={true}
        />
      </React.Fragment>
    );
  },
);
