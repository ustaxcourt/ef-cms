import { Button } from '../../ustc-ui/Button/Button';
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
          <Button
            secondary
            className="margin-top-205"
            id="add-secondary-supporting-document-button"
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
          </Button>
        )}

        {fileDocumentHelper.showAddSecondarySupportingDocumentsLimitReached && (
          <p>
            You can only add 5 supporting documents at a time. You may file
            another supporting document in a separate filing.
          </p>
        )}
      </>
    );
  },
);
