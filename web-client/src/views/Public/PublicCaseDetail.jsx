import { PublicCaseDetailHeader } from './PublicCaseDetailHeader';
import { PublicCaseDetailSubnavTabs } from './PublicCaseDetailSubnavTabs';
import { PublicDocketRecord } from './PublicDocketRecord';
import { connect } from '@cerebral/react';
import React from 'react';

export const PublicCaseDetail = connect({}, () => {
  return (
    <>
      <PublicCaseDetailHeader />
      <PublicCaseDetailSubnavTabs />

      <section className="usa-section grid-container">
        <PublicDocketRecord />
      </section>
    </>
  );
});
