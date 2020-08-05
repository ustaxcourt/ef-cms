import { PetitionQcScanBatchPreviewer } from '../PetitionQcScanBatchPreviewer';
import { connect } from '@cerebral/react';
import React from 'react';

export const PetitionQcDocumentPreview = connect(
  {},
  function PetitionQcDocumentPreview() {
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
          documentType="stinFile"
          title="Add Document(s)"
        />
      </>
    );
  },
);
