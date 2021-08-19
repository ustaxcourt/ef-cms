import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ConfirmInitiateServiceModal } from '../ConfirmInitiateServiceModal';
import { ErrorNotification } from '../ErrorNotification';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { PrimaryDocumentForm } from './PrimaryDocumentForm';
import { ScanBatchPreviewer } from '../ScanBatchPreviewer';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PaperFiling = connect(
  {
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    isEditingDocketEntry: state.isEditingDocketEntry,
    openConfirmPaperServiceModalSequence:
      sequences.openConfirmPaperServiceModalSequence,
    paperDocketEntryHelper: state.paperDocketEntryHelper,
    showModal: state.modal.showModal,
    submitPaperFilingSequence: sequences.submitPaperFilingSequence,
  },
  function PaperFiling({
    form,
    formCancelToggleCancelSequence,
    isEditingDocketEntry,
    openConfirmPaperServiceModalSequence,
    paperDocketEntryHelper,
    showModal,
    submitPaperFilingSequence,
  }) {
    return (
      <>
        <CaseDetailHeader />

        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />

          <div className="grid-row grid-gap">
            <div className="grid-col-5">
              <h1 className="margin-bottom-105">
                <span>
                  {isEditingDocketEntry ? 'Edit' : 'Add'} Paper Filing
                </span>
              </h1>
            </div>

            <div className="grid-col-7">
              {paperDocketEntryHelper.showAddDocumentWarning && (
                <Hint exclamation fullWidth>
                  This docket entry is incomplete. Add a document and save to
                  complete this entry.
                </Hint>
              )}
            </div>

            <div className="grid-col-5">
              <section className="usa-section DocumentDetail">
                <PrimaryDocumentForm />
                <div className="margin-top-5">
                  <Button
                    id="save-and-serve"
                    type="submit"
                    onClick={() => {
                      openConfirmPaperServiceModalSequence();
                    }}
                  >
                    Save and Serve
                  </Button>
                  <Button
                    secondary
                    id="save-for-later"
                    onClick={() => {
                      submitPaperFilingSequence({
                        isSavingForLater: true,
                      });
                    }}
                  >
                    Save for Later
                  </Button>
                  <Button
                    link
                    id="cancel-button"
                    onClick={() => {
                      formCancelToggleCancelSequence();
                    }}
                  >
                    Cancel
                  </Button>
                  {showModal === 'FormCancelModalDialog' && (
                    <FormCancelModalDialog onCancelSequence="closeModalAndReturnToCaseDetailSequence" />
                  )}
                </div>
              </section>
            </div>
            <div className="grid-col-7">
              <ScanBatchPreviewer
                documentType="primaryDocumentFile"
                title="Add Document"
              />
            </div>
          </div>
        </section>

        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal confirmSequence={submitPaperFilingSequence} />
        )}
        {showModal === 'ConfirmInitiateServiceModal' && (
          <ConfirmInitiateServiceModal
            confirmSequence={submitPaperFilingSequence}
            documentTitle={form.documentTitle}
          />
        )}
      </>
    );
  },
);
