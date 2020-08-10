import { PetitionQcScanBatchPreviewer } from '../PetitionQcScanBatchPreviewer';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PetitionQcDocumentPreview = connect(
  {
    documentSelectedForPreview:
      state.currentViewMetadata.documentSelectedForPreview,
  },
  function PetitionQcDocumentPreview({
    documentSelectedForPreview,
    documentTabs,
  }) {
    return (
      <>
        <PetitionQcScanBatchPreviewer
          documentTabs={documentTabs}
          documentType={documentSelectedForPreview}
          title="Add Document(s)"
        />
      </>
    );
  },
);
