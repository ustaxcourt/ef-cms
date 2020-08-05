import { Button } from '../../ustc-ui/Button/Button';
import { ConfirmDeletePDFModal } from '../ConfirmDeletePdfModal';
import { ConfirmReplacePetitionModal } from '../ConfirmReplacePetitionModal';
import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PetitionQcDocumentPreview = connect(
  {
    constants: state.constants,
    isPetitionFile: state.petitionQcHelper.isPetitionFile,
    openConfirmDeletePDFModalSequence:
      sequences.openConfirmDeletePDFModalSequence,
    openConfirmReplacePetitionPdfSequence:
      sequences.openConfirmReplacePetitionPdfSequence,
    pdfPreviewUrl: state.pdfPreviewUrl,
    selectDocumentForPetitionQcPreviewSequence:
      sequences.selectDocumentForPetitionQcPreviewSequence,
    showModal: state.modal.showModal,
  },
  function PetitionQcDocumentPreview({
    documentTabs,
    isPetitionFile,
    openConfirmDeletePDFModalSequence,
    openConfirmReplacePetitionPdfSequence,
    pdfPreviewUrl,
    selectDocumentForPetitionQcPreviewSequence,
    showModal,
    title,
  }) {
    const renderIframePreview = () => {
      return (
        <>
          {showModal === 'ConfirmDeletePDFModal' && (
            <ConfirmDeletePDFModal
              confirmSequence="deleteUploadedPdfSequence"
              confirmText="Yes, Remove"
              modalContent="The current PDF will be permanently removed, and you will need to add a new PDF."
              title="Are You Sure to Remove this PDF?"
            />
          )}

          {showModal === 'ConfirmReplacePetitionModal' && (
            <ConfirmReplacePetitionModal confirmSequence="removePetitionForReplacementSequence" />
          )}
          <div className="padding-top-2">
            {pdfPreviewUrl && (
              <Button
                link
                className="red-warning push-right"
                onClick={() => {
                  if (isPetitionFile) {
                    openConfirmReplacePetitionPdfSequence();
                  } else {
                    openConfirmDeletePDFModalSequence();
                  }
                }}
              >
                Remove PDF
              </Button>
            )}
            <PdfPreview noDocumentText="No document added" />
          </div>
        </>
      );
    };

    const renderTabs = documentTabs => {
      if (documentTabs && documentTabs.length > 1) {
        return (
          <Tabs
            bind="currentViewMetadata.documentSelectedForPreview"
            className="document-select container-tabs margin-top-neg-205 margin-x-neg-205"
            onSelect={() => {
              selectDocumentForPetitionQcPreviewSequence();
            }}
          >
            {documentTabs.map(documentTab => (
              <Tab
                key={documentTab.documentType}
                tabName={documentTab.documentType}
                title={documentTab.title}
              />
            ))}
          </Tabs>
        );
      }

      return null;
    };

    return (
      <>
        <div className="scanner-area-header">
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-6">
                <h3 className="margin-bottom-0 margin-left-105">{title}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="document-select-container">
          {renderTabs(documentTabs)}
          {renderIframePreview()}
        </div>
      </>
    );
  },
);
