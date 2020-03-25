import { PublicCaseDetailHeader } from './PublicCaseDetailHeader';
import { PublicCaseDetailSubnavTabs } from './PublicCaseDetailSubnavTabs';
import { PublicDocketRecord } from './PublicDocketRecord';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PublicCaseDetail = connect(
  {
    formattedCaseDetail: state.publicCaseDetailHelper.formattedCaseDetail,
  },
  function PublicCaseDetail({ formattedCaseDetail }) {
    return (
      <>
        <PublicCaseDetailHeader />
        {!formattedCaseDetail.isCaseSealed && (
          <>
            <PublicCaseDetailSubnavTabs />
            <section className="usa-section grid-container">
              <PublicDocketRecord />
            </section>
          </>
        )}
      </>
    );
  },
);
