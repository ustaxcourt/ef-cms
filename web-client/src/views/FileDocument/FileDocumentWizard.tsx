import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FileDocument } from './FileDocument';
import { FileDocumentReview } from './FileDocumentReview';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { SelectDocumentType } from './SelectDocumentType';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { ViewAllDocuments } from './ViewAllDocuments';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const FileDocumentWizard = connect(
  {
    showModal: state.modal.showModal,
  },
  function FileDocumentWizard({ showModal }) {
    return (
      <>
        <CaseDetailHeader hideActionButtons />
        <section className="usa-section">
          <div className="grid-container">
            {showModal == 'FormCancelModalDialog' && (
              <FormCancelModalDialog onCancelSequence="closeModalAndReturnToDashboardSequence" />
            )}
            <SuccessNotification />
            <ErrorNotification />
          </div>
          <Tabs
            asSwitch
            bind="wizardStep"
            defaultActiveTab="SelectDocumentType"
          >
            <Tab tabName="SelectDocumentType">
              <SelectDocumentType />
            </Tab>
            <Tab tabName="ViewAllDocuments">
              <ViewAllDocuments />
            </Tab>
            <Tab tabName="FileDocument">
              <FileDocument />
            </Tab>
            <Tab tabName="FileDocumentReview">
              <div className="grid-container">
                <FileDocumentReview />
              </div>
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);

FileDocumentWizard.displayName = 'FileDocumentWizard';
