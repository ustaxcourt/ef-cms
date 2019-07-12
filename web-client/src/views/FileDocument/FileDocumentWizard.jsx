import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FileDocument } from './FileDocument';
import { FileDocumentReview } from './FileDocumentReview';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { SelectDocumentType } from './SelectDocumentType';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { ViewAllDocuments } from './ViewAllDocuments';
import { ViewDocumentCategory } from './ViewDocumentCategory';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const FileDocumentWizard = connect(
  {
    showModal: state.showModal,
  },
  ({ showModal }) => {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section">
          <div className="grid-container">
            {showModal == 'FormCancelModalDialogComponent' && (
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
              <div className="grid-container">
                <SelectDocumentType />
              </div>
            </Tab>
            <Tab tabName="ViewAllDocuments">
              <ViewAllDocuments />
            </Tab>
            <Tab tabName="FileDocument">
              <div className="grid-container">
                <FileDocument />
              </div>
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
