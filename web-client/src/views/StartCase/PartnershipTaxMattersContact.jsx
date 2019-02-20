import { connect } from '@cerebral/react';
import React from 'react';
import ContactPrimary from './ContactPrimary';
import ContactSecondary from './ContactSecondary';

export default connect(
  {},
  function PartnershipTaxMattersContact() {
    return (
      <React.Fragment>
        <ContactPrimary
          header="Tell Us About Yourself as the Tax Matters Partner"
          nameLabel="Name of Tax Matters Partner"
        />
        <ContactSecondary
          header="Tell Us About the Partnership You Are Filing For"
          nameLabel="Business Name"
          displayInCareOf={true}
          displayPhone={true}
        />
      </React.Fragment>
    );
  },
);
