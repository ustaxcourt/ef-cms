import { connect } from '@cerebral/react';
import React from 'react';
import ContactPrimary from './ContactPrimary';

export default connect(
  {},
  function TransfereeContact() {
    return (
      <ContactPrimary
        header="Tell Us About the Transferee You Are Filing For"
        nameLabel="Name of Petitioner"
      />
    );
  },
);
