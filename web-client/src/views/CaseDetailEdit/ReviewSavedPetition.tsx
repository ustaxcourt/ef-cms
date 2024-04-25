import { AddressDisplay } from '../CaseDetail/AddressDisplay';
import { Attachments } from '@web-client/views/CaseDetailEdit/Attachments';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { IRSNoticeCaseReview } from '@web-client/views/CaseDetailEdit/IRSNoticeCaseReview';
import { OrdersNeededSummary } from '../StartCaseInternal/OrdersNeededSummary';
import { ServeCaseToIrsErrorModal } from '../ServeCaseToIrsErrorModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
            <h1 id="file-a-document-header" tabIndex={-1}>
              Review and Serve Petition
            </h1>
          </Focus>

          {reviewSavedPetitionHelper.renderOrderSummary && (
            <OrdersNeededSummary />
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
                        href={`/case-detail/${form.docketNumber}/petition-qc?tab=partyInfo`}
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
                          id="filing-contact-primary"
                        >
                          Petitioner’s information
                        </span>
                        {form.contactPrimary && (
                          <>
                            <address aria-labelledby="filing-contact-primary">
                              <AddressDisplay contact={form.contactPrimary} />
                            </address>
                            {reviewSavedPetitionHelper.eConsentFieldsEnabledFeatureFlag && (
                              <>
                                {form.contactPrimary.paperPetitionEmail && (
                                  <div className="margin-top-1 word-wrap-break-word">
                                    {form.contactPrimary.paperPetitionEmail}
                                  </div>
                                )}
                                {reviewSavedPetitionHelper.shouldDisplayEConsentTextForPrimaryContact && (
                                  <div className="margin-top-1">
                                    {
                                      reviewSavedPetitionHelper.eServiceConsentTextForPrimaryContact
                                    }
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                      <div className="tablet:grid-col-4 margin-bottom-1">
                        {startCaseHelper.hasContactSecondary && (
                          <>
                            <span
                              className="usa-label usa-label-display"
                              id="filing-contact-secondary"
                            >
                              Spouse’s information
                            </span>
                            <address aria-labelledby="filing-contact-secondary">
                              <AddressDisplay contact={form.contactSecondary} />
                            </address>
                            {reviewSavedPetitionHelper.eConsentFieldsEnabledFeatureFlag && (
                              <>
                                {form.contactSecondary.paperPetitionEmail && (
                                  <div className="margin-top-1 word-wrap-break-word">
                                    {form.contactSecondary.paperPetitionEmail}
                                  </div>
                                )}
                                {reviewSavedPetitionHelper.shouldDisplayEConsentTextForSecondaryContact && (
                                  <div className="margin-top-1">
                                    {
                                      reviewSavedPetitionHelper.eServiceConsentTextForSecondaryContact
                                    }
                                  </div>
                                )}
                              </>
                            )}
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
                        href={`/case-detail/${form.docketNumber}/petition-qc?tab=caseInfo`}
                        icon="edit"
                        id="case-information-edit-button"
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
              <IRSNoticeCaseReview />
              <Attachments />
            </div>
          </div>

          <div className="margin-top-5">
            <Button
              data-testid="serve-case-to-irs"
              id="submit-case"
              onClick={() => {
                openConfirmServeToIrsModalSequence();
              }}
            >
              Serve to IRS
            </Button>
            <Button
              secondary
              data-testid="save-case-for-later"
              onClick={() => leaveCaseForLaterServiceSequence()}
            >
              Save for Later
            </Button>
            <Button
              link
              id="cancel-create-case"
              onClick={() => {
                formCancelToggleCancelSequence();
              }}
            >
              Cancel
            </Button>
          </div>
        </section>
        {showModal == 'ConfirmServeToIrsModal' && <ConfirmServeToIrsModal />}
        {showModal == 'FormCancelModalDialog' && (
          <FormCancelModalDialog onCancelSequence="closeModalAndNavigateSequence" />
        )}
        {showModal === 'ServeCaseToIrsErrorModal' && (
          <ServeCaseToIrsErrorModal onCancelSequence="closeModalAndNavigateSequence" />
        )}
      </>
    );
  },
);

ReviewSavedPetition.displayName = 'ReviewSavedPetition';
