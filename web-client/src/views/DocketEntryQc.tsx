import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { CreateMessageModalDialog } from './Messages/CreateMessageModalDialog';
import { DocumentDisplayIframe } from './DocumentDisplayIframe';
import { ErrorNotification } from './ErrorNotification';
import { FormCancelModalDialog } from './FormCancelModalDialog';
import { PrimaryDocumentForm } from './EditDocketEntry/PrimaryDocumentForm';
import { SuccessNotification } from './SuccessNotification';
import { WorkItemAlreadyCompletedModal } from './DocketEntryQc/WorkItemAlreadyCompletedModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { AlertInfo } from '@web-client/dawson-ui/ui/Alert/AlertInfo';
import React from 'react';

export const DocketEntryQc = connect(
  {
    closeModalAndNavigateBackSequence:
      sequences.closeModalAndNavigateBackSequence,
    completeDocketEntryQCAndSendMessageSequence:
      sequences.completeDocketEntryQCAndSendMessageSequence,
    completeDocketEntryQCSequence: sequences.completeDocketEntryQCSequence,
    confirmWorkItemAlreadyCompleteSequence:
      sequences.confirmWorkItemAlreadyCompleteSequence,
    docketEntryQcHelper: state.docketEntryQcHelper,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    openCompleteAndSendMessageModalSequence:
      sequences.openCompleteAndSendMessageModalSequence,
    showModal: state.modal.showModal,
  },
  function DocketEntryQc({
    closeModalAndNavigateBackSequence,
    completeDocketEntryQCAndSendMessageSequence,
    completeDocketEntryQCSequence,
    confirmWorkItemAlreadyCompleteSequence,
    docketEntryQcHelper,
    formCancelToggleCancelSequence,
    openCompleteAndSendMessageModalSequence,
    showModal,
  }) {
    return (
      <>
        <CaseDetailHeader />
        <section
          className="usa-section grid-container"
          data-testid="docket-entry-qc-container"
        >
          {docketEntryQcHelper.showPaperServiceWarning && (
            <AlertInfo
              alertInfo={{
                message: `This document was automatically generated and requires paper
              service.`,
              }}
              isDismissible={false}
              scrollToTop={false}
              dataTestId="docket-entry-paper-service"
            />
          )}
          <h2 className="heading-1">
            {docketEntryQcHelper.formattedDocketEntry.documentTitle ||
              docketEntryQcHelper.formattedDocketEntry.documentType}
          </h2>
          <div className="filed-by">
            <div className="padding-bottom-1">
              Filed{' '}
              {docketEntryQcHelper.formattedDocketEntry.createdAtFormatted}
              {docketEntryQcHelper.formattedDocketEntry.filedBy &&
                ` by ${docketEntryQcHelper.formattedDocketEntry.filedBy}`}
            </div>
            {docketEntryQcHelper.formattedDocketEntry.showServedAt && (
              <div>
                Served{' '}
                {docketEntryQcHelper.formattedDocketEntry.servedAtFormatted}
              </div>
            )}
            {docketEntryQcHelper.formattedDocketEntry.showLegacySealed && (
              <div>Sealed in Blackstone</div>
            )}
          </div>

          <SuccessNotification />
          <ErrorNotification />

          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-5">
                <div>
                  {docketEntryQcHelper.showQCHelpText && (
                    <AlertInfo
                      alertInfo={{
                        message: (
                          <div>
                            <b>This document will also be QC&apos;d for:</b>
                            <ul className="tw:mt-0 tw:mb-0">
                              {docketEntryQcHelper.multiDocketedOn.map(cc => (
                                <li key={cc.docketNumber}>
                                  {cc.docketNumber} - {cc.caseTitle}
                                </li>
                              ))}
                            </ul>
                            <p className="tw:mb-0 tw:mt-4">
                              If a Notice of Docket Change is generated, it will
                              be filed in all of the above cases.
                            </p>
                          </div>
                        ),
                      }}
                      isDismissible={false}
                      scrollToTop={false}
                      className="tw:mb-6"
                      dataTestId="document-qc"
                    />
                  )}
                </div>
                <PrimaryDocumentForm />
                <div className="margin-top-5 button-container">
                  <Button
                    disableOnClick
                    id="save-and-finish"
                    data-testid="save-and-finish-document-qc"
                    type="submit"
                    onClick={async () => {
                      await completeDocketEntryQCSequence();
                    }}
                  >
                    Complete
                  </Button>
                  <Button
                    disableOnClick
                    secondary
                    id="save-and-add-supporting"
                    onClick={async () => {
                      await openCompleteAndSendMessageModalSequence();
                    }}
                  >
                    Complete &amp; Send Message
                  </Button>
                  <Button
                    overrideReadOnly
                    link
                    id="cancel-button"
                    onClick={() => {
                      formCancelToggleCancelSequence();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              <div className="grid-col-7">
                <DocumentDisplayIframe />
              </div>
            </div>
          </div>
        </section>
        {showModal === 'FormCancelModalDialog' && (
          <FormCancelModalDialog
            onCancelSequence={closeModalAndNavigateBackSequence}
          />
        )}
        {showModal === 'CreateMessageModalDialog' && (
          <CreateMessageModalDialog
            title="Complete and Send Message"
            onConfirmSequence={completeDocketEntryQCAndSendMessageSequence}
          />
        )}
        {showModal === 'WorkItemAlreadyCompletedModal' && (
          <WorkItemAlreadyCompletedModal
            confirmSequence={confirmWorkItemAlreadyCompleteSequence}
          />
        )}
      </>
    );
  },
);

DocketEntryQc.displayName = 'DocketEntryQc';
