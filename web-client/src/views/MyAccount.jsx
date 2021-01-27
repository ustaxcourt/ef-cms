import { BigHeader } from './BigHeader';
import { ErrorNotification } from './ErrorNotification';
import { MyContactInformation } from './MyContactInformation';
import { SuccessNotification } from './SuccessNotification';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const MyAccount = connect(
  { user: state.user },
  function MyAccount({ user }) {
    return (
      <React.Fragment>
        <BigHeader text={'My Account'} />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <MyContactInformation />
        </section>
      </React.Fragment>
    );
  },
);
