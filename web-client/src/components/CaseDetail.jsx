import { connect } from '@cerebral/react';
import React from 'react';
import { state } from 'cerebral';

/**
 * Footer
 */
export default connect(
  {
    docketNumber: state.petition.docketNumber,
  },
  function CaseDetail({ docketNumber }) {
    return (
      <React.Fragment>{docketNumber} is your docket number.</React.Fragment>
    );
  },
);
