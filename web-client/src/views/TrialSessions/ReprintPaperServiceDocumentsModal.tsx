import { Button } from '@web-client/ustc-ui/Button/Button';
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
  },
  function ReprintPaperServiceDocumentsModal({
    clearModalSequence,
    formattedTrialSessionDetails,
    openSelectedTrialSessionPaperServicePdfSequence,
  }) {
    return (
      <ModalDialog
        cancelSequence={clearModalSequence}
        confirmLabel="Done"
        confirmSequence={clearModalSequence}
        message="Select the PDF that you would like to print. It will open in a separate tab and be available for three days after the PDF was originally generated."
        messageClass=""
        title="Print Paper Service PDF"
      >
        <div data-testid="trial-session-paper-pdf-options">
          {formattedTrialSessionDetails.paperServicePdfs.map(pdfInfo => {
            return (
              <div key={pdfInfo.fileId}>
                <Button
                  link
                  onClick={() => {
                    openSelectedTrialSessionPaperServicePdfSequence({
                      selectedPdf: pdfInfo.fileId,
                    });
                  }}
                >
                  {pdfInfo.title}
                </Button>
              </div>
            );
          })}
        </div>
      </ModalDialog>
    );
  },
);

ReprintPaperServiceDocumentsModal.displayName =
  'ReprintPaperServiceDocumentsModal';
