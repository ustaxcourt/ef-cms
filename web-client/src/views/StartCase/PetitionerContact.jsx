import { connect } from '@cerebral/react';
import React from 'react';
import ContactPrimary from './ContactPrimary';

export default connect(
  {},
  function PetitionerContact() {
    return <ContactPrimary header="Tell Us About Yourself" nameLabel="Name" />;
  },
);
