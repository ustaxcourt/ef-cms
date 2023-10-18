import { ModalDialog } from '@web-client/views/ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PrintPreviouslyGeneratedPaperServiceModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
    form: state.form,
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function PrintPreviouslyGeneratedPaperServiceModal({
    clearModalSequence,
    form,
    formattedTrialSessionDetails,
    updateFormValueSequence,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={clearModalSequence}
        confirmLabel="Open PDF"
        confirmSequence={() => {}}
        message="Select the PDF(s) that you would like to print. They will open in seperate tabs and be available for three days after the PDF was originally generated."
        title="Print Paper Service PDF"
      >
        {formattedTrialSessionDetails.paperServicePdfs.map(pdfInfo => {
          return (
            <div className="usa-checkbox" key={pdfInfo.documentId}>
              <input
                checked={form.selectedPdfs[pdfInfo.documentId] || false}
                className="usa-checkbox__input"
                id={`selectedPdfs-${pdfInfo.documentId}`}
                name={`selectedPdfs.${pdfInfo.documentId}`}
                type="checkbox"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                }}
              />
              <label
                className="usa-checkbox__label"
                htmlFor={`selectedPdfs-${pdfInfo.documentId}`}
              >
                {pdfInfo.title}
              </label>
            </div>
          );
        })}
      </ModalDialog>
    );
  },
);

PrintPreviouslyGeneratedPaperServiceModal.displayName =
  'PrintPreviouslyGeneratedPaperServiceModal';
