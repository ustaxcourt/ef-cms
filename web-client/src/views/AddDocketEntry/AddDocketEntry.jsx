import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { PrimaryDocumentForm } from './PrimaryDocumentForm';
import { ScanBatchPreviewer } from '../ScanBatchPreviewer';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddDocketEntry = connect(
  {
    caseDetail: state.caseDetail,
    showModal: state.showModal,
    submitDocketEntrySequence: sequences.submitDocketEntrySequence,
  },
  ({ caseDetail, showModal, submitDocketEntrySequence }) => {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="grid-row grid-gap">
            <div className="grid-col-12">
              <h1 className="margin-bottom-105">Add Docket Entry</h1>
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
                  <a
                    className="margin-left-1"
                    href={`/case-detail/${caseDetail.docketNumber}`}
                    id="cancel-button"
                  >
                    Cancel
                  </a>
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
