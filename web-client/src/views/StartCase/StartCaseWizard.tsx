import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { StartCaseStep1 } from './StartCaseStep1';
import { StartCaseStep2 } from './StartCaseStep2';
import { StartCaseStep3 } from './StartCaseStep3';
import { StartCaseStep4 } from './StartCaseStep4';
import { StartCaseStep5 } from './StartCaseStep5';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const StartCaseWizard = connect(
  {
    showModal: state.modal.showModal,
    submitFilePetitionSequence: sequences.submitFilePetitionSequence,
  },
  function StartCaseWizard({ showModal, submitFilePetitionSequence }) {
    return (
      <>
        <BigHeader text="Create a Case" />
        <section
          className="usa-section grid-container"
          id="ustc-start-a-case-form"
        >
          <SuccessNotification />
          <ErrorNotification />

          <Tabs asSwitch bind="wizardStep" defaultActiveTab="StartCaseStep1">
            <Tab tabName="StartCaseStep1">
              <StartCaseStep1 />
            </Tab>
            <Tab tabName="StartCaseStep2">
              <StartCaseStep2 />
            </Tab>
            <Tab tabName="StartCaseStep3">
              <StartCaseStep3 />
            </Tab>
            <Tab tabName="StartCaseStep4">
              <StartCaseStep4 />
            </Tab>
            <Tab tabName="StartCaseStep5">
              <StartCaseStep5 />
            </Tab>
          </Tabs>
        </section>
        {showModal == 'FormCancelModalDialog' && (
          <FormCancelModalDialog
            useRunConfirmSequence={true}
            onCancelSequence="closeModalAndReturnToDashboardSequence"
          />
        )}
        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal confirmSequence={submitFilePetitionSequence} />
        )}
      </>
    );
  },
);

StartCaseWizard.displayName = 'StartCaseWizard';
