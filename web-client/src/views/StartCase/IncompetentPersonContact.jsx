import { connect } from '@cerebral/react';
import React from 'react';
import ContactPrimary from './ContactPrimary';
import ContactSecondary from './ContactSecondary';

export default connect(
  {},
  function IncompetentPersonContact() {
    return (
      <React.Fragment>
        <ContactPrimary
          header="Tell Us About Yourself as the Next Friend for This Incompetent Person"
          nameLabel="Name of Next Friend"
        />
        <ContactSecondary
          header="Tell Us About the Incompetent Person You Are Filing For"
          nameLabel="Name of Incompetent Person"
          displayInCareOf={true}
          displayPhone={true}
        />
      </React.Fragment>
    );
  },
);
