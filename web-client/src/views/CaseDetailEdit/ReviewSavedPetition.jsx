import { AddressDisplay } from '../CaseDetail/PetitionerInformation';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OrdersNeededSummary } from '../StartCaseInternal/OrdersNeededSummary';
import { PDFPreviewButton } from '../PDFPreviewButton';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

const ConfirmServeToIrsModal = () => (
  <ConfirmModal
    cancelLabel="No, Take Me Back"
    confirmLabel="Yes, Serve"
    preventCancelOnBlur={true}
    title="Are You Sure You Want to Serve This Petition to the IRS?"
    onCancelSequence="clearModalSequence"
    onConfirmSequence="serveCaseToIrsSequence"
  ></ConfirmModal>
);

export const ReviewSavedPetition = connect(
  {
    constants: state.constants,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    leaveCaseForLaterServiceSequence:
      sequences.leaveCaseForLaterServiceSequence,
    openConfirmServeToIrsModalSequence:
      sequences.openConfirmServeToIrsModalSequence,
    reviewSavedPetitionHelper: state.reviewSavedPetitionHelper,
    showModal: state.modal.showModal,
    startCaseHelper: state.startCaseHelper,
  },
  function ReviewSavedPetition({
    constants,
    form,
    formCancelToggleCancelSequence,
    leaveCaseForLaterServiceSequence,
    openConfirmServeToIrsModalSequence,
    reviewSavedPetitionHelper,
    showModal,
    startCaseHelper,
  }) {
    return (
      <>
        <CaseDetailHeader />
        <section
          className="usa-section grid-container"
          id="ustc-start-a-case-form"
        >
          <Focus>
            <h1 id="file-a-document-header" tabIndex="-1">
              Review and Serve Petition
            </h1>
          </Focus>

          {reviewSavedPetitionHelper.hasOrders && (
            <OrdersNeededSummary caseInformation={form} />
          )}

          <div className="grid-container padding-x-0 create-case-review">
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-7 margin-bottom-4">
                <div className="card height-full margin-bottom-0">
                  <div className="content-wrapper">
                    <h3 className="underlined" id="parties-card">
                      Parties
                      <Button
                        link
                        aria-label="edit parties"
                        className="margin-right-0 margin-top-1 padding-0 float-right"
                        href={`/case-detail/${form.caseId}/petition-qc?tab=partyInfo`}
                        icon="edit"
                      >
                        Edit
                      </Button>
                    </h3>
                    <div className="grid-row grid-gap">
                      <div className="tablet:grid-col-4 margin-bottom-1">
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="filing-parties"
                        >
                          Party type
                        </span>
                        {form.partyType}
                      </div>
                      <div className="tablet:grid-col-4 margin-bottom-1">
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="filing-contact-primary"
                        >
                          Petitioner’s information
                        </span>
                        {form.contactPrimary && (
                          <address aria-labelledby="primary-label">
                            {AddressDisplay(form.contactPrimary, constants, {
                              nameOverride:
                                startCaseHelper.showCaseTitleForPrimary &&
                                startCaseHelper.caseTitle,
                            })}
                          </address>
                        )}
                      </div>
                      <div className="tablet:grid-col-4 margin-bottom-1">
                        {startCaseHelper.hasContactSecondary && (
                          <>
                            <span
                              className="usa-label usa-label-display"
                              htmlFor="filing-contact-secondary"
                            >
                              Spouse’s information
                            </span>
                            {AddressDisplay(form.contactSecondary, constants)}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tablet:grid-col-5 margin-bottom-4">
                <div className="card height-full margin-bottom-0">
                  <div className="content-wrapper">
                    <h3 className="underlined" id="case-information-card">
                      Case Information
                      <Button
                        link
                        aria-label="edit case information"
                        className="margin-right-0 margin-top-1 padding-0 float-right"
                        href={`/case-detail/${form.caseId}/petition-qc?tab=caseInfo`}
                        icon="edit"
                      >
                        Edit
                      </Button>
                    </h3>
                    <div className="grid-row grid-gap">
                      <div className="tablet:grid-col-6 margin-bottom-05">
                        <div className="margin-bottom-2">
                          <span className="usa-label usa-label-display">
                            Date received
                          </span>
                          {reviewSavedPetitionHelper.receivedAtFormatted}
                        </div>
                        <div className="margin-top-3 margin-bottom-2">
                          <span className="usa-label usa-label-display">
                            Case caption
                          </span>
                          {form.caseCaption} {constants.CASE_CAPTION_POSTFIX}
                        </div>
                        <div className="margin-top-3 margin-bottom-2">
                          <span
                            className="usa-label usa-label-display"
                            htmlFor="filing-location"
                          >
                            Requested trial location
                          </span>
                          {
                            reviewSavedPetitionHelper.preferredTrialCityFormatted
                          }
                        </div>
                      </div>
                      <div className="tablet:grid-col-6 margin-bottom-1">
                        {form.mailingDate && (
                          <div className="margin-bottom-2">
                            <span
                              className="usa-label usa-label-display"
                              htmlFor="mailing-date"
                            >
                              Mailing date
                            </span>
                            {form.mailingDate}
                          </div>
                        )}

                        <div className="margin-top-3 margin-bottom-2">
                          <span
                            className="usa-label usa-label-display"
                            htmlFor="filing-procedure"
                          >
                            Case procedure
                          </span>
                          {form.procedureType}
                        </div>

                        <div className="margin-top-3 margin-bottom-2">
                          <span
                            className="usa-label usa-label-display"
                            htmlFor="filing-fee"
                          >
                            Filing fee
                          </span>
                          {
                            reviewSavedPetitionHelper.petitionPaymentStatusFormatted
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid-container padding-x-0 create-case-review">
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-7 margin-bottom-4">
                <div className="card height-full margin-bottom-0">
                  <div className="content-wrapper">
                    <h3 className="underlined" id="irs-notice-card">
                      IRS Notice
                      <Button
                        link
                        aria-label="edit IRS notice information"
                        className="margin-right-0 margin-top-1 padding-0 float-right"
                        href={`/case-detail/${form.caseId}/petition-qc?tab=irsNotice`}
                        icon="edit"
                      >
                        Edit
                      </Button>
                    </h3>
                    <div className="grid-row grid-gap margin-bottom-4">
                      <div className="grid-col-4">
                        <div>
                          <span className="usa-label usa-label-display">
                            Notice attached to petition?
                          </span>
                          {reviewSavedPetitionHelper.hasIrsNoticeFormatted}
                        </div>
                      </div>
                      <div className="grid-col-4">
                        <span className="usa-label usa-label-display">
                          Type of notice/case
                        </span>
                        {form.caseType}
                      </div>
                      <div className="grid-col-4">
                        {reviewSavedPetitionHelper.shouldShowIrsNoticeDate && (
                          <div>
                            <span className="usa-label usa-label-display">
                              Date of notice
                            </span>
                            {reviewSavedPetitionHelper.irsNoticeDateFormatted}
                          </div>
                        )}
                      </div>
                    </div>
                    {reviewSavedPetitionHelper.showStatistics && (
                      <>
                        <h4>Statistics</h4>
                        <table className="usa-table docket-record responsive-table row-border-only">
                          <thead>
                            <tr>
                              <th>Year/Period</th>
                              <th>Deficiency</th>
                              <th>Total penalties</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reviewSavedPetitionHelper.formattedStatistics.map(
                              (statistic, index) => (
                                <tr key={index}>
                                  <td>{statistic.formattedDate}</td>
                                  <td>{statistic.formattedDeficiencyAmount}</td>
                                  <td>{statistic.formattedTotalPenalties}</td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="tablet:grid-col-5 margin-bottom-4">
                <div className="card height-full margin-bottom-0">
                  <div className="content-wrapper">
                    <h3 className="underlined" id="attachments-card">
                      Attachments
                    </h3>
                    <div>
                      {reviewSavedPetitionHelper.petitionFile && (
                        <div className="margin-top-3 margin-bottom-2">
                          <div className="grid-row">
                            <div className="grid-col flex-auto">
                              <PDFPreviewButton
                                file={reviewSavedPetitionHelper.petitionFile}
                                title="Petition"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {reviewSavedPetitionHelper.stinFile && (
                        <div className="margin-top-3 margin-bottom-2">
                          <div className="grid-row">
                            <div className="grid-col flex-auto">
                              <FontAwesomeIcon
                                className="pdf-preview-btn padding-0"
                                icon={['fas', 'file-pdf']}
                                size="1x"
                              />
                              Statement of Taxpayer Identification
                            </div>
                          </div>
                        </div>
                      )}
                      {reviewSavedPetitionHelper.requestForPlaceOfTrialFile && (
                        <div className="margin-top-3 margin-bottom-3">
                          <div className="grid-row">
                            <div className="grid-col flex-auto">
                              <PDFPreviewButton
                                file={
                                  reviewSavedPetitionHelper.requestForPlaceOfTrialFile
                                }
                                title="Request for Place of Trial"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {reviewSavedPetitionHelper.ownershipDisclosureFile && (
                        <div className="margin-top-3 margin-bottom-3">
                          <div className="grid-row">
                            <div className="grid-col flex-auto">
                              <PDFPreviewButton
                                file={
                                  reviewSavedPetitionHelper.ownershipDisclosureFile
                                }
                                title="Ownership Disclosure Statement"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {reviewSavedPetitionHelper.applicationForWaiverOfFilingFeeFile && (
                        <div className="margin-top-3 margin-bottom-3">
                          <div className="grid-row">
                            <div className="grid-col flex-auto">
                              <PDFPreviewButton
                                file={
                                  reviewSavedPetitionHelper.applicationForWaiverOfFilingFeeFile
                                }
                                title="Application for Waiver of Filing Fee"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="margin-top-5">
            <Button
              id="submit-case"
              onClick={() => {
                openConfirmServeToIrsModalSequence();
              }}
            >
              Serve to IRS
            </Button>
            <Button
              secondary
              onClick={() => leaveCaseForLaterServiceSequence()}
            >
              Save for Later
            </Button>
            <Button
              link
              onClick={() => {
                formCancelToggleCancelSequence();
              }}
            >
              Cancel
            </Button>
          </div>
        </section>
        {showModal == 'ConfirmServeToIrsModal' && <ConfirmServeToIrsModal />}
      </>
    );
  },
);
