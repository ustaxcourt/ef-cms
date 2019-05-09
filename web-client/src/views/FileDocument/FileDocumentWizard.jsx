import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FileDocument } from './FileDocument';
import { FileDocumentReview } from './FileDocumentReview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormCancelModalDialog } from '../modals/FormCancelModalDialog';
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
        <div className="grid-container breadcrumb">
          <Tabs asSwitch bind="wizardStep">
            <Tab tabName="SelectDocumentType">
              <FontAwesomeIcon icon="caret-left" />
              <a
                href={`/case-detail/${caseDetail.docketNumber}`}
                id="queue-nav"
              >
                Back
              </a>
            </Tab>
            <Tab tabName="FileDocument">
              <FontAwesomeIcon icon="caret-left" />
              <button
                className="usa-button usa-button--unstyled"
                id="queue-nav"
                type="button"
                onClick={() =>
                  chooseWizardStepSequence({ value: 'SelectDocumentType' })
                }
              >
                Back
              </button>
            </Tab>
            <Tab tabName="FileDocumentReview">
              <FontAwesomeIcon icon="caret-left" />
              <button
                className="usa-button usa-button--unstyled"
                id="queue-nav"
                type="button"
                onClick={() =>
                  chooseWizardStepSequence({ value: 'FileDocument' })
                }
              >
                Back
              </button>
            </Tab>
          </Tabs>
        </div>
        <section className="usa-section grid-container">
          <CaseDetailHeader />
          <hr aria-hidden="true" />
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
