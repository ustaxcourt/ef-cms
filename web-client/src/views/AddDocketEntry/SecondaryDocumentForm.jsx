import { NonstandardForm } from '../FileDocument/NonstandardForm';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SecondaryDocumentForm = connect(
  {
    addDocketEntryHelper: state.addDocketEntryHelper,
    constants: state.constants,
    form: state.form,
    updateDocketEntryFormValueSequence:
      sequences.updateDocketEntryFormValueSequence,
    validateDocketEntrySequence: sequences.validateDocketEntrySequence,
    validationErrors: state.validationErrors,
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
