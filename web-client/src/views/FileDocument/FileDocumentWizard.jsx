import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FileDocument } from './FileDocument';
import { FileDocumentReview } from './FileDocumentReview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { SelectDocumentType } from './SelectDocumentType';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const FileDocumentWizard = connect(
  {
    caseDetail: state.formattedCaseDetail,
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    showModal: state.showModal,
  },
  ({ caseDetail, chooseWizardStepSequence, showModal }) => {
    return (
      <>
        <section className="usa-section grid-container">
          <CaseDetailHeader />
          {showModal == 'FormCancelModalDialogComponent' && (
            <FormCancelModalDialog />
          )}
          <SuccessNotification />
          <ErrorNotification />
          <Tabs
            asSwitch
            defaultActiveTab="SelectDocumentType"
            bind="wizardStep"
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
