import { AddressDisplay } from '../CaseDetail/AddressDisplay';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { FileUploadErrorModal } from '@web-client/views/FileUploadErrorModal';
import { FileUploadStatusModal } from '@web-client/views/FileUploadStatusModal';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import { NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { PDFPreviewButton } from '@web-client/views/PDFPreviewButton';
import { PETITION_TYPES } from '@web-client/presenter/actions/setupPetitionStateAction';
import { PdfPreview } from '@web-client/ustc-ui/PdfPreview/PdfPreview';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const UpdatedFilePetitionStep6 = connect(
  {
    form: state.form,
    newPetitionData: state.newPetitionData,
    pdfPreviewUrl: state.pdfPreviewUrl,
    showModal: state.modal.showModal,
    updatedFilePetitionCompleteStep6Sequence:
      sequences.updatedFilePetitionCompleteStep6Sequence,
    updatedFilePetitionGoBackAStepSequence:
      sequences.updatedFilePetitionGoBackAStepSequence,
    user: state.user,
  },

  function UpdatedFilePetitionStep6({
    form,
    newPetitionData,
    pdfPreviewUrl,
    showModal,
    updatedFilePetitionCompleteStep6Sequence,
    updatedFilePetitionGoBackAStepSequence,
    user,
  }) {
    return (
      <>
        {/* <ErrorNotification /> */}
        <div className="grid-row grid-gap">
          <div className="grid-col">
            <p>
              Review the Petition preview and uploaded documents to make sure
              all of the information is accurate. You will not be able to make
              changes to your case once you submit it without filing a motion.
            </p>
          </div>
        </div>
        <div className="grid-row grid-gap">
          <div className="grid-col">
            <WarningNotificationComponent
              alertWarning={{
                message:
                  'Ensure that personal information (such as Social Security Numbers, Taxpayer Identification Numbers, Employer Identification Numbers) has been removed or blocked out (redacted) for every form except the Statement of Taxpayer Identification.',
              }}
              dismissible={false}
              scrollToTop={false}
            />

            <div className="grid-container padding-x-0">
              <div className="grid-row grid-gap">
                <div
                  className={classNames('margin-bottom-4', {
                    'grid-col-12': true,
                    'tablet:grid-col-7': false,
                  })}
                >
                  <div className="card height-full margin-bottom-0">
                    <div className="content-wrapper">
                      <h3 className="underlined">About Your Case</h3>
                      <div className="grid-row grid-gap">
                        <div className="tablet:grid-col-6 margin-bottom-05">
                          <div className="margin-bottom-2">
                            <span className="usa-label usa-label-display">
                              Type of notice/case
                            </span>
                            {newPetitionData.caseType}
                            <div className="grid-row margin-top-3">
                              <div className="grid-col">
                                <span className="usa-label usa-label-display">
                                  Petition
                                </span>
                                <div>
                                  <div className="grid-row">
                                    <div className="grid-col flex-auto">
                                      <Button
                                        link
                                        className="usa-link--external text-left mobile-text-wrap"
                                        href={pdfPreviewUrl}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                      >
                                        Preview in full screen
                                      </Button>
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
                                {newPetitionData.hasIrsNotice ? (
                                  newPetitionData.irsNotices.map(irsNotice => {
                                    return (
                                      <div key={irsNotice.key}>
                                        <div className="grid-row">
                                          <div className="grid-col flex-auto">
                                            <PDFPreviewButton
                                              data-testid="irs-notice-preview-button"
                                              file={irsNotice.file}
                                              id="irs-notice-preview-button"
                                              shouldAbbreviateTitle={false}
                                              shouldWrapText={true}
                                              showIcon={false}
                                              title={irsNotice.file.name}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
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
                          {newPetitionData.procedureType}
                          <div className="margin-top-3">
                            <span className="usa-label usa-label-display">
                              Requested trial location
                            </span>
                            {newPetitionData.preferredTrialCity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={classNames('margin-bottom-4', {
                    'grid-col-12': true,
                    'tablet:grid-col-5': false,
                  })}
                >
                  <div className="card height-full margin-bottom-0">
                    <div className="content-wrapper">
                      <h3 className="underlined">Petitioner Information</h3>
                      <div className="grid-row grid-gap">
                        <div className="tablet:grid-col-6 margin-bottom-1">
                          <span className="usa-label usa-label-display">
                            Party type
                          </span>
                          {newPetitionData.partyType}
                          <div className="grid-row margin-top-3">
                            <span
                              className="usa-label usa-label-display margin-bottom-0"
                              id="filing-contact-primary"
                            >
                              Petitioner contact information
                            </span>
                            {newPetitionData.contactPrimary && (
                              <address aria-labelledby="filing-contact-primary">
                                <AddressDisplay
                                  contact={newPetitionData.contactPrimary}
                                  noMargin={true}
                                />
                                <div className="display-flex-center margin-top-1">
                                  <span className="font-weight-600">
                                    Place of legal residence:
                                  </span>
                                  <span className="margin-left-5">
                                    {
                                      newPetitionData.contactPrimary
                                        .placeOfLegalResidence
                                    }
                                  </span>
                                </div>
                              </address>
                            )}

                            <div className="margin-top-3 margin-bottom-2">
                              <span className="usa-label usa-label-display">
                                Service email
                              </span>
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <div className="tablet:grid-col-6 margin-bottom-1 party-information">
                          <div className="margin-top-3 margin-bottom-2">
                            <span className="usa-label usa-label-display">
                              Statement of Taxpayer Identification
                            </span>
                            <div>
                              <div className="grid-row">
                                <div className="grid-col flex-auto">
                                  <PDFPreviewButton
                                    data-testid="stin-preview-button"
                                    file={newPetitionData.stinFile}
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
                          {newPetitionData.corporateDisclosureFile && (
                            <div className="margin-top-3 margin-bottom-2">
                              <span className="usa-label usa-label-display">
                                Corporate Disclosure Statement
                              </span>
                              <div>
                                <div className="grid-row">
                                  <div className="grid-col flex-auto">
                                    <PDFPreviewButton
                                      data-testid="stin-preview-button"
                                      file={
                                        newPetitionData.corporateDisclosureFile
                                      }
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
                          <div className="grid-row margin-top-3">
                            {newPetitionData.contactSecondary && (
                              <>
                                <span
                                  className="usa-label usa-label-display margin-bottom-0"
                                  id="filing-contact-secondary"
                                >
                                  {"Spouse's contact information"}
                                </span>
                                <address aria-labelledby="filing-contact-secondary">
                                  <AddressDisplay
                                    contact={newPetitionData.contactSecondary}
                                  />
                                </address>
                                <div className="margin-top-1 display-flex-center">
                                  <span className="font-weight-600">
                                    Register for eService/filing:
                                  </span>
                                  <span className="margin-left-5">
                                    {newPetitionData.contactSecondary
                                      .hasConsentedToEService
                                      ? 'Yes'
                                      : 'No'}
                                  </span>
                                </div>
                                <div className="margin-top-1 display-flex-center">
                                  <span className="font-weight-600">
                                    Place of legal residence:
                                  </span>
                                  <span className="margin-left-5">
                                    {
                                      newPetitionData.contactSecondary
                                        .placeOfLegalResidence
                                    }
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid-row grid-gap margin-bottom-5">
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
                        <b>
                          In most cases, the Court must receive your
                          electronically filed Petition no later than 11:59 pm
                          Eastern Time on the last date to file.
                        </b>
                      </li>
                      <li>
                        Do not combine any additional documents with your
                        Petition.{' '}
                        <b>
                          Documents that might be evidence can be submitted at a
                          later time.
                        </b>
                      </li>
                      <li>
                        Confirm that all information being submitted appears as
                        you want it to appear.{' '}
                        <b>
                          After submitting your case to the Court, you will only
                          be able to make changes by filing a motion.
                        </b>
                      </li>
                    </ol>
                  </div>
                </div>
                <InfoNotificationComponent
                  alertInfo={{
                    message:
                      'This petition will not be filed with the Court until the Submit Documents & Create Case button is clicked.',
                  }}
                  dismissible={false}
                  scrollToTop={false}
                />

                <div className="margin-top-4">
                  <Button
                    data-testid="petition-review-submit-document"
                    id="submit-document"
                    type="submit"
                    onClick={() => {
                      updatedFilePetitionCompleteStep6Sequence();
                    }}
                  >
                    Submit Your Filing
                  </Button>
                  <Button
                    secondary
                    onClick={() => updatedFilePetitionGoBackAStepSequence()}
                  >
                    Back
                  </Button>
                  <Button link onClick={() => {}}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {form.petitionType === PETITION_TYPES.autoGenerated && (
            <NonMobile>
              <div
                className="grid-col padding-top-1"
                data-testid="petition-pdf-preview"
              >
                <PdfPreview heightOverride={true} />
              </div>
            </NonMobile>
          )}
        </div>
        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && <FileUploadErrorModal />}
      </>
    );
  },
);
