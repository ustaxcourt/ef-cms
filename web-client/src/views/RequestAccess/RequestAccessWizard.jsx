import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { RequestAccess } from './RequestAccess';
import { RequestAccessReview } from './RequestAccessReview';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const RequestAccessWizard = connect(
  {
    caseDetail: state.formattedCaseDetail,
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    showModal: state.showModal,
  },
  ({ caseDetail, chooseWizardStepSequence, showModal }) => {
    return (
      <>
        <div className="usa-grid breadcrumb">
          <Tabs asSwitch bind="wizardStep">
            <Tab tabName="RequestAccess">
              <FontAwesomeIcon icon="caret-left" />
              <a
                href={`/case-detail/${caseDetail.docketNumber}`}
                id="queue-nav"
              >
                Back
              </a>
            </Tab>
            <Tab tabName="RequestAccessReview">
              <FontAwesomeIcon icon="caret-left" />
              <button
                className="link"
                id="queue-nav"
                type="button"
                onClick={() =>
                  chooseWizardStepSequence({ value: 'RequestAccess' })
                }
              >
                Back
              </button>
            </Tab>
          </Tabs>
        </div>
        <section className="usa-section usa-grid">
          <CaseDetailHeader />
          <hr aria-hidden="true" />
          {showModal == 'FormCancelModalDialogComponent' && (
            <FormCancelModalDialog />
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
