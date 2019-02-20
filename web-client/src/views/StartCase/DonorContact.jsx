import { connect } from '@cerebral/react';
import React from 'react';
import ContactPrimary from './ContactPrimary';

export default connect(
  {},
  function DonorContact() {
    return (
      <ContactPrimary
        header="Tell Us About the Donor You Are Filing For"
        nameLabel="Name of Petitioner"
      />
    );
  },
);
