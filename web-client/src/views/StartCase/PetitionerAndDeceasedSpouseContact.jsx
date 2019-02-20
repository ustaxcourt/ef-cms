import { connect } from '@cerebral/react';
import React from 'react';
import ContactPrimary from './ContactPrimary';
import ContactSecondary from './ContactSecondary';

export default connect(
  {},
  function PetitionerAndDeceasedSpouseContact() {
    return (
      <React.Fragment>
        <ContactPrimary header="Tell Us About Yourself" nameLabel="Name" />
        <ContactSecondary
          header="Tell Us About Your Deceased Spouse"
          nameLabel="Spouse's Name"
        />
      </React.Fragment>
    );
  },
);
