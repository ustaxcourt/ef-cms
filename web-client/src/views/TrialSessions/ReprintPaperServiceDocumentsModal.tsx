import { ModalDialog } from '@web-client/views/ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ReprintPaperServiceDocumentsModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
    form: state.modal.form,
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
    openSelectedTrialSessionPaperServicePdfSequence:
      sequences.openSelectedTrialSessionPaperServicePdfSequence,
    updatePDFsSelectedForPrintSequence:
      sequences.updatePDFsSelectedForPrintSequence,
  },
  function ReprintPaperServiceDocumentsModal({
    clearModalSequence,
    form,
    formattedTrialSessionDetails,
    openSelectedTrialSessionPaperServicePdfSequence,
    updatePDFsSelectedForPrintSequence,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={clearModalSequence}
        confirmLabel="Open PDF"
        confirmSequence={openSelectedTrialSessionPaperServicePdfSequence}
        message="Select the PDF(s) that you would like to print. They will open in seperate tabs and be available for three days after the PDF was originally generated."
        title="Print Paper Service PDF"
      >
        {formattedTrialSessionDetails.paperServicePdfs.map(pdfInfo => {
          return (
            <div className="usa-radio" key={pdfInfo.fileId}>
              <input
                checked={form.selectedPdf === pdfInfo.fileId}
                className="usa-radio__input"
                id={`${pdfInfo.fileId}`}
                name={`${pdfInfo.fileId}`}
                type="radio"
                onChange={e => {
                  updatePDFsSelectedForPrintSequence({
                    key: e.target.name,
                  });
                }}
              />
              <label className="usa-radio__label" htmlFor={`${pdfInfo.fileId}`}>
                {pdfInfo.title}
              </label>
            </div>
          );
        })}
      </ModalDialog>
    );
  },
);

ReprintPaperServiceDocumentsModal.displayName =
  'ReprintPaperServiceDocumentsModal';
