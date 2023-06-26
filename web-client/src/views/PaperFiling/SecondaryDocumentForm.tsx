import { NonstandardForm } from '../FileDocument/NonstandardForm';
import { connect } from '@cerebral/react';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SecondaryDocumentForm = connect(
  {
    addDocketEntryHelper: state.addDocketEntryHelper,
  },
  function SecondaryDocumentForm({ addDocketEntryHelper }) {
    return (
      <React.Fragment>
        {addDocketEntryHelper.secondary.showNonstandardForm && (
          <NonstandardForm
            helper="addDocketEntryHelper"
            level="secondary"
            namespace="secondaryDocument"
            updateSequence="updateDocketEntryFormValueSequence"
            validateSequence="validateDocketEntrySequence"
            validationErrors="validationErrors.secondaryDocument"
          />
        )}
      </React.Fragment>
    );
  },
);

SecondaryDocumentForm.displayName = 'SecondaryDocumentForm';
