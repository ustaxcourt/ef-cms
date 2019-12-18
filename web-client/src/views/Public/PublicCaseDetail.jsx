import { PublicCaseDetailHeader } from './PublicCaseDetailHeader';
import { connect } from '@cerebral/react';
import React from 'react';

export const PublicCaseDetail = connect({}, () => {
  return (
    <>
      <PublicCaseDetailHeader />
    </>
  );
});
