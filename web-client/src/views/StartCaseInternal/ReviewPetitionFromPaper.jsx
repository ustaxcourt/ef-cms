import { AddressDisplay } from '../CaseDetail/PetitionerInformation';
import { BigHeader } from './../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseDifferenceModalOverlay } from '../StartCase/CaseDifferenceModalOverlay';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { OrdersNeededSummary } from './OrdersNeededSummary';
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
    onConfirmSequence="createCaseFromPaperAndServeToIrsSequence"
  ></ConfirmModal>
);

export const ReviewPetitionFromPaper = connect(
  {
    constants: state.constants,
    createCaseFromPaperAndServeToIrsSequence:
      sequences.createCaseFromPaperAndServeToIrsSequence,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    goBackToStartCaseInternalSequence:
      sequences.goBackToStartCaseInternalSequence,
    openConfirmServeToIrsModalSequence:
      sequences.openConfirmServeToIrsModalSequence,
    reviewPetitionFromPaperHelper: state.reviewPetitionFromPaperHelper,
    saveInternalCaseForLaterSequence:
      sequences.saveInternalCaseForLaterSequence,
    showModal: state.modal.showModal,
    startCaseHelper: state.startCaseHelper,
  },
  function ReviewPetitionFromPaper({
    constants,
    createCaseFromPaperAndServeToIrsSequence,
    form,
    formCancelToggleCancelSequence,
    goBackToStartCaseInternalSequence,
    openConfirmServeToIrsModalSequence,
    reviewPetitionFromPaperHelper,
    saveInternalCaseForLaterSequence,
    showModal,
    startCaseHelper,
  }) {
    return (
      <>
        <BigHeader text="Create Case" />
        <section
          className="usa-section grid-container"
          id="ustc-start-a-case-form"
        >
          <Focus>
            <h2 id="file-a-document-header" tabIndex="-1">
              Review the Petition
            </h2>
          </Focus>

          {reviewPetitionFromPaperHelper.hasOrders && (
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
                        aria-label="edit party information"
                        className="margin-right-0 margin-top-1 padding-0 float-right"
                        icon="edit"
                        onClick={() => {
                          goBackToStartCaseInternalSequence({
                            tab: 'partyInfo',
                          });
                        }}
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
                          Petitioner’s contact information
                        </span>
                        {form.contactPrimary && (
                          <address aria-labelledby="primary-label">
                            {AddressDisplay(form.contactPrimary, constants, {
                              nameOverride:
                                startCaseHelper.showCaseNameForPrimary &&
                                startCaseHelper.caseName,
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
                              Spouse’s contact information
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
                        icon="edit"
                        onClick={() => {
                          goBackToStartCaseInternalSequence({
                            tab: 'caseInfo',
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </h3>
                    <div className="grid-row grid-gap">
                      <div className="tablet:grid-col-6 margin-bottom-05">
                        <div className="margin-top-3 margin-bottom-2">
                          <span
                            className="usa-label usa-label-display"
                            htmlFor="filing-type"
                          >
                            Date received
                          </span>
                          {reviewPetitionFromPaperHelper.receivedAtFormatted}
                        </div>
                        <div className="margin-top-3 margin-bottom-2">
                          <span
                            className="usa-label usa-label-display"
                            htmlFor="filing-type"
                          >
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
                            reviewPetitionFromPaperHelper.preferredTrialCityFormatted
                          }
                        </div>
                      </div>
                      <div className="tablet:grid-col-6 margin-bottom-1">
                        <div className="margin-top-3 margin-bottom-2">
                          <span
                            className="usa-label usa-label-display"
                            htmlFor="filing-location"
                          >
                            Mailing date
                          </span>
                          {form.mailingDate}
                        </div>

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
                            htmlFor="filing-location"
                          >
                            Filing fee
                          </span>
                          {
                            reviewPetitionFromPaperHelper.petitionPaymentStatusFormatted
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
                        icon="edit"
                        onClick={() => {
                          goBackToStartCaseInternalSequence({
                            tab: 'irsNotice',
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </h3>
                    <div className="grid-row grid-gap">
                      <div className="tablet:grid-col-4 margin-bottom-1">
                        <div>
                          <span
                            className="usa-label usa-label-display"
                            htmlFor="filing-type"
                          >
                            Notice attached to petition?
                          </span>
                          {reviewPetitionFromPaperHelper.hasIrsNoticeFormatted}
                        </div>
                        <div className="margin-top-3 margin-bottom-2">
                          <span
                            className="usa-label usa-label-display"
                            htmlFor="filing-type"
                          >
                            Type of notice/case
                          </span>
                          {form.caseType}
                        </div>
                      </div>
                      <div className="tablet:grid-col-4 margin-bottom-1">
                        {reviewPetitionFromPaperHelper.shouldShowIrsNoticeDate && (
                          <div>
                            <span
                              className="usa-label usa-label-display"
                              htmlFor="filing-type"
                            >
                              Date of notice
                            </span>
                            {
                              reviewPetitionFromPaperHelper.irsNoticeDateFormatted
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tablet:grid-col-5 margin-bottom-4">
                <div className="card height-full margin-bottom-0">
                  <div className="content-wrapper">
                    <h3 className="underlined" id="attachments-card">
                      Attachments
                      <Button
                        link
                        aria-label="edit attachments"
                        className="margin-right-0 margin-top-1 padding-0 float-right"
                        icon="edit"
                        onClick={() => {
                          goBackToStartCaseInternalSequence({
                            tab: 'partyInfo',
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </h3>
                    <div>
                      <div className="margin-top-3 margin-bottom-2">
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="filing-petition"
                        >
                          Petition
                        </span>
                        <div className="grid-row">
                          <div className="grid-col flex-auto">
                            <PDFPreviewButton
                              file={form.petitionFile}
                              title="Petition"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="margin-top-3 margin-bottom-2">
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="filing-parties"
                        >
                          Statement of Taxpayer Identification
                        </span>
                        <div>
                          <div className="grid-row">
                            <div className="grid-col flex-auto">
                              <PDFPreviewButton
                                file={form.stinFile}
                                title="Statement of Taxpayer Identification"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {form.requestForPlaceOfTrialFile && (
                        <div className="margin-top-3 margin-bottom-3">
                          <span
                            className="usa-label usa-label-display margin-top-3"
                            htmlFor="filing-parties"
                          >
                            Request for Place of Trial
                          </span>
                          <div>
                            <div className="grid-row">
                              <div className="grid-col flex-auto">
                                <PDFPreviewButton
                                  file={form.requestForPlaceOfTrialFile}
                                  title="Request for Place of Trial"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {form.ownershipDisclosureFile && (
                        <div className="margin-top-3 margin-bottom-3">
                          <span
                            className="usa-label usa-label-display margin-top-3"
                            htmlFor="filing-parties"
                          >
                            Ownership Disclosure Statement
                          </span>
                          <div>
                            <div className="grid-row">
                              <div className="grid-col flex-auto">
                                <PDFPreviewButton
                                  file={form.ownershipDisclosureFile}
                                  title="Ownership Disclosure Statement"
                                />
                              </div>
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
              id="save-for-later"
              onClick={() => saveInternalCaseForLaterSequence()}
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
        {showModal === 'CaseDifferenceModalOverlay' && (
          <CaseDifferenceModalOverlay />
        )}
        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal
            confirmSequence={createCaseFromPaperAndServeToIrsSequence}
          />
        )}
        {showModal == 'FormCancelModalDialog' && (
          <FormCancelModalDialog onCancelSequence="closeModalAndReturnToDashboardSequence" />
        )}
        {showModal == 'ConfirmServeToIrsModal' && <ConfirmServeToIrsModal />}
      </>
    );
  },
);
