import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { RequestAccess } from './RequestAccess';
import { RequestAccessReview } from './RequestAccessReview';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const RequestAccessWizard = connect(
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
          <Tabs asSwitch defaultActiveTab="RequestAccess" bind="wizardStep">
            <Tab tabName="RequestAccess">
              <RequestAccess />
            </Tab>
            <Tab tabName="RequestAccessReview">
              <RequestAccessReview />
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);
