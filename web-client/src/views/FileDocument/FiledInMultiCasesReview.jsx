import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const FiledInMultiCasesReview = connect(
  {
    fileDocumentHelper: state.fileDocumentHelper,
  },
  ({ fileDocumentHelper }) => {
    return (
      <>
        <h3 className="underlined">Filed In These Cases</h3>
        {fileDocumentHelper.selectedCasesAsCase.map((selectedCase, index) => (
          <div className="grid-row grid-gap margin-bottom-1" key={index}>
            <div className="tablet:grid-col-2">{selectedCase.docketNumber}</div>
            <div className="tablet:grid-col-10">{selectedCase.caseName}</div>
          </div>
        ))}
      </>
    );
  },
);
