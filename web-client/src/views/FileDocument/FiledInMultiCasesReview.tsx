import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const FiledInMultiCasesReview = connect(
  {
    formattedSelectedCasesAsCase:
      state.fileDocumentHelper.formattedSelectedCasesAsCase,
  },
  function FiledInMultiCasesReview({ formattedSelectedCasesAsCase }) {
    return (
      <>
        <h3 className="underlined">Filed In These Cases</h3>
        {formattedSelectedCasesAsCase.map(selectedCase => (
          <div
            className="grid-row grid-gap margin-bottom-1"
            key={selectedCase.docketNumber}
          >
            <div className="tablet:grid-col-2">{selectedCase.docketNumber}</div>
            <div className="tablet:grid-col-10">{selectedCase.caseTitle}</div>
          </div>
        ))}
      </>
    );
  },
);

FiledInMultiCasesReview.displayName = 'FiledInMultiCasesReview';
