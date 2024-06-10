import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { RepresentAParty } from './RepresentAParty';
import { RepresentAPartyReview } from './RepresentAPartyReview';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const RepresentAPartyWizard = connect(
  {
    showModal: state.modal.showModal,
  },
  function RepresentAPartyWizard({ showModal }) {
    return (
      <>
        <CaseDetailHeader hideActionButtons />
        <section className="usa-section grid-container">
          {showModal == 'FormCancelModalDialog' && (
            <FormCancelModalDialog onCancelSequence="closeModalAndReturnToDashboardSequence" />
          )}
          <SuccessNotification />
          <ErrorNotification />
          <Tabs asSwitch bind="wizardStep" defaultActiveTab="RepresentAParty">
            <Tab tabName="RepresentAParty">
              <RepresentAParty />
            </Tab>
            <Tab tabName="RepresentAPartyReview">
              <RepresentAPartyReview />
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);

RepresentAPartyWizard.displayName = 'RepresentAPartyWizard';
