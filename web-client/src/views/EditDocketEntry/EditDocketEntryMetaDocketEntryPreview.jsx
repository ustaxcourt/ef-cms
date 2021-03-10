import { connect } from '@cerebral/react';
import { state } from 'cerebral';
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
    console.log('documentTitlePreview', documentTitlePreview);
    console.log(
      'addCourtIssuedDocketEntryHelper.formattedDocumentTitle',
      addCourtIssuedDocketEntryHelper.formattedDocumentTitle,
    );
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
