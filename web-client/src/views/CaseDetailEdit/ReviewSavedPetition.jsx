import { AddressDisplay } from '../CaseDetail/PetitionerInformation';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseDifferenceModalOverlay } from '../StartCase/CaseDifferenceModalOverlay';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { OrdersNeededSummary } from '../StartCaseInternal/OrdersNeededSummary';
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
    onConfirmSequence="saveCaseAndServeToIrsSequence"
  ></ConfirmModal>
);

export const ReviewSavedPetition = connect(
  {
    constants: state.constants,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    openConfirmServeToIrsModalSequence:
      sequences.openConfirmServeToIrsModalSequence,
    reviewSavedPetitionHelper: state.reviewSavedPetitionHelper,
    saveCaseAndServeToIrsSequence: sequences.saveCaseAndServeToIrsSequence,
    saveSavedCaseForLaterSequence: sequences.saveSavedCaseForLaterSequence,
    showModal: state.showModal,
    startCaseHelper: state.startCaseHelper,
  },
  ({
    constants,
    form,
    formCancelToggleCancelSequence,
    openConfirmServeToIrsModalSequence,
    reviewSavedPetitionHelper,
    saveCaseAndServeToIrsSequence,
    saveSavedCaseForLaterSequence,
    showModal,
    startCaseHelper,
  }) => {
    return (
      <>
        <section
          className="usa-section grid-container"
          id="ustc-start-a-case-form"
        >
          <Focus>
            <h2 id="file-a-document-header" tabIndex="-1">
              Review The Petition
            </h2>
          </Focus>

          {reviewSavedPetitionHelper.hasOrders && (
            <OrdersNeededSummary data={form} />
          )}

          <div className="grid-container padding-x-0 create-case-review">
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-7 margin-bottom-4">
                <div className="card height-full margin-bottom-0">
                  <div className="content-wrapper">
                    <h3 className="underlined">Parties</h3>
                    <div className="grid-row grid-gap">
                      <div className="tablet:grid-col-4 margin-bottom-1">
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="filing-parties"
                        >
                          Party type
                        </label>
                        {form.partyType}
                      </div>
                      <div className="tablet:grid-col-4 margin-bottom-1">
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="filing-contact-primary"
                        >
                          Petitioner’s contact information
                        </label>
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
                            <label
                              className="usa-label usa-label-display"
                              htmlFor="filing-contact-secondary"
                            >
                              Spouse’s contact information
                            </label>
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
                    <h3 className="underlined">Case Information</h3>
                    <div className="grid-row grid-gap">
                      <div className="tablet:grid-col-6 margin-bottom-05">
                        <div className="margin-top-3 margin-bottom-2">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-type"
                          >
                            Date recieved
                          </label>
                          {reviewSavedPetitionHelper.receivedAtFormatted}
                        </div>
                        <div className="margin-top-3 margin-bottom-2">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-type"
                          >
                            Case caption
                          </label>
                          {form.caseCaption}
                        </div>
                        <div className="margin-top-3 margin-bottom-2">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-location"
                          >
                            Requested trial location
                          </label>
                          {form.preferredTrialCity}
                        </div>
                      </div>
                      <div className="tablet:grid-col-6 margin-bottom-1">
                        {form.mailingDate && (
                          <div className="margin-top-3 margin-bottom-2">
                            <label
                              className="usa-label usa-label-display"
                              htmlFor="filing-location"
                            >
                              Mailing date
                            </label>
                            {form.mailingDate}
                          </div>
                        )}
                        <div className="margin-top-3 margin-bottom-2">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-location"
                          >
                            Mailing date
                          </label>
                          {form.mailingDate || 'N/A'}
                        </div>

                        <div className="margin-top-3 margin-bottom-2">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-procedure"
                          >
                            Case procedure
                          </label>
                          {form.procedureType}
                        </div>

                        <div className="margin-top-3 margin-bottom-2">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-location"
                          >
                            Filing fee
                          </label>
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
                    <h3 className="underlined">IRS Notice</h3>
                    <div className="grid-row grid-gap">
                      <div className="tablet:grid-col-4 margin-bottom-1">
                        <div>
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-type"
                          >
                            Notice attached to petition?
                          </label>
                          {reviewSavedPetitionHelper.hasIrsNoticeFormatted}
                        </div>
                        <div className="margin-top-3 margin-bottom-2">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-type"
                          >
                            Type of notice/case
                          </label>
                          {form.caseType}
                        </div>
                      </div>
                      <div className="tablet:grid-col-4 margin-bottom-1">
                        {reviewSavedPetitionHelper.shouldShowIrsNoticeDate && (
                          <div>
                            <label
                              className="usa-label usa-label-display"
                              htmlFor="filing-type"
                            >
                              Date of notice
                            </label>
                            {reviewSavedPetitionHelper.irsNoticeDateFormatted}
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
                    <h3 className="underlined">Attachments</h3>
                    <div>
                      {reviewSavedPetitionHelper.petitionFile && (
                        <div className="margin-top-3 margin-bottom-2">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-petition"
                          >
                            Petition
                          </label>
                          <div className="grid-row">
                            <div className="grid-col flex-auto">
                              <FontAwesomeIcon
                                className="fa-icon-blue"
                                icon={['fas', 'file-pdf']}
                              />
                            </div>
                            <div className="grid-col flex-fill">
                              <Button
                                link
                                className="pdf-preview-btn padding-0"
                                href={`/case-detail/${reviewSavedPetitionHelper.petitionFile.caseId}/documents/${reviewSavedPetitionHelper.petitionFile.documentId}`}
                              >
                                Petition
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      {reviewSavedPetitionHelper.stinFile && (
                        <div className="margin-top-3 margin-bottom-2">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-parties"
                          >
                            Statement of Taxpayer Identification
                          </label>
                          <div>
                            <div className="grid-row">
                              <div className="grid-col flex-auto">
                                <FontAwesomeIcon
                                  className="fa-icon-blue"
                                  icon={['fas', 'file-pdf']}
                                />
                              </div>
                              <div className="grid-col flex-fill">
                                <Button
                                  link
                                  className="pdf-preview-btn padding-0"
                                  href={`/case-detail/${reviewSavedPetitionHelper.stinFile.caseId}/documents/${reviewSavedPetitionHelper.stinFile.documentId}`}
                                >
                                  Statement of Taxpayer Identification
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {reviewSavedPetitionHelper.requestForPlaceOfTrialFile && (
                        <div className="margin-top-3 margin-bottom-3">
                          <label
                            className="usa-label usa-label-display margin-top-3"
                            htmlFor="filing-parties"
                          >
                            Request for Place of Trial
                          </label>
                          <div>
                            <div className="grid-row">
                              <div className="grid-col flex-auto">
                                <FontAwesomeIcon
                                  className="fa-icon-blue"
                                  icon={['fas', 'file-pdf']}
                                />
                              </div>
                              <div className="grid-col flex-fill">
                                <Button
                                  link
                                  className="pdf-preview-btn padding-0"
                                  href={`/case-detail/${reviewSavedPetitionHelper.requestForPlaceOfTrialFile.caseId}/documents/${reviewSavedPetitionHelper.requestForPlaceOfTrialFile.documentId}`}
                                >
                                  Request for Place of Trial
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {reviewSavedPetitionHelper.ownershipDisclosureFile && (
                        <div className="margin-top-3 margin-bottom-3">
                          <label
                            className="usa-label usa-label-display margin-top-3"
                            htmlFor="filing-parties"
                          >
                            Ownership Disclosure Statement
                          </label>
                          <div>
                            <div className="grid-row">
                              <div className="grid-col flex-auto">
                                <FontAwesomeIcon
                                  className="fa-icon-blue"
                                  icon={['fas', 'file-pdf']}
                                />
                              </div>
                              <div className="grid-col flex-fill">
                                <Button
                                  link
                                  className="pdf-preview-btn padding-0"
                                  href={`/cases/${reviewSavedPetitionHelper.ownershipDisclosureFile.caseId}/documents/${reviewSavedPetitionHelper.ownershipDisclosureFile.documentId}`}
                                >
                                  Ownership Disclosure Statement
                                </Button>
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
            <Button secondary onClick={() => saveSavedCaseForLaterSequence()}>
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
            confirmSequence={saveCaseAndServeToIrsSequence}
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
