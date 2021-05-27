import { AddressDisplay } from '../CaseDetail/AddressDisplay';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseDifferenceModalOverlay } from './CaseDifferenceModalOverlay';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { PDFPreviewButton } from '../PDFPreviewButton';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
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
          <h2 id="file-a-document-header" tabIndex="-1">
            5. Review Your Case
          </h2>
        </Focus>
        <Hint>
          Please make sure your information is correct. Don’t forget to check
          your PDF(s) to ensure all personal information has been removed or
          redacted from all documents EXCEPT the Statement of Taxpayer
          Identification Number (STIN). You will not be able to edit your case
          once you submit it.{' '}
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
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="filing-type"
                        >
                          Type of notice/case
                        </span>
                        {startCaseHelper.formattedCaseType}
                        <div className="grid-row margin-top-3">
                          <div className="grid-col">
                            <span
                              className="usa-label usa-label-display"
                              htmlFor="filing-petition"
                            >
                              Petition
                            </span>
                            <div>
                              <div className="grid-row">
                                <div className="grid-col flex-auto">
                                  <PDFPreviewButton
                                    file={form.petitionFile}
                                    shouldAbbreviateTitle={false}
                                    shouldWrapText={true}
                                    title="Petition"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tablet:grid-col-6 margin-bottom-1">
                      <span
                        className="usa-label usa-label-display"
                        htmlFor="filing-procedure"
                      >
                        Case procedure
                      </span>
                      {form.procedureType}

                      <div className="margin-top-3">
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="filing-location"
                        >
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
                        <span
                          className="usa-label usa-label-display"
                          htmlFor="filing-parties"
                        >
                          Party type
                        </span>
                        {form.partyType}

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
                                  shouldAbbreviateTitle={false}
                                  shouldWrapText={true}
                                  title="Statement of Taxpayer Identification"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

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
                                    shouldAbbreviateTitle={false}
                                    shouldWrapText={true}
                                    title="Ownership Disclosure Statement"
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
                        htmlFor="filing-contact-primary"
                      >
                        {startCaseHelper.contactPrimaryLabel}
                      </span>
                      {form.contactPrimary && (
                        <address aria-labelledby="primary-label">
                          <AddressDisplay
                            contact={form.contactPrimary}
                            noMargin={true}
                          />
                        </address>
                      )}
                    </div>
                    <div className="tablet:grid-col-4 margin-bottom-1 party-information">
                      {startCaseHelper.hasContactSecondary && (
                        <>
                          <span
                            className="usa-label usa-label-display margin-bottom-0"
                            htmlFor="filing-contact-secondary"
                          >
                            {startCaseHelper.contactSecondaryLabel}
                          </span>
                          <AddressDisplay contact={form.contactSecondary} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tablet:grid-col-12 margin-bottom-4 create-case-review">
          <div className="card height-full margin-bottom-0">
            <div className="content-wrapper">
              <h3 className="underlined">Service Information</h3>
              <div className="grid-row grid-gap">
                <div className="tablet:grid-col-12 margin-bottom-1">
                  <span
                    className="usa-label usa-label-display"
                    htmlFor="filing-service-email"
                  >
                    Service email
                  </span>
                  {user.email}
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
                    timely. &nbsp;
                    <strong>
                      The Court must receive your case no later than 11:59 pm
                      Eastern Time on the last date to file.
                    </strong>
                  </li>
                  <li>
                    Be sure you have removed or redacted all personal
                    information from your documents, with the exception of the
                    STIN.
                  </li>
                  <li>
                    Do not include any additional documents with your Petition,
                    except for the IRS notice.{' '}
                    <strong>
                      Documents that might be evidence can be submitted at a
                      later time.
                    </strong>
                  </li>
                  <li>
                    Confirm that all information being submitted appears as you
                    want it to. You <strong>WILL NOT</strong> be able to edit
                    your case after you submit.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="margin-top-5">
          <Button
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
