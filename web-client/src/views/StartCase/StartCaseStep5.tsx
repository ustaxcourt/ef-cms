import { AddressDisplay } from '../CaseDetail/AddressDisplay';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseDifferenceModalOverlay } from './CaseDifferenceModalOverlay';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { PDFPreviewButton } from '../PDFPreviewButton';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const StartCaseStep5 = connect(
  {
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    navigateBackSequence: sequences.navigateBackSequence,
    showModal: state.modal.showModal,
    startCaseHelper: state.startCaseHelper,
    submitFilePetitionSequence: sequences.submitFilePetitionSequence,
    user: state.user,
  },
  function StartCaseStep5({
    form,
    formCancelToggleCancelSequence,
    navigateBackSequence,
    showModal,
    startCaseHelper,
    submitFilePetitionSequence,
    user,
  }) {
    return (
      <>
        <Focus>
          <h2 id="file-a-document-header" tabIndex={-1}>
            5. Review Your Case
          </h2>
        </Focus>
        <Hint>
          Please make sure your information is correct. Don’t forget to check
          your PDF(s) to ensure all personal information has been removed or
          redacted from all documents EXCEPT the Statement of Taxpayer
          Identification Number (STIN). You will not be able to make changes to
          your case once you submit it without filing a motion.
        </Hint>

        <div className="grid-container padding-x-0 create-case-review">
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-4 margin-bottom-4">
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper">
                  <h3 className="underlined">About Your Case</h3>
                  <div className="grid-row grid-gap">
                    <div className="tablet:grid-col-6 margin-bottom-05">
                      <div className="margin-bottom-2">
                        <span className="usa-label usa-label-display">
                          Type of notice/case
                        </span>
                        {startCaseHelper.formattedCaseType}
                        <div className="grid-row margin-top-3">
                          <div className="grid-col">
                            <span className="usa-label usa-label-display">
                              Petition
                            </span>
                            <div>
                              <div className="grid-row">
                                <div className="grid-col flex-auto">
                                  <PDFPreviewButton
                                    data-testid="petition-preview-button"
                                    file={form.petitionFile}
                                    id="petition-preview-button"
                                    shouldAbbreviateTitle={false}
                                    shouldWrapText={true}
                                    showIcon={false}
                                    title="Petition"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="grid-row margin-top-3">
                          <div className="grid-col">
                            <span className="usa-label usa-label-display">
                              IRS notice(s)
                            </span>
                            {form.attachmentToPetitionFile ? (
                              <div>
                                <div className="grid-row">
                                  <div className="grid-col flex-auto">
                                    <PDFPreviewButton
                                      data-testid="atp-preview-button"
                                      file={form.attachmentToPetitionFile}
                                      id="atp-preview-button"
                                      shouldAbbreviateTitle={false}
                                      shouldWrapText={true}
                                      showIcon={false}
                                      title="IRS Notice(s)"
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div>N/A</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tablet:grid-col-6 margin-bottom-1">
                      <span className="usa-label usa-label-display">
                        Case procedure
                      </span>
                      {form.procedureType}

                      <div className="margin-top-3">
                        <span className="usa-label usa-label-display">
                          Requested trial location
                        </span>
                        {form.preferredTrialCity}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tablet:grid-col-8 margin-bottom-4">
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper">
                  <h3 className="underlined">Petitioner Information</h3>
                  <div className="grid-row grid-gap">
                    <div className="tablet:grid-col-4 margin-bottom-1">
                      <>
                        <span className="usa-label usa-label-display">
                          Party type
                        </span>
                        {form.partyType}

                        <div className="margin-top-3 margin-bottom-2">
                          <span className="usa-label usa-label-display">
                            Statement of Taxpayer Identification
                          </span>
                          <div>
                            <div className="grid-row">
                              <div className="grid-col flex-auto">
                                <PDFPreviewButton
                                  data-testid="stin-preview-button"
                                  file={form.stinFile}
                                  id="stin-preview-button"
                                  shouldAbbreviateTitle={false}
                                  shouldWrapText={true}
                                  showIcon={false}
                                  title="Statement of Taxpayer Identification"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {form.corporateDisclosureFile && (
                          <div className="margin-top-3 margin-bottom-3">
                            <span className="usa-label usa-label-display margin-top-3">
                              Corporate Disclosure Statement
                            </span>
                            <div>
                              <div className="grid-row">
                                <div className="grid-col flex-auto">
                                  <PDFPreviewButton
                                    file={form.corporateDisclosureFile}
                                    id="cds-preview-button"
                                    shouldAbbreviateTitle={false}
                                    shouldWrapText={true}
                                    showIcon={false}
                                    title="Corporate Disclosure Statement"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    </div>
                    <div className="tablet:grid-col-4 margin-bottom-1 party-information">
                      <span
                        className="usa-label usa-label-display margin-bottom-0"
                        id="filing-contact-primary"
                      >
                        {startCaseHelper.contactPrimaryLabel}
                      </span>
                      {form.contactPrimary && (
                        <address aria-labelledby="filing-contact-primary">
                          <AddressDisplay
                            contact={form.contactPrimary}
                            noMargin={true}
                          />
                        </address>
                      )}
                      <div className="margin-top-3 margin-bottom-2">
                        <span className="usa-label usa-label-display">
                          Service email
                        </span>
                        {user.email}
                      </div>
                    </div>
                    <div className="tablet:grid-col-4 margin-bottom-1 party-information">
                      {startCaseHelper.hasContactSecondary && (
                        <>
                          <span
                            className="usa-label usa-label-display margin-bottom-0"
                            id="filing-contact-secondary"
                          >
                            {startCaseHelper.contactSecondaryLabel}
                          </span>
                          <address aria-labelledby="filing-contact-secondary">
                            <AddressDisplay contact={form.contactSecondary} />
                          </address>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-12 bg-white submit-reminders">
            <div className="card">
              <div className="content-header bg-accent-cool-dark text-white heading-3">
                A Few Reminders Before You Submit
              </div>
              <div className="content-wrapper">
                <ol className="numbered-list">
                  <li>
                    Double check your IRS Notice to ensure your Petition is
                    timely.{' '}
                    <strong>
                      In most cases, the Court must receive your electronically
                      filed Petition no later than 11:59 pm Eastern Time on the
                      last date to file.
                    </strong>
                  </li>
                  <li>
                    Do not combine any additional documents with your Petition.{' '}
                    <strong>
                      Documents that might be evidence can be submitted at a
                      later time.
                    </strong>
                  </li>
                  <li>
                    Confirm that all information being submitted appears as you
                    want it to appear.{' '}
                    <strong>
                      After submitting your case to the Court, you will only be
                      able to make changes by filing a motion.
                    </strong>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="margin-top-5">
          <Button
            data-testid="file-petition"
            id="submit-case"
            onClick={() => {
              submitFilePetitionSequence();
            }}
          >
            Submit to U.S. Tax Court
          </Button>
          <Button secondary onClick={() => navigateBackSequence()}>
            Back
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
        {showModal === 'CaseDifferenceModalOverlay' && (
          <CaseDifferenceModalOverlay />
        )}
        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal confirmSequence={submitFilePetitionSequence} />
        )}
      </>
    );
  },
);

StartCaseStep5.displayName = 'StartCaseStep5';
