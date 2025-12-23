import { PetitionQcScanBatchPreviewer } from '../PetitionQcScanBatchPreviewer';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type PetitionQcDocumentPreviewProps = {
  title: string;
}

export const PetitionQcDocumentPreview: React.FC<PetitionQcDocumentPreviewProps> = connect(
  {
    documentSelectedForPreview:
      state.currentViewMetadata.documentSelectedForPreview,
    petitionQcHelper: state.petitionQcHelper,
  },
  function PetitionQcDocumentPreview({
    documentSelectedForPreview,
    petitionQcHelper,
  }) {
    if (!documentSelectedForPreview) {
      return null;
    }

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
