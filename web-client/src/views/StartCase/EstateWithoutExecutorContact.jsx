import { connect } from '@cerebral/react';
import React from 'react';
import ContactPrimary from './ContactPrimary';

export default connect(
  {},
  function EstateWithoutExecutorContact() {
    return (
      <ContactPrimary
        header="Tell Us About the Estate You Are Filing For"
        nameLabel="Name of Decedent"
        displayInCareOf={true}
      />
    );
  },
);
