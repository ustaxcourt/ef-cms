import { connect } from '@cerebral/react';
import React from 'react';

export const AddDocketEntry = connect(
  {},
  () => {
    return (
      <React.Fragment>
        <h1>Add Docket Entry</h1>
      </React.Fragment>
    );
  },
);
