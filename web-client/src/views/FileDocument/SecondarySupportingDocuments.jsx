import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SecondarySupportingDocumentForm } from './SecondarySupportingDocumentForm';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SecondarySupportingDocuments = connect(
  {
    addSupportingDocumentToFormSequence:
      sequences.addSupportingDocumentToFormSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
  },
  ({ addSupportingDocumentToFormSequence, fileDocumentHelper, form }) => {
    return (
      <>
        {form.hasSecondarySupportingDocuments &&
          form.secondarySupportingDocuments.map((item, idx) => (
            <SecondarySupportingDocumentForm index={idx} key={idx} />
          ))}

        {fileDocumentHelper.showAddSecondarySupportingDocuments && (
          <button
            className="usa-button usa-button--outline margin-top-205"
            onClick={() => {
              addSupportingDocumentToFormSequence({ type: 'secondary' });
            }}
          >
            <FontAwesomeIcon
              className="margin-right-05"
              icon="plus-circle"
              size="1x"
            />
            Add Secondary Supporting Document
          </button>
        )}
      </>
    );
  },
);
