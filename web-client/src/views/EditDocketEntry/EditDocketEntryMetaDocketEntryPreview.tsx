import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const EditDocketEntryMetaDocketEntryPreview = connect(
  {
    addCourtIssuedDocketEntryHelper: state.addCourtIssuedDocketEntryHelper,
    documentTitlePreview: state.screenMetadata.documentTitlePreview,
    editType: state.screenMetadata.editType,
    noDocumentDescription: state.form.documentTitle,
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

EditDocketEntryMetaDocketEntryPreview.displayName =
  'EditDocketEntryMetaDocketEntryPreview';
