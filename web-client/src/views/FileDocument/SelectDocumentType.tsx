import { Button } from '../../ustc-ui/Button/Button';
import { CompleteDocumentTypeSection } from './CompleteDocumentTypeSection';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
    formCancelToggleCancelSequence,
  }) {
    return (
      <React.Fragment>
        <div className="grid-container">
          <div className="grid-row">
            <div className="tablet:grid-col-6">
              <h1 id="file-a-document-header" tabIndex={-1}>
                What Document are You Filing?
              </h1>

              <div className="blue-container margin-bottom-5 complete-document-type-section">
                <CompleteDocumentTypeSection />
              </div>
              <Button
                data-testid="submit-document"
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
      </React.Fragment>
    );
  },
);

SelectDocumentType.displayName = 'SelectDocumentType';
