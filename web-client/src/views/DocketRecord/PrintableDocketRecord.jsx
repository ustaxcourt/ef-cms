import { CaseDetailHeader } from '../CaseDetailHeader';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';

export const PrintableDocketRecord = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    navigateToCaseDetailSequence: sequences.navigateToCaseDetailSequence,
  },
  ({ formattedCaseDetail, navigateToCaseDetailSequence }) => {
    return (
      <>
        <CaseDetailHeader hideActionButtons />

        <div className="grid-container print-docket-record">
          <button
            className="usa-button usa-button--unstyled margin-bottom-3"
            onClick={() => {
              navigateToCaseDetailSequence({
                caseId: formattedCaseDetail.docketNumber,
              });
            }}
          >
            <FontAwesomeIcon icon={['fa', 'arrow-alt-circle-left']} />
            Back to Case
          </button>
          <PdfPreview />
        </div>
      </>
    );
  },
);
