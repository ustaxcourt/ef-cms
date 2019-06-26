import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FileDocument } from './FileDocument';
import { FileDocumentReview } from './FileDocumentReview';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { SelectDocumentType } from './SelectDocumentType';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
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
        <section className="usa-section grid-container">
          {showModal == 'FormCancelModalDialogComponent' && (
            <FormCancelModalDialog onCancelSequence="closeModalAndReturnToDashboardSequence" />
          )}
          <SuccessNotification />
          <ErrorNotification />
          <Tabs
            asSwitch
            bind="wizardStep"
            defaultActiveTab="SelectDocumentType"
          >
            <Tab tabName="SelectDocumentType">
              <SelectDocumentType />
            </Tab>
            <Tab tabName="FileDocument">
              <FileDocument />
            </Tab>
            <Tab tabName="FileDocumentReview">
              <FileDocumentReview />
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);
