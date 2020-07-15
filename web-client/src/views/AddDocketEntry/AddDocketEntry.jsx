import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
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
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    paperDocketEntryHelper: state.paperDocketEntryHelper,
    saveAndServeDocketEntrySequence: sequences.saveAndServeDocketEntrySequence,
    saveForLaterDocketEntrySequence: sequences.saveForLaterDocketEntrySequence,
    showModal: state.modal.showModal,
  },
  function AddDocketEntry({
    formCancelToggleCancelSequence,
    isEditingDocketEntry,
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
                    id="save-and-finish"
                    type="submit"
                    onClick={() => {
                      saveAndServeDocketEntrySequence();
                    }}
                  >
                    Save and Serve
                  </Button>

                  {/* TODO: update button attr 'id' (and potential pa11y) */}
                  <Button
                    secondary
                    id="save-and-add-supporting"
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
      </>
    );
  },
);
