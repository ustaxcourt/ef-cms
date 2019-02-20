import { connect } from '@cerebral/react';
import React from 'react';
import ContactPrimary from './ContactPrimary';
import ContactSecondary from './ContactSecondary';

export default connect(
  {},
  function MinorContact() {
    return (
      <React.Fragment>
        <ContactPrimary
          header="Tell Us About Yourself as the Next Friend for This Minor"
          nameLabel="Name of Next Friend"
        />
        <ContactSecondary
          header="Tell Us About the Minor You Are Filing For"
          nameLabel="Name of Minor"
          displayInCareOf={true}
          displayPhone={true}
        />
      </React.Fragment>
    );
  },
);
