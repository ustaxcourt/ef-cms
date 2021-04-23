import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ConfirmInitiateServiceModal } from '../ConfirmInitiateServiceModal';
import { ErrorNotification } from '../ErrorNotification';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { PrimaryDocumentForm } from './PrimaryDocumentForm';
import { ScanBatchPreviewer } from '../ScanBatchPreviewer';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddPaperFiling = connect(
  {
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    openConfirmPaperServiceModalSequence:
      sequences.openConfirmPaperServiceModalSequence,
    showModal: state.modal.showModal,
    submitAddPaperFilingSequence: sequences.submitAddPaperFilingSequence,
  },
  function AddPaperFiling({
    form,
    formCancelToggleCancelSequence,
    openConfirmPaperServiceModalSequence,
    showModal,
    submitAddPaperFilingSequence,
  }) {
    return (
      <>
        <CaseDetailHeader />

        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <h1 className="margin-bottom-105">
            <span>Add Paper Filing</span>
          </h1>

          <div className="grid-row grid-gap">
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
                      submitAddPaperFilingSequence({
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
          <FileUploadErrorModal
            confirmSequence={submitAddPaperFilingSequence}
          />
        )}
        {showModal === 'ConfirmInitiateServiceModal' && (
          <ConfirmInitiateServiceModal
            confirmSequence={submitAddPaperFilingSequence}
            documentTitle={form.documentTitle}
          />
        )}
      </>
    );
  },
);
