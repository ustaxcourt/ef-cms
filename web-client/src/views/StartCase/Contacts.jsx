import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import ContactPrimary from './ContactPrimary';
import ContactSecondary from './ContactSecondary';

export default connect(
  { startCaseHelper: state.startCaseHelper },
  function Contacts({ startCaseHelper }) {
    return (
      <React.Fragment>
        {startCaseHelper.showPrimaryContact && <ContactPrimary />}
        {startCaseHelper.showSecondaryContact && <ContactSecondary />}
      </React.Fragment>
    );
  },
);
