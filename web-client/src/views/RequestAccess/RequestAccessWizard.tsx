import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { RequestAccess } from './RequestAccess';
import { RequestAccessReview } from './RequestAccessReview';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const RequestAccessWizard = connect(
  {
    showModal: state.modal.showModal,
  },
  function RequestAccessWizard({ showModal }) {
    return (
      <>
        <CaseDetailHeader hideActionButtons />
        <section className="usa-section grid-container">
          {showModal == 'FormCancelModalDialog' && (
            <FormCancelModalDialog onCancelSequence="closeModalAndReturnToDashboardSequence" />
          )}
          <SuccessNotification />
          <ErrorNotification />
          <Tabs asSwitch bind="wizardStep" defaultActiveTab="RequestAccess">
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

RequestAccessWizard.displayName = 'RequestAccessWizard';
