import { ModalDialog } from '@web-client/views/ModalDialog';
import { connect } from '@cerebral/react';
import React from 'react';

export const PrintPreviouslyGeneratedPaperServiceModal = connect(
  {},
  function PrintPreviouslyGeneratedPaperServiceModal() {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={() => {}}
        confirmLabel="Open PDF"
        confirmSequence={() => {}}
        message="Select the PDF(s) that you would like to print. They will open in seperate tabs and be available for three days after the PDF was originally generated."
        title="Print Paper Service PDF"
      >
        <div className="usa-checkbox">
          <input
            checked={false}
            className="usa-checkbox__input"
            id="attachments"
            name="attachments"
            type="checkbox"
            onChange={() => {}}
          />
          <label className="usa-checkbox__label" htmlFor="attachments">
            NOTT
          </label>
        </div>
      </ModalDialog>
    );
  },
);

PrintPreviouslyGeneratedPaperServiceModal.displayName =
  'PrintPreviouslyGeneratedPaperServiceModal';
