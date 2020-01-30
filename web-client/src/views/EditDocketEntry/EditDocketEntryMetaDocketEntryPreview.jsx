import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const EditDocketEntryMetaDocketEntryPreview = connect(
  {
    addCourtIssuedDocketEntryHelper: state.addCourtIssuedDocketEntryHelper,
    editDocketEntryMetaHelper: state.editDocketEntryMetaHelper,
    form: state.form,
  },
  ({ addCourtIssuedDocketEntryHelper, editDocketEntryMetaHelper, form }) => {
    return (
      <>
        {editDocketEntryMetaHelper.docketEntryMetaFormComponent ===
          'CourtIssued' &&
          addCourtIssuedDocketEntryHelper.formattedDocumentTitle}
        {editDocketEntryMetaHelper.docketEntryMetaFormComponent ===
          'NoDocument' &&
          form &&
          form.description}
      </>
    );
  },
);
