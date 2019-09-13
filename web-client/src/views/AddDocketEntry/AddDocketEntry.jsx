import { CaseDetailHeader } from '../CaseDetailHeader';
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
    caseDetail: state.caseDetail,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    isEditingDocketEntry: state.isEditingDocketEntry,
    showModal: state.showModal,
    submitDocketEntrySequence: sequences.submitDocketEntrySequence,
  },
  ({
    caseDetail,
    formCancelToggleCancelSequence,
    isEditingDocketEntry,
    showModal,
    submitDocketEntrySequence,
  }) => {
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
              {isEditingDocketEntry && (
                <Hint exclamation fullWidth>
                  This docket entry is incomplete. Add a document and save to
                  complete this entry.
                </Hint>
              )}
            </div>

            <div className="grid-col-5">
              <section className="usa-section DocumentDetail">
                <PrimaryDocumentForm />
                <div className="button-box-container">
                  <button
                    className="usa-button"
                    id="save-and-finish"
                    type="submit"
                    onClick={() => {
                      submitDocketEntrySequence();
                    }}
                  >
                    Finish
                  </button>
                  <button
                    className="usa-button usa-button--outline margin-left-1"
                    id="save-and-add-supporting"
                    type="button"
                    onClick={() => {
                      submitDocketEntrySequence({
                        docketNumber: caseDetail.docketNumber,
                        isAddAnother: true,
                      });
                    }}
                  >
                    Add Another Entry
                  </button>
                  <button
                    className="usa-button usa-button--unstyled margin-left-1"
                    id="cancel-button"
                    onClick={() => {
                      formCancelToggleCancelSequence();
                    }}
                  >
                    Cancel
                  </button>
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
          <FileUploadErrorModal confirmSequence={submitDocketEntrySequence} />
        )}
      </>
    );
  },
);
