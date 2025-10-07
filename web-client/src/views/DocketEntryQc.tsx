import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { CreateMessageModalDialog } from './Messages/CreateMessageModalDialog';
import { DocumentDisplayIframe } from './DocumentDisplayIframe';
import { ErrorNotification } from './ErrorNotification';
import { FormCancelModalDialog } from './FormCancelModalDialog';
import { InfoNotificationComponent } from './InfoNotification';
import { PrimaryDocumentForm } from './EditDocketEntry/PrimaryDocumentForm';
import { SuccessNotification } from './SuccessNotification';
import { WorkItemAlreadyCompletedModal } from './DocketEntryQc/WorkItemAlreadyCompletedModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const DocketEntryQc = connect(
  {
    caseDetail: state.caseDetail,
    formattedCaseDetail: state.formattedCaseDetail,
    isFiledAcrossAllCases: state.isFiledAcrossAllCases,
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
    isFiledAcrossAllCases,
  }) {
    const isMemberCase = Boolean(
      caseDetail?.leadDocketNumber &&
        caseDetail?.leadDocketNumber !== caseDetail?.docketNumber,
    );

    const isLeadCase = Boolean(
      caseDetail?.leadDocketNumber &&
        caseDetail?.leadDocketNumber === caseDetail?.docketNumber,
    );

    const mappedMemberedCases = () =>
      formattedCaseDetail.consolidatedCases
        .filter(
          (c: { docketNumber: string }) =>
            c.docketNumber !== caseDetail.docketNumber,
        )
        .map(c => c.docketNumber);

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
                <div>
                  {isLeadCase &&
                    formattedCaseDetail?.consolidatedCases &&
                    formattedCaseDetail.consolidatedCases.length > 1 && (
                      <InfoNotificationComponent
                        alertInfo={{
                          message: (
                            <div>
                              <b>
                                This document will also be QC&apos;d for all
                                consolidated cases.
                              </b>
                              <ul className="margin-top-0 margin-bottom-0">
                                {mappedMemberedCases().map(docketNumber => (
                                  <li key={docketNumber}>
                                    {docketNumber} -{' '}
                                    {formattedCaseDetail.consolidatedCases
                                      .find(
                                        c => c.docketNumber === docketNumber,
                                      )
                                      ?.petitioners.map(p => p.name)
                                      .join(', ')}
                                  </li>
                                ))}
                              </ul>
                              <p className="margin-bottom-0 margin-top-0">
                                If a Notice of Docket Change is generated, it
                                will be filed in all cases in the group.
                              </p>
                            </div>
                          ),
                        }}
                        dismissible={false}
                        scrollToTop={false}
                      />
                    )}
                </div>
                <PrimaryDocumentForm />
                <div className="margin-top-5 button-container">
                  <Button
                    disableOnClick
                    id="save-and-finish"
                    data-testid="save-and-finish-document-qc"
                    disabled={isMemberCase && isFiledAcrossAllCases}
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
                    disabled={isMemberCase && isFiledAcrossAllCases}
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
