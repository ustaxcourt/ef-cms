import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ConfirmInitiateServiceModal } from '../ConfirmInitiateServiceModal';
import { DocumentDisplayIframe } from '../DocumentDetail/DocumentDisplayIframe';
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

export const AddDocketEntry = connect(
  {
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    openConfirmPaperServiceModalSequence:
      sequences.openConfirmPaperServiceModalSequence,
    paperDocketEntryHelper: state.paperDocketEntryHelper,
    saveAndServeDocketEntrySequence: sequences.saveAndServeDocketEntrySequence,
    saveForLaterDocketEntrySequence: sequences.saveForLaterDocketEntrySequence,
    showModal: state.modal.showModal,
  },
  function AddDocketEntry({
    form,
    formCancelToggleCancelSequence,
    isEditingDocketEntry,
    openConfirmPaperServiceModalSequence,
    paperDocketEntryHelper,
    saveAndServeDocketEntrySequence,
    saveForLaterDocketEntrySequence,
    showModal,
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
                {isEditingDocketEntry ? 'Edit' : 'Add'} Docket Entry
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
                      saveForLaterDocketEntrySequence();
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
              {paperDocketEntryHelper.docketEntryHasDocument && (
                <DocumentDisplayIframe />
              )}
              {!paperDocketEntryHelper.docketEntryHasDocument && (
                <ScanBatchPreviewer
                  documentType="primaryDocumentFile"
                  title="Add Document"
                />
              )}
            </div>
          </div>
        </section>

        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal
            confirmSequence={saveAndServeDocketEntrySequence}
          />
        )}
        {showModal === 'ConfirmInitiateServiceModal' && (
          <ConfirmInitiateServiceModal
            confirmSequence={saveAndServeDocketEntrySequence}
            documentTitle={form.documentTitle}
          />
        )}
      </>
    );
  },
);
