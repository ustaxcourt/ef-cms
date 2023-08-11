import { PetitionQcScanBatchPreviewer } from '../PetitionQcScanBatchPreviewer';
import { connect } from '@cerebral/react';
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
