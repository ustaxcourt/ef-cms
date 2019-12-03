import { PublicCaseDetailHeader } from './PublicCaseDetailHeader';
import { PublicDocketRecord } from './PublicDocketRecord';
import { connect } from '@cerebral/react';
import React from 'react';

export const PublicCaseDetail = connect({}, () => {
  return (
    <>
      <PublicCaseDetailHeader />

      <section className="usa-section grid-container">
        <PublicDocketRecord />
      </section>
    </>
  );
});
