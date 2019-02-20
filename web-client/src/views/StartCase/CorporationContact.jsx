import { connect } from '@cerebral/react';
import React from 'react';
import ContactPrimary from './ContactPrimary';

export default connect(
  {},
  function CorporationContact() {
    return (
      <ContactPrimary
        header="Tell Us About the Corporation You Are Filing For"
        nameLabel="Business Name"
        displayInCareOf={true}
      />
    );
  },
);
