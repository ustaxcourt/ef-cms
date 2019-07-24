import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { StartCaseStep1 } from './StartCaseStep1';
import { StartCaseStep2 } from './StartCaseStep2';
import { StartCaseStep3 } from './StartCaseStep3';
import { StartCaseStep4 } from './StartCaseStep4';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const StartCaseWizard = connect(
  {
    showModal: state.showModal,
  },
  ({ showModal }) => {
    return (
      <>
        <BigHeader text="File a Petition" />
        <section
          className="usa-section grid-container"
          id="ustc-start-a-case-form"
        >
          <div className="grid-container">
            {showModal == 'FormCancelModalDialog' && (
              <FormCancelModalDialog onCancelSequence="closeModalAndReturnToDashboardSequence" />
            )}
            <SuccessNotification />
            <ErrorNotification />
          </div>
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
          </Tabs>
        </section>
      </>
    );
  },
);
