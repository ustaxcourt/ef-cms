import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PublicCaseDetail = connect(
  { caseDetail: state.caseDetail },
  ({ caseDetail }) => {
    return (
      <>
        <h1>Case Detail: {caseDetail.docketNumber}</h1>
      </>
    );
  },
);
