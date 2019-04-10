import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FileDocument } from './FileDocument';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  },
  ({ caseDetail, chooseWizardStepSequence }) => {
    return (
      <>
        <div className="usa-grid breadcrumb">
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
                className="link"
                id="queue-nav"
                type="button"
                onClick={() =>
                  chooseWizardStepSequence({ value: 'SelectDocumentType' })
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
          </Tabs>
        </section>
      </>
    );
  },
);
