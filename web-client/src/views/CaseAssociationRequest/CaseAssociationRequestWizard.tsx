import { CaseAssociationRequest } from './CaseAssociationRequest';
import { CaseAssociationRequestReview } from './CaseAssociationRequestReview';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const CaseAssociationRequestWizard = connect(
  {
    showModal: state.modal.showModal,
  },
  function CaseAssociationRequestWizard({ showModal }) {
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
              <CaseAssociationRequest />
            </Tab>
            <Tab tabName="RepresentAPartyReview">
              <CaseAssociationRequestReview />
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);

CaseAssociationRequestWizard.displayName = 'CaseAssociationRequestWizard';
