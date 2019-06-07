import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { PrimaryDocumentForm } from './PrimaryDocumentForm';
import { SuccessNotification } from '../SuccessNotification';
import { SupportingDocumentForm } from './SupportingDocumentForm';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddDocketEntry = connect(
  {
    caseDetail: state.caseDetail,
    screenMetadata: state.screenMetadata,
    showModal: state.showModal,
    submitDocketEntrySequence: sequences.submitDocketEntrySequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  ({
    caseDetail,
    submitDocketEntrySequence,
    updateScreenMetadataSequence,
    screenMetadata,
    showModal,
  }) => {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container DocumentDetail">
          <SuccessNotification />
          <ErrorNotification />
          <div className="grid-container padding-x-0 add-bottom-margin">
            <div className="grid-row">
              <div className="mobile-lg:grid-col-4">
                <Tabs
                  asSwitch
                  defaultActiveTab="PrimaryDocumentForm"
                  bind="wizardStep"
                >
                  <Tab tabName="PrimaryDocumentForm">
                    <PrimaryDocumentForm />
                  </Tab>
                  <Tab tabName="SupportingDocumentForm">
                    <SupportingDocumentForm />
                  </Tab>
                </Tabs>
              </div>
              <div className="mobile-lg:grid-col-8" />
            </div>
          </div>

          <div className="button-box-container">
            <button
              id="save-and-finish"
              type="submit"
              className="usa-button"
              onClick={() => {
                updateScreenMetadataSequence({
                  key: 'supportingDocument',
                  value: false,
                });
                submitDocketEntrySequence();
              }}
            >
              Finish
            </button>
            <button
              type="button"
              id="save-and-add-supporting"
              className="usa-button usa-button--outline"
              onClick={() => {
                updateScreenMetadataSequence({
                  key: 'supportingDocument',
                  value: true,
                });
                submitDocketEntrySequence();
              }}
            >
              {screenMetadata.supporting &&
                'Add Another Supporting Document(s)'}
              {!screenMetadata.supporting && 'Add Supporting Document(s)'}
            </button>
            <a
              href={`/case-detail/${caseDetail.docketNumber}`}
              id="cancel-button"
            >
              Cancel
            </a>
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
