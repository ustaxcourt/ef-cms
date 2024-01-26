import { PetitionQcScanBatchPreviewer } from '../PetitionQcScanBatchPreviewer';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PetitionQcDocumentPreview = connect(
  {
    documentSelectedForPreview:
      state.currentViewMetadata.documentSelectedForPreview,
    petitionQcHelper: state.petitionQcHelper,
  },
  function PetitionQcDocumentPreview({
    documentSelectedForPreview,
    petitionQcHelper,
  }) {
    console.log('here in PetitionQcDocumentPreview', PetitionQcDocumentPreview);

    return (
      <>
        <PetitionQcScanBatchPreviewer
          documentTabs={petitionQcHelper.documentTabsToDisplay}
          documentType={documentSelectedForPreview}
          title="Add Document(s)"
        />
      </>
    );
  },
);

PetitionQcDocumentPreview.displayName = 'PetitionQcDocumentPreview';
