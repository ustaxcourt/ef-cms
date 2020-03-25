import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const EditDocketEntryMetaDocketEntryPreview = connect(
  {
    addCourtIssuedDocketEntryHelper: state.addCourtIssuedDocketEntryHelper,
    documentTitlePreview: state.screenMetadata.documentTitlePreview,
    editType: state.screenMetadata.editType,
    noDocumentDescription: state.form.description,
  },
  function EditDocketEntryMetaDocketEntryPreview({
    addCourtIssuedDocketEntryHelper,
    documentTitlePreview,
    editType,
    noDocumentDescription,
  }) {
    return (
      <>
        {(editType === 'CourtIssued' &&
          addCourtIssuedDocketEntryHelper.formattedDocumentTitle) ||
          ''}
        {(editType === 'Document' && documentTitlePreview) || ''}
        {(editType === 'NoDocument' && noDocumentDescription) || ''}
      </>
    );
  },
);
