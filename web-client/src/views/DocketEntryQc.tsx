import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { CreateMessageModalDialog } from './Messages/CreateMessageModalDialog';
import { DocumentDisplayIframe } from './DocumentDisplayIframe';
import { ErrorNotification } from './ErrorNotification';
import { FormCancelModalDialog } from './FormCancelModalDialog';
import { PrimaryDocumentForm } from './EditDocketEntry/PrimaryDocumentForm';
import { Hint } from '../ustc-ui/Hint/Hint';
import { SuccessNotification } from './SuccessNotification';
import { WorkItemAlreadyCompletedModal } from './DocketEntryQc/WorkItemAlreadyCompletedModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { InfoNotificationComponent } from './InfoNotification';

export const DocketEntryQc = connect(
  {
    caseDetail: state.caseDetail,
    formattedCaseDetail: state.formattedCaseDetail,
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
    caseDetail,
    closeModalAndNavigateBackSequence,
    completeDocketEntryQCAndSendMessageSequence,
    completeDocketEntryQCSequence,
    confirmWorkItemAlreadyCompleteSequence,
    docketEntryQcHelper,
    formCancelToggleCancelSequence,
    openCompleteAndSendMessageModalSequence,
    showModal,
    formattedCaseDetail,
  }) {
    const isMemberCase = Boolean(
      caseDetail?.leadDocketNumber &&
        caseDetail?.leadDocketNumber !== caseDetail?.docketNumber,
    );

    const isLeadCase = Boolean(
      caseDetail?.leadDocketNumber &&
        caseDetail?.leadDocketNumber === caseDetail?.docketNumber,
    );

    return (
      <>
        <CaseDetailHeader />
        <section
          className="usa-section grid-container"
          data-testid="docket-entry-qc-container"
        >
          {docketEntryQcHelper.showPaperServiceWarning && (
            <InfoNotificationComponent
              alertInfo={{
                message: `This document was automatically generated and requires paper
              service.`,
              }}
              dismissible={false}
              scrollToTop={false}
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
                {isLeadCase &&
                  formattedCaseDetail?.consolidatedCases &&
                  formattedCaseDetail.consolidatedCases.length > 1 && (
                    <Hint fullWidth>
                      <p
                        className="text-bold margin-top-0 margin-bottom-0"
                        style={{ fontSize: '21px' }}
                      >
                        This document will also be QC&apos;d for:
                      </p>
                      <ul className="usa-list padding-top-0 padding-bottom-0 margin-top-1 margin-bottom-1">
                        {formattedCaseDetail.consolidatedCases
                          .filter(
                            c => c.docketNumber !== caseDetail.docketNumber,
                          )
                          .map(c => (
                            <li
                              key={c.docketNumber}
                              className="margin-bottom-0"
                            >
                              {c.docketNumber}{' '}
                              {c.caseTitle ||
                                c.caseCaption ||
                                docketEntryQcHelper?.formattedDocketEntry
                                  ?.documentTitle ||
                                docketEntryQcHelper?.formattedDocketEntry
                                  ?.eventCode}
                            </li>
                          ))}
                      </ul>
                      <p className="margin-bottom-0 margin-top-0">
                        If a Notice of Docket Change is generated, it will be
                        filed in all cases in the group.
                      </p>
                    </Hint>
                  )}
                {isMemberCase && (
                  <Hint fullWidth>
                    Edits to Document Info can only be done from the{' '}
                    <strong>lead case</strong> in a consolidated group. This is
                    a member case.
                  </Hint>
                )}

                <PrimaryDocumentForm />
                <div className="margin-top-5 button-container">
                  <Button
                    disableOnClick
                    id="save-and-finish"
                    data-testid="save-and-finish-document-qc"
                    disabled={isMemberCase}
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
                    disabled={isMemberCase}
                    onClick={async () => {
                      await openCompleteAndSendMessageModalSequence();
                    }}
                  >
                    Complete &amp; Send Message
                  </Button>
                  <Button
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
