import { PetitionQcScanBatchPreviewer } from '../PetitionQcScanBatchPreviewer';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PetitionQcDocumentPreview = connect(
  {
    documentSelectedForPreview:
      state.currentViewMetadata.documentSelectedForPreview,
  },
  function PetitionQcDocumentPreview({ documentSelectedForPreview }) {
    return (
      <>
        <PetitionQcScanBatchPreviewer
          documentTabs={[
            {
              documentType: 'petitionFile',
              title: 'Petition',
            },
            {
              documentType: 'stinFile',
              title: 'STIN',
            },
            {
              documentType: 'requestForPlaceOfTrialFile',
              title: 'RQT',
            },
            {
              documentType: 'ownershipDisclosureFile',
              title: 'ODS',
            },
            {
              documentType: 'applicationForWaiverOfFilingFeeFile',
              title: 'APW',
            },
          ]}
          documentType={documentSelectedForPreview}
          title="Add Document(s)"
        />
      </>
    );
  },
);
