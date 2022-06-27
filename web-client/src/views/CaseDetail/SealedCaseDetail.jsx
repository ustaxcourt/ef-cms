import { SealedCaseDetailHeader } from './SealedCaseDetailHeader';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const SealedCaseDetail = connect(
  {
    caseDetail: state.caseDetail,
  },
  function SealedCaseDetail({ caseDetail }) {
    return (
      <>
        <SealedCaseDetailHeader />

        {caseDetail.isSealed && (
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
