import { BigHeader } from './../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseInformation } from './CaseInformation';
import { ErrorNotification } from './../ErrorNotification';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FormCancelModalDialog } from './../FormCancelModalDialog';
import { IRSNotice } from '../IRSNotice';
import { Parties } from './Parties';
import { ScanBatchPreviewer } from './../ScanBatchPreviewer';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const StartCaseInternal = connect(
  {
    documentSelectedForScan: state.currentViewMetadata.documentSelectedForScan,
    documentTabs: state.constants.INITIAL_FILING_DOCUMENT_TABS,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.modal.showModal,
    submitPetitionFromPaperSequence: sequences.submitPetitionFromPaperSequence,
    validatePetitionFromPaperSequence:
      sequences.validatePetitionFromPaperSequence,
  },
  function StartCaseInternal({
    documentSelectedForScan,
    documentTabs,
    formCancelToggleCancelSequence,
    showModal,
    submitPetitionFromPaperSequence,
    validatePetitionFromPaperSequence,
  }) {
    return (
      <>
        <BigHeader text="Create Case" />
        <section className="usa-section grid-container">
          <div noValidate aria-labelledby="start-case-header" role="form">
            {showModal === 'FormCancelModalDialog' && (
              <FormCancelModalDialog onCancelSequence="closeModalAndReturnToDashboardSequence" />
            )}
            <ErrorNotification />
            <div className="grid-row grid-gap">
              <div className="grid-col-12">
                <Focus>
                  <h2 className="margin-bottom-105">Petition</h2>
                </Focus>
              </div>
              <div className="grid-col-5">
                <Tabs
                  bind="currentViewMetadata.startCaseInternal.tab"
                  className="container-tabs no-full-border-bottom flex tab-button-h3 overflow-hidden"
                >
                  <Tab id="tab-parties" tabName="partyInfo" title="Parties">
                    <Parties />
                  </Tab>
                  <Tab
                    data-testid="tab-case-info"
                    id="tab-case-info"
                    tabName="caseInfo"
                    title="Case Info"
                  >
                    <CaseInformation />
                  </Tab>
                  <Tab
                    data-testid="tab-irs-notice"
                    id="tab-irs-notice"
                    tabName="irsNotice"
                    title="IRS Notice"
                  >
                    <div className="blue-container">
                      <IRSNotice validationName="validateCaseDetailSequence" />
                    </div>
                  </Tab>
                </Tabs>
              </div>
              <div className="grid-col-7">
                <ScanBatchPreviewer
                  documentTabs={documentTabs}
                  documentType={documentSelectedForScan}
                  title="Add Document(s)"
                  validateSequence={validatePetitionFromPaperSequence}
                />
              </div>
            </div>
            <div className="grid-row grid-gap margin-top-3">
              <div className="grid-col-5">
                <Button
                  data-testid="submit-paper-petition"
                  id="submit-case"
                  type="button"
                  onClick={() => {
                    submitPetitionFromPaperSequence();
                  }}
                >
                  Create Case
                </Button>
                <Button
                  link
                  onClick={() => {
                    formCancelToggleCancelSequence();
                    return false;
                  }}
                >
                  Cancel
                </Button>
              </div>
              <div className="grid-col-7" />
            </div>
          </div>
        </section>

        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal
            confirmSequence={submitPetitionFromPaperSequence}
          />
        )}
      </>
    );
  },
);

StartCaseInternal.displayName = 'StartCaseInternal';
