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

        {formattedCaseDetail.isCaseSealed && (
          <>
            <div className="grid-container">
              <p className="margin-top-5 margin-bottom-5">
                This case is sealed and not accessible to the public.
              </p>
            </div>
          </>
        )}
      </>
    );
  },
);

PublicCaseDetail.displayName = 'PublicCaseDetail';
