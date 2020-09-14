import { Button } from '../../ustc-ui/Button/Button';
import { CheckConsolidatedCasesModal } from './CheckConsolidatedCasesModal';
import { CompleteDocumentTypeSection } from './CompleteDocumentTypeSection';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SelectDocumentType = connect(
  {
    completeDocumentSelectSequence: sequences.completeDocumentSelectSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    gotoViewAllDocumentsSequence: sequences.gotoViewAllDocumentsSequence,
    reasons: state.viewAllDocumentsHelper.reasons,
    showModal: state.modal.showModal,
  },
  function SelectDocumentType({
    completeDocumentSelectSequence,
    fileDocumentHelper,
    formCancelToggleCancelSequence,
    showModal,
  }) {
    return (
      <React.Fragment>
        <div className="grid-container">
          <div className="grid-row">
            <div className="tablet:grid-col-6">
              {fileDocumentHelper.formattedDocketNumbers && (
                <Hint exclamation>
                  Your documents will be filed in docket numbers{' '}
                  {fileDocumentHelper.formattedDocketNumbers}.
                </Hint>
              )}
              <h1 id="file-a-document-header" tabIndex="-1">
                What Document are You Filing?
              </h1>

              <div className="blue-container margin-bottom-5 complete-document-type-section">
                <CompleteDocumentTypeSection />
              </div>
              <Button
                id="submit-document"
                type="submit"
                onClick={() => {
                  completeDocumentSelectSequence();
                }}
              >
                Continue
              </Button>
              <Button
                link
                onClick={() => {
                  formCancelToggleCancelSequence();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
        {showModal === 'CheckConsolidatedCasesModal' && (
          <CheckConsolidatedCasesModal />
        )}
      </React.Fragment>
    );
  },
);
